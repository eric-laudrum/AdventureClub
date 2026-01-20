import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';


const articleInfo = [
    { name: 'testing_1', upvotes: 0, comments: [] },
    { name: 'testing_2', upvotes: 0, comments: [] },
    { name: 'testing_3', upvotes: 0, comments: [] },
]

const app = express();

app.use(express.json());

// Load article
app.get('/api/articles/:name', async(req, res) =>{
    const {name} = req.params;

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

    const db = client.db('full-stack-react-db');

    const article = await db.collection('articles').findOne({ name })

    if (article) {
        res.json(article);
    } else {
        res.sendStatus(404);
    }
});

// Hello GET for testing`
app.get('/hello', function(req, res){
    res.send('Hello from GET endpoint');

})

// Upvote an article
app.post('/api/articles/:name/upvote', (req, res)=>{
    const article = articleInfo.find(a => a.name === req.params.name);
    article.upvotes += 1;

    res.json(article);
})


// Comment on an article
app.post('/api/articles/:name/comments', (req, res)=>{
    // const name = req.params.name; following line is the equivalent in destructured form 
    const {name} = req.params;
    const {postedBy, text } = req.body;
    const article = articleInfo.find(a => a.name === name);
    article.comments.push({
        postedBy,
        text,
    });
    res.json(article);
})




// GET hello name
app.get('/hello/:name', function(req, res){
    res.send('Hello ' + req.params.name);
});

// POST hello name
app.post('/hello', function(req, res){
    res.send('Hello, ' + req.body.name + ' from POST endpoint')
});

// Start server message
app.listen(8000, function(){
    console.log('Server is listening on port 8000');
});
