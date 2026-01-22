import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import  admin  from 'firebase-admin';
import fs from 'fs';
import path from 'path';

import  { fileURLToPath }  from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const credentials = JSON.parse(
    fs.readFileSync('./credentials.json')
);

admin.initializeApp({
  credential: admin.credential.cert(credentials)
});

const app = express();

app.use(express.json());

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

app.use(express.static(path.join(__dirname, '../dist')))

app.get(/^(?!\/api).+/, (req, res) =>{
    res.sendFile(path.join(__dirname, '../dist/index.html'));
})

// Load article
app.get('/api/articles/:name', async(req, res) =>{
    const { name } = req.params;
    
    const article = await db.collection('articles').findOne({ name });

    if (article) {
        res.json(article);
    } else {
        res.sendStatus(404);
    }
});

// This applies to everything after
app.use(async function(req, res, next){
    const { authtoken } = req.headers;
    if( authtoken ){
        const user = await admin.auth().verifyIdToken( authtoken ); // return user if token is valid
        req.user = user;
        next(); // done with middleware callback - continue with route handler
    } else{ 
        res.sendStatus(400); // response did not include all needed info
    }
});



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
// Start server
start();


