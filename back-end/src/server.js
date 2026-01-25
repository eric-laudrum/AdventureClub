import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import  admin  from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import  { fileURLToPath }  from 'url';

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


// Public API Routes -------------------------------------------------- 
// Profile
app.get('/api/profile/:id', async(req, res)=>{
    try{
        const { id } = req.params;
        const user = await db.collection('users').findOne({ _id: new ObjectId(id) });

        if( user ){
            const { password, ...publicProfile } = user;
            res.json( publicProfile );

        } else {
            res.status(404).json({ message: "Error: User not found: " });
        }
    } catch(err){
        res.status(500).json({ message: "Server Error: " + err });
    }

});

// Load article
app.get('/api/articles/:name', async(req, res) =>{
    const { name } = req.params;
    const article = await db.collection('articles').findOne({ name });
    article ? res.json(article) : res.sendStatus(404);
});

// Auth Middleware ----------------------------------------------------
app.use(async function(req, res, next){
    const { authtoken } = req.headers;
    if( authtoken ){
        try{
            const user = await admin.auth().verifyIdToken( authtoken );
            req.user = user;
            next(); 
        } catch ( err ){
            res.status(401).json({ message: "Error: Invalid Token ", err })
        }
    
    } else{ 
        res.sendStatus(400);
    }
});

// Protected API Routes ------------------------------------------------ 
// Upvote an article
app.post('/api/articles/:name/upvote', async (req, res)=>{
    const{ name } = req.params;
    const { uid } = req.user;

    const article = await db.collection('articles').findOne({ name });

    const upvoteIds = article.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.includes(uid);

    if(canUpvote){
        const updatedArticle = await db.collection('articles').findOneAndUpdate({name}, {
        $inc: { upvotes: 1 },
        push: {upvoteIds: uid },
    }, {
        returnDocument: "after",
    });

        res.json(updatedArticle);

    } else {
        res.sendStatus(403); // User not authorized
    }
});

// Comment on an article
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


// Static Files & React Routing --------------------------------------------
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
        : `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.3ridrrt.mongodb.net/?appName=Cluster0`

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














const PORT = process.env.PORT || 8080; // Backup port 8080 if one cannot be found
async function start(){

    // Start server message
    app.listen(PORT, () => {
        console.log('Server is listening on port ' + PORT);
    });
    try{
        await connectToDB();
        console.log("\nDatabase connection successful\n");
    } catch (err){
        console.error("\nDatabase connection failed: ", err, "\n");
    }
}

app.use(express.static(path.join(__dirname, '../dist')))

app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, '../dist/index.html'));
})
// Start server
start();


