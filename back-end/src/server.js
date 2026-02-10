import 'dotenv/config';
import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import  admin  from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import  { fileURLToPath }  from 'url';
import cors from 'cors';
import multer from 'multer'

// Handle files with Multer temporarily before Firebase
const storage = multer.memoryStorage();
const upload = multer({ storage: storage});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Credentials
const credentials = JSON.parse(
    fs.readFileSync('./credentials.json')
);

// App Initialization
admin.initializeApp({
  credential: admin.credential.cert(credentials),
  storageBucket: 'full-stack-react-3739f.appspot.com'
});

const bucket = admin.storage().bucket();
const app = express();
app.use(express.json());

app.use(cors({
    origin: 'https://tqzqkd94-5173.use.devtunnels.ms',
    credentials: true,
}))




// -------------------------------- Public API Routes ---------------------------- 

// Register user
app.post('/api/register', async(req, res) =>{
    console.log("Registration request received for UID: ", req.body.uid);
    try{
        const { uid, email } = req.body;
        const existingUser = await db.collection('users').findOne({ uid });

        if( !existingUser ){
            const result = await db.collection('users').insertOne({
                uid,
                email,
                upvotedArticles: [],
                comments: [],
                isAdmin: false,
            });
            
            console.log("User inserted into DB:", result.insertedId);
            res.status(201).json({ message: "User registered successfully"})
        } else{
            console.log("User already exists with ID:", existingUser._id );
            res.status(200).json({ message: "User already exists"});
        }
    } catch(err){
        console.log("Registration error: ", err);
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
});


// ---------------------------- Auth Middleware ------------------------

app.use('/api', async function(req, res, next) {
    const { authtoken } = req.headers;

    console.log("Checking security for path:", req.path);

    const isPublicGet = req.method === 'GET' && 
                        !req.path.includes('edit-article') && 
                        !req.path.includes('profile');

    if (isPublicGet) {
        return next();
    }

    if (authtoken) {
        try {
            const firebaseUser = await admin.auth().verifyIdToken(authtoken);

            const userDoc = await db.collection('users').findOne({ uid: firebaseUser.uid });

            const isEmailAdmin = firebaseUser.email === 'admin@mail.com';
            const isDbAdmin = userDoc?.isAdmin === true;

            req.user = { 
                ...firebaseUser, 
                isAdmin: isEmailAdmin || isDbAdmin
            };
            next();
        } catch (err) {
            res.status(401).json({ message: "Invalid Token" });
        }
    } else {
        res.status(401).json({ message: "No token provided" });
    }
});


// ------------------------  Protected API Routes ------------------------

// ------------  GET ------------ 
// Edit article by name
app.get('/api/edit-article/:name', async(req, res) =>{
    const { name } = req.params;
    const article = await db.collection('articles').findOne({ name });

    if(article){
        res.json( article );
    } else{
        res.status(404).json({ message: "Article not found "});
    }

});

// Profile
app.get('/api/profile/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        
        const user = await db.collection('users').findOne({ uid: uid });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found in database" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Get all articles 
app.get('/api/articles', async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({ message: "Database connecting, please try again..." });
        }
        const articles = await db.collection('articles').find().toArray();
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: "Error fetching articles", err });
    }
});

// Get article by name
app.get('/api/articles/:name', async(req, res) =>{
    const { name } = req.params;
    const article = await db.collection('articles').findOne({ name });

    if(article){
        res.json( article );
    } else{
        res.status(404).json({ message: "Article not found "});
    }

});

// ------------  POST ------------ 
// Create a new article
app.post('/api/articles', upload.array('images'), async(req, res) => {

    // Destructure info from frontend
    const { articleTitle, articleText, type, eventDate, location } = req.body;
    
    console.log("Backend received type:", type);
    const { email, uid } = req.user;

    // Verify article title
    if(!articleTitle){
        return res.status(400).json({ message: "Error: Article title is required"});
    }

    // Url friendly article name
    const name = articleTitle.toLowerCase().split(' ').join('-');
    const imageUrls = [];

    // Debugging log
    console.log("REQUEST REACHED SERVER: ", req.body);

    // Upload files to Firebase
    if( req.files ){
        for( const file of req.files ){
            const fileName = `${Date.now()}_${file.originalname}`;
            const fileRef = bucket.file(`articles/${name}/${fileName}`);

            await fileRef.save(file.buffer, {
                metadata: { contentType: file.mimetype },
            });

            await fileRef.makePublic();

            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileRef.name}`;
            imageUrls.push( publicUrl )
        }
    }

    // Set Primary image & default to 1st
    const primaryImage = imageUrls.length > 0 ? imageUrls[0]: null;

    try {
        const newArticle = {
            name,
            title: articleTitle,
            content: [articleText],
            type: type,
            eventDate: eventDate || null, 
            location: location || null,
            attendees: [],          
            authorUid: uid, 
            upvotes: 0,
            comments: [],
            imageUrls: imageUrls,
            primaryImage: primaryImage
};

        const result = await db.collection('articles').insertOne(newArticle);
        res.status(201).json(newArticle); 
        
    } catch(err) {
        console.error("Critical DB Insert Error: ", err);
        res.status(500).json({ message: "Error saving article", error: err.message });
    }
});

// Upvote article
app.post('/api/articles/:name/upvote', async (req, res)=>{
    const{ name } = req.params;
    const { uid } = req.user;

    const updatedArticle = await db.collection('articles').findOneAndUpdate(
        { name },
        {
            $inc: { upvotes: 1 },
            $push: { upvoteIds: uid }, 
        },
        { returnDocument: "after" }
    );

    if (updatedArticle) {
        res.json(updatedArticle);
    } else {
        res.status(404).send("Article not found");
    }
});

// Comment on article
app.post('/api/articles/:name/comments', async(req, res)=>{
    // const name = req.params.name; following line is the equivalent in destructured form 
    const {name} = req.params;
    const {postedBy, text } = req.body;
    const newComment = {postedBy, text};

    const updatedArticle = await db.collection('articles').findOneAndUpdate({name}, {
        $push: {comments: newComment} // add new comment to comments array
    }, {
        returnDocument: "after",
    })

    res.json(updatedArticle);
});

app.post('/api/articles/:name/images', upload.array('images'), async(req, res) =>{
    const { name } = req.params;
    const imageUrls = [];

    // Upload new files to Firebase
    for (const file of req.files) {
        const fileName = `${Date.now()}_${file.originalname}`;
        const fileRef = bucket.file(`articles/${name}/${fileName}`);
        await fileRef.save(file.buffer, { metadata: { contentType: file.mimetype } });
        await fileRef.makePublic();
        imageUrls.push(`https://storage.googleapis.com/${bucket.name}/${fileRef.name}`);
    }

    // Push new URLs to MongoDB
    const updatedArticle = await db.collection('articles').findOneAndUpdate(
        { name },
        { $push: { imageUrls: { $each: imageUrls } } },
        { returnDocument: 'after' }
    );

    res.json(updatedArticle);


});

// Event sign up
app.post('/api/articles/:name/signup', async (req, res) => {
    const { name } = req.params;
    const { uid } = req.user;

    const updatedArticle = await db.collection('articles').findOneAndUpdate(
        { name },
        { $addToSet: { attendees: uid } },
        { returnDocument: 'after' }
    );

    if (!updatedArticle) 
        return res.status(404).json({ message: "Event not found" });

    res.json(updatedArticle);
});

// ------------  PUT ------------ 
app.put('/api/articles/:name', async(req, res) =>{
    const { name } = req.params;
    const { articleText } = req.body;
    const { uid, isAdmin } = req.user;

    try {
        const article = await db.collection('articles').findOne({ name });
        if (!article) return res.status(404).json({ message: "Article not found" });

        const isAuthor = article.authorUid === uid;
        
        // Allow editing for author / admin
        if (!isAuthor && !isAdmin) {
            return res.status(403).json({ message: "Unauthorized: Admins or Authors only." });
        }

        const updatedArticle = await db.collection('articles').findOneAndUpdate(
            { name },
            { $set: { content: [articleText] } },
            { returnDocument: 'after' }
        );

        res.json(updatedArticle);

    } catch(err){
        res.status(500).json({ message: "Error updating article: ", error: err.message });
    }
});

// ------------  DELETE ------------ 
app.delete('/api/articles/:name', async(req, res) =>{
    const { name } = req.params;

    console.log("Logged in user email:", req.user?.email);
    console.log("Is Admin flag on server:", req.user?.isAdmin);
    
    const article = await db.collection('articles').findOne({ name });
    console.log("Article Author UID:", article?.authorUid);
    console.log("My UID:", req.user?.uid);
    const { user } = req;

    

    if (!article) return res.sendStatus(404);

    const canDelete = user && (user.uid === article.authorUid || user.isAdmin);

    if (canDelete) {
        await db.collection('articles').deleteOne({ name });
        res.status(200).json({ message: "Deleted successfully" });
    } else {
        res.status(403).json({ message: "You do not have permission to delete this." });
    }
});

app.delete('/api/articles/:name/images', async( req, res ) =>{
    const { name } = req.params;
    const { imageUrl } = req.body;

    try{
        // Delete from firebase storage
        const fileRef = bucket.file(imageUrl.split(`${bucket.name}/`)[1]);
        await fileRef.delete();

        // Remove URL from MongoDB
        const updatedArticle = await db.collection('articles').findOneAndUpdate(
            { name },
            { 
                $pull: { imageUrls: imageUrl }, // Remove from array
            },
            { returnDocument: 'after' }
        );

        // Reset primary images
        if (updatedArticle.primaryImage === imageUrl) {
            const newPrimary = updatedArticle.imageUrls.length > 0 
                ? updatedArticle.imageUrls[0] 
                : null;
                
            await db.collection('articles').updateOne(
                { name },
                { $set: { primaryImage: newPrimary } }
            );
            // Re-fetch to get the updated document to send back
            const finalArticle = await db.collection('articles').findOne({ name });
            return res.json(finalArticle);
        }

        res.json(updatedArticle);
    } catch (err) {
        res.status(500).json({ message: "Error deleting image", error: err.message });
    }
});


// ----------------------- Static Files & React Routing -------------------
app.use(express.static(path.join(__dirname, '../dist')));

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Conenct to DB
let db;
async function connectToDB(){
    // instance of mongo client
    const uri = !process.env.MONGODB_USERNAME 
        // Local connection
        ? 'mongodb://127.0.0.1:27017' 
        // Production / deployed
        : `mongodb+srv://${ process.env.MONGODB_USERNAME }:${ process.env.MONGODB_PASSWORD }@cluster0.3ridrrt.mongodb.net/`

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    await client.connect();

    db = client.db('full-stack-react-db');
}

async function start(){
    try{
        await connectToDB();
        console.log("\nDatabase connection successful\n");
        
        const PORT = process.env.PORT || 8000;

        // Start server message
        app.listen(PORT, () => {
            console.log('Server is listening on port ' + PORT);
        });

    } catch (err){
        console.error("\nDatabase connection failed: ", err, "\n");
        process.exit(1);
    }
}

// Start Server
start();



