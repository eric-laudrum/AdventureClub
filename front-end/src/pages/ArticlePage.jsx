import {useState } from 'react';
import { useParams, useLoaderData } from 'react-router-dom';
import axios from 'axios';
import CommentsList from '../CommentsList';
import AddCommentForm from '../AddCommentForm';
import articles from '../article-content';
import  useUser  from '../use_user';



export default function ArticlePage(){
    const { name } = useParams();
    const { upvotes: initialUpvotes, comments: initialComments} = useLoaderData();
    const[upvotes, setUpvotes] = useState(initialUpvotes);
    const [comments, setComments] = useState(initialComments);

    const { isLoading, user } = useUser();


    const article = articles.find(a => a.name === name);
    if(!article){
        return <h1>Error: Article not found</h1>
    }
 
    async function onUpvoteClicked(){
        const token = user && await user.getIdToken();
        const headers = token ? { authtoken: token } : {};
        const response = await axios.post('/api/articles/' + name + '/upvote', null, {headers});
        const updatedArticleData = response.data;
        setUpvotes(updatedArticleData.upvotes);
    }

    async function onAddComment({nameText, commentText}){
        const token = user && await user.getIdToken();
        const headers = token ? { authtoken: token } : {};
        const response = await axios.post('/api/articles/' + name + '/comments', {
            postedBy: nameText,
            text: commentText,
        }, { headers });
        const updatedArticleData = response.data;
        setComments(updatedArticleData.comments);
    }


    return(
        <>
        <div className="section_container">

            <div className="article-head">
            
                {/* -- Article Title -- */}
                <h2 className='section_title'>{article.title}</h2>
                {user && <button className="upvote-button" onClick={( onUpvoteClicked )}>Upvote</button> }
            
            </div>
            
            
            {/* -- Upvotes -- */}
            <p className="article_text">{upvotes} upvotes</p>
            
            {/* -- Article Text -- */}
            {article.content.map(p => <p key={p}>{p}</p> )}
            

            {/* -- Comment Form -- */}
            {user 
                ? <AddCommentForm onAddComment={onAddComment}/>
                : <p>Log in to add a comment </p> 
            }

            {/* -- Comments -- */}
            <CommentsList comments={comments}/>

        </div>
        
        </>

        
    );
}

export async function loader({params}){
    const response = await axios.get('/api/articles/' + params.name);
    const {upvotes, comments} = response.data;
    return {upvotes, comments};
}