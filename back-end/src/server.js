import express from 'express';

const articleInfo = [
    { name: 'testing_1', upvotes: 0, comments: [] },
    { name: 'testing_2', upvotes: 0, comments: [] },
    { name: 'testing_3', upvotes: 0, comments: [] },
]

const app = express();

app.use(express.json());

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
    // const name = req.params.name;
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
