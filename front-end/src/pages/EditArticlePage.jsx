import { useState, useEffect } from 'react';
import { useParams, useLoaderData, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CommentsList from '../CommentsList';
import AddCommentForm from '../AddCommentForm';
import useUser from "../../hooks/useUser";

export default function EditArticlePage(){

    const { name } = useParams();
    const { articleData } = useLoaderData();
    const { user } = useUser();
    const navigate = useNavigate();
    
    const [ upvotes, setUpvotes ] = useState(articleData?.upvotes || 0);
    const [ comments, setComments ] = useState(articleData?.comments || []);
    const [ articleText, setArticleText ] = useState(articleData?.content?.[0] || "");


    const onCancelClicked = () => {
        // Redirects the user back to the specific article page
        navigate(`/articles/${name}`);
    };

    // Sync with data loader
    useEffect(() => {
        setUpvotes(articleData?.upvotes || 0);
        setComments(articleData?.comments || []);
        setArticleText(articleData?.content?.[0] || "");
    }, [articleData]);

    async function onUpvoteClicked() {
        if (!user) return;
        const token = await user.getIdToken();
        const headers = { authtoken: token };
        const response = await axios.post(`/api/articles/${name}/upvote`, null, { headers });
        setUpvotes(response.data.upvotes);
    }

    async function onAddComment({ nameText, commentText }) {
        if (!user) return;
        const token = await user.getIdToken();
        const headers = { authtoken: token };
        const response = await axios.post(`/api/articles/${name}/comments`, {
            postedBy: nameText,
            text: commentText,
        }, { headers });
        setComments(response.data.comments);
    }

    const handleDeleteImage = async (imageUrl) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this image?");
        if (!confirmDelete) return;

        try {
            const token = await user.getIdToken();
            const response = await axios.delete(`/api/articles/${name}/images`, {
                data: { imageUrl },
                headers: { authtoken: token }
            });
            // If deletion is successful, we should probably update the UI 
            // by refreshing the articleData or manually updating state
            alert("Image deleted successfully");
        } catch (err) {
            console.error("Error deleting image:", err);
            alert("Error: Failed to delete image");
        }
    };

    async function onSaveClicked() {
        try {
            const token = await user.getIdToken();
            const response = await axios.put(`/api/articles/${name}`, {
                articleText: articleText // Matches your backend req.body
            }, {
                headers: { authtoken: token }
            });

            alert("Article saved successfully!");
        } catch (err) {
            console.error("Save error:", err);
            alert("Failed to save article.");
        }
    }

    return (
        <div className="section_container">
            <h2 className='section_title'>Editing: {articleData.title}</h2>
            
            {/* TEXT EDITOR */}
            <textarea
                className="edit_textarea"
                value={articleText}
                onChange={e => setArticleText(e.target.value)}
                rows="15"
                style={{ width: '100%', marginBottom: '10px' }}
            />

            <div className="button_group">
                <button className="save_button" onClick={onSaveClicked}>Save Changes</button>
                <button className="cancel_button" onClick={onCancelClicked}>Cancel</button>
            </div>

            {/* IMAGE MANAGEMENT */}
            <div className="image_edit_section">
                {articleData.imageUrls?.map((url, i) => (
                    <div key={i} className="image_wrapper">
                        <img src={url} alt="article" className="edit_preview_img" />
                        <button onClick={() => handleDeleteImage(url)}>Delete Image</button>
                    </div>
                ))}
            </div>

            <hr />
            <CommentsList comments={comments} />
            <AddCommentForm onAddComment={onAddComment} />
        </div>
    );
}