import {useState, useEffect } from 'react';
import { useParams, useLoaderData } from 'react-router-dom';
import axios from 'axios';
import CommentsList from '../CommentsList';
import AddCommentForm from '../AddCommentForm';
import useUser from "../../hooks/useUser";


export default function ArticlePage(){
    const { name } = useParams();
    const { articleData } = useLoaderData();
    const [upvotes, setUpvotes] = useState(articleData?.upvotes || 0);
    const [comments, setComments] = useState(articleData?.comments || []);

    const { isLoading, user } = useUser();

 
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

    useEffect(() => {
    setUpvotes(articleData.upvotes);
    setComments(articleData.comments);
}, [articleData]);


    return(
        <>
        <div className="section_container">

            <div className="article_head">
            
                {/* -- Article Title -- */}
                <h2 className='section_title'>{articleData.title}</h2>
                { user && <button className="upvote_button" onClick={( onUpvoteClicked )}>Upvote</button> }
            
            </div>
            
            {/* IMAGE */}
                {articleData.primaryImage && (
                    <img
                        src={ articleData.primaryImage }
                        alt={ articleData.title }
                        className="article_image"
                        />
                )}
            
            {/* -- Upvotes -- */}
            <p className="article_text">{upvotes} upvotes</p>
            
            {/* -- Article Text -- */}
            {articleData.content.map((p, i) => <p key={i} className="article_text">{p}</p> )}
            

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
    return { articleData: response.data };
}