import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import  admin  from 'firebase-admin';
import fs from 'fs';


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
    const uri = 'mongodb://127.0.0.1:27017';

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
    } else{ 
        res.sendStatus(400); // response did not include all needed info
    }
})

// Hello GET for testing`
app.get('/hello', function(req, res){
    res.send('Hello from GET endpoint');

})

// Upvote an article
app.post('/api/articles/:name/upvote', async (req, res)=>{
    const{name } = req.params;
    const updatedArticle = await db.collection('articles').findOneAndUpdate({name}, {
        $inc: {upvotes: 1} // increment property by 1
    }, {
        returnDocument: "after",

    });

    res.json(updatedArticle);


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

async function start(){
    await connectToDB();
    // Start server message
    app.listen(8000, function(){
        console.log('Server is listening on port 8000');
    });
}
// Start server
start();


