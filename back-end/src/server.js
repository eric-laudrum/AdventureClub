import 'dotenv/config';
import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import  admin  from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import  { fileURLToPath }  from 'url';
import cors from 'cors';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Credentials
const credentials = JSON.parse(
    fs.readFileSync('./credentials.json')
);

// App Initialization
admin.initializeApp({
  credential: admin.credential.cert(credentials)
});

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'https://tqzqkd94-5173.use.devtunnels.ms',
    credentials: true,
}))


// -------------------------------- Public API Routes ---------------------------- 

//  ------------ GET ------------ 
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
app.get('/api/articles', async(req, res) =>{
    try{
        const articles = await db.collection('articles').find().toArray();
        res.json( articles );
    } catch(err){
        res.status(500).json({ message: "Error fetching articles: ", err});
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

app.use(async function(req, res, next){

    console.log("Middleware triggered for: ", req.url);
    const { authtoken } = req.headers;
    
    if( authtoken ){
        try{
            const user = await admin.auth().verifyIdToken( authtoken );
            console.log("Token verified for: ", user.email);
            req.user = user;
            next(); 
        } catch ( err ){
            console.log("Token verification failed: ", err.message);
            res.status(401).json({ message: "Error: Invalid Token ", err })
        }
    
    } else{ 
        console.log("No authtoken found in headers");
        res.sendStatus(401);
    }
});

// Create a new article
app.post('/api/articles', async(req, res) => {
    

    console.log("\n\n/////////////////Attempt to Create New Article/////////////////");
    console.log("User from Token:", req.user.email);
    console.log("Data received:", req.body);
    // Destructure info from frontend
    const { articleTitle, articleText } = req.body;
    const { email, uid } = req.user;

    // Verify article title
    if(!articleTitle){
        return res.status(400).json({ message: "Error: Article title is required"});
    }

    // Url friendly article name
    const name = articleTitle.toLowerCase().split(' ').join('-');

    console.log("REQUEST REACHED SERVER: ", req.body);

    try {
        const newArticle = {
            name: name,
            title: articleTitle,
            content: [ articleText ],
            upvotes: 0,
            upvoteIds: [],
            comments: [],
            authorUid: uid,
            authorEmail: email
        };

        const result = await db.collection('articles').insertOne(newArticle);

        const verifyArticle = await db.collection('articles').findOne({ _id: result.insertedId });
        console.log("VERIFICATION FROM DB:", verifyArticle);
        
        console.log("Insert Result:", result);
        
        res.status(201).json(newArticle); 
        
    } catch(err) {
        console.error("Critical DB Insert Error: ", err);
        res.status(500).json({ message: "Error saving article", error: err.message });
    }
});

// ------------------------  Protected API Routes ------------------------

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




// ----------------------- Static Files & React Routing -------------------
app.use(express.static(path.join(__dirname, '../dist')))

app.get(/^(?!\/api).+/, (req, res) =>{
    res.sendFile(path.join(__dirname, '../dist/index.html'));
})

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

const PORT = process.env.PORT || 8000;
async function start(){




    try{
        await connectToDB();
        console.log("\nDatabase connection successful\n");
        
        // Start server message
        app.listen(PORT, () => {
            console.log('Server is listening on port ' + PORT);
        });
    } catch (err){
        console.error("\nDatabase connection failed: ", err, "\n");
        process.exit(1);
    }
}

app.use(express.static(path.join(__dirname, '../dist')))

// Start server
start();


