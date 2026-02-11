import {useState, useEffect } from 'react';
import { useParams, useLoaderData, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CommentsList from '../CommentsList';
import AddCommentForm from '../AddCommentForm';
import useUser from "../../hooks/useUser";


export default function ArticlePage(){
    const { name } = useParams();
    const { articleData } = useLoaderData();
    const { user } = useUser();
    const navigate = useNavigate();

    const [ upvotes, setUpvotes] = useState(articleData?.upvotes || 0);
    const [ comments, setComments] = useState(articleData?.comments || []);
    const [isEditing, setIsEditing] = useState(false);
    const [articleText, setArticleText] = useState(articleData?.content?.[0] || "");
    const [ imageToUpload, setImageToUpload ] = useState(null);

    // Sync state when navigating
    useEffect(() => {
        setUpvotes(articleData?.upvotes || 0);
        setComments(articleData?.comments || []);
        setArticleText(articleData?.content?.[0] || "");
    }, [articleData]);

    console.log("Current Article Data:", articleData);

 
    async function onUpvoteClicked(){
        const token = user && await user.getIdToken();
        const headers = token ? { authtoken: token } : {};
        const response = await axios.post('/api/articles/' + name + '/upvote', null, {headers});
        const updatedArticleData = response.data;
        setUpvotes(updatedArticleData.upvotes);
    }

    async function onAddComment({ nameText, commentText }){
        const token = user && await user.getIdToken();
        const headers = token ? { authtoken: token } : {};
        const response = await axios.post('/api/articles/' + name + '/comments', {
            postedBy: nameText,
            text: commentText,
        }, { headers });
        const updatedArticleData = response.data;
        setComments(updatedArticleData.comments);
    }

    async function onUploadImage(){
        if( !imageToUpload ) return;

        const token = await user.getIdToken();
        const formData = new FormData();
        formData.append('images', imageToUpload);

        try{
            const response = await axios.post(`/api/articles/${name}/images`, formData, {
                headers:{
                    'Content-Type': 'multipart/form-data',
                    authtoken: token
                }
            });

            if (response.data.imageUrls) {
                window.location.reload(); 
            }

            alert('Image uploaded successfully.');
            setImageToUpload( null ); // Clear input
        } catch( err ){
            alert("Error: Image upload failed.")
        }
       
    }

    async function onSaveClicked() {
        const token = await user.getIdToken();
        try {
            const response = await axios.put(`/api/articles/${name}`, { // Define response here
                articleText: articleText
            }, { headers: { authtoken: token } });
            
            setArticleText(response.data.content[0]); 
            setIsEditing(false);
            alert("Article saved successfully");
        } catch (err) {
            alert("Failed to save article");
        }
    }

    async function onDeleteArticle() {

        if (user.uid !== articleData.authorUid && !user.isAdmin) {
            alert("You don't have permission to delete this.");
            return;
        }

        const confirmDelete = window.confirm("PERMANENTLY delete this entire article?");
        if (!confirmDelete) return;

        const token = await user.getIdToken();
        try {
            // You'll need to ensure this route exists in your Express backend
            await axios.delete(`/api/articles/${name}`, {
                headers: { authtoken: token }
            });
            navigate('/articles'); // Send user back to list
        } catch (err) {
            alert("Error deleting article");
        }
    }

    async function onSignupClicked() {
        const token = await user.getIdToken();
        try {
            const response = await axios.post(`/api/articles/${name}/signup`, null, {
                headers: { authtoken: token }
            });
            
            alert("Success! You are signed up.");
            window.location.reload(); 
        } catch (err) {
            alert("Failed to sign up for event.");
        }
    }

    return(
        <div className="section_container">
            <div className="article_head">
                {/* -- ARTICLE TITLE Title -- */}
                <h2 className='section_title'>{articleData.title}</h2>
                
                {/* ADMIN CONTROLS */}
                {user && (user.uid === articleData.authorUid || user.isAdmin) && (
                <div className="admin_controls">
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)}>Edit Article</button>
                    ) : (
                        <>
                            <button onClick={onSaveClicked} style={{backgroundColor: 'green', color: 'white'}}>Save</button>
                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                            <button onClick={onDeleteArticle} style={{backgroundColor: 'red', color: 'white'}}>Delete Article</button>
                        </>
                    )}
                </div>
            )}
            </div>
            
            {/* IMAGE SECTION */}
            <div className="images_container">
                {articleData.imageUrls?.map((url, i) => (
                    <div key={i} className="image_edit_wrapper">
                        <img src={url} className="article_image" alt="content" />
                        {isEditing && (
                            <button onClick={() => handleDeleteImage(url)} className="del_img_btn">Delete Photo</button>
                        )}
                    </div>
                ))}
                
                {/* UPLOAD NEW PHOTO (Only in Edit Mode) */}
                {isEditing && (
                    <div className="upload_section" style={{marginTop: '20px', border: '1px dashed #ccc', padding: '10px'}}>
                        <h4>Add New Photo</h4>
                        <input type="file" onChange={e => setImageToUpload(e.target.files[0])} />
                        <button onClick={onUploadImage} disabled={!imageToUpload}>Upload</button>
                    </div>
                )}
            </div>

            {/* CONTENT SECTION */}
            {isEditing ? (
                <textarea 
                    className="edit_textarea"
                    value={articleText}
                    onChange={e => setArticleText(e.target.value)}
                    rows="15"
                    style={{ width: '100%', marginTop: '20px' }}
                />
            ) : (
                articleData.content.map((p, i) => <p key={i} className="article_text">{p}</p>)
            )}


            
            {/* Main view - Upvote & Comment */}
            {!isEditing && (
                <>
                    <div className="upvote_section">
                        <p className="article_text">{upvotes} upvotes</p>
                        {user && <button className="upvote_button" onClick={onUpvoteClicked}>Upvote</button>}
                    </div>

                    {/*{(articleData.type === 'event' || articleData.location) && (*/}
                    {true && (
                        <div className="event_signup_container" style={{ border: '1px solid #ddd', padding: '20px', margin: '20px 0' }}>
                            <h3>Event Details</h3>
                            <p><strong>Starts:</strong> {articleData.eventDate ? new Date(articleData.eventDate).toLocaleString() : 'TBD'}</p>
                            <p><strong>Location:</strong> {articleData.location}</p>

                            {user ? (
                                <button 
                                    onClick={onSignupClicked}
                                    disabled={articleData.attendees?.includes(user.uid)}
                                    className="signup_btn"
                                >
                                    {articleData.attendees?.includes(user.uid) ? "You're attending" : "Sign Up"}
                                </button>
                            ) : (
                                <p>Log in to sign up for this event.</p>
                            )}
                        </div>
                    )}
                    
                    {user 
                        ? <AddCommentForm onAddComment={onAddComment}/>
                        : <p>Log in to add a comment </p> 
                    }
                    <CommentsList comments={comments}/>
                </>
            )}


    


        </div>
    );
}

export async function loader({params}){
    const response = await axios.get('/api/articles/' + params.name);
    return { articleData: response.data };
}