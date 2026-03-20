import { useState } from 'react';
import axios from 'axios';
import useUser from "../../hooks/useUser";


export default function AddArticleForm({  onArticleUpdated }){

    const { user, isAdmin, isLoading } = useUser();

    const [ titleText, setArticleTitleText ] = useState('');
    const [ articleText, setArticleText ] = useState('');
    const [ files, setFiles ] = useState([]);
    const [ isEvent, setIsEvent ] = useState(false);
    const [ eventDate, setEventDate ] = useState('');
    const [ location, setLocation ] = useState('');


    if ( isLoading) return null;
    if ( !isAdmin) return null;

    const submitArticle = async () => {

        // Verify user
        if( !user ){
            console.log("Error: no user logged in");
            return;
        }

        try {
            const token = await user.getIdToken();

            const formData = new FormData();
            formData.append('articleTitle', titleText);
            formData.append('articleText', articleText);
            formData.append('type', isEvent ? 'event' : 'article');
            formData.append('eventDate', eventDate);
            formData.append('location', location);

            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }

            const response = await axios.post(`/api/articles`, formData, { 
                headers: {
                    authtoken: token,
                    'Content-Type' : 'multipart/form-data'
                } 
            });
            
            if (onArticleUpdated) {
                onArticleUpdated(response.data);
            }

            // Reset form
            setArticleTitleText('');
            setArticleText('');
            setFiles([]);
            setIsEvent(false);
            setEventDate('');
            setLocation('');

        } catch (error) {
            console.error("Error adding article: ", error);
        }
    };

    if (isLoading || !isAdmin) return null;

    return (
        <div className="section-container">
            <div className="about-content-card admin-form-card">
                <header className="form-header">
                    <h3>✨ Create New Post</h3>
                    <div className="toggle-wrapper">
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={isEvent} 
                                onChange={(e) => setIsEvent(e.target.checked)} 
                            />
                            <span className="slider round"></span>
                        </label>
                        <span className="toggle-label">{isEvent ? "Event Mode" : "Standard Article"}</span>
                    </div>
                </header>

                <div className="form-body">
                    {isEvent && (
                        <div className="event-details-grid">
                            <div className="input-group">
                                <label>Event Date & Time</label>
                                <input 
                                    type="datetime-local" 
                                    className="styled-input"
                                    value={eventDate} 
                                    onChange={(e) => setEventDate(e.target.value)} 
                                />
                            </div>
                            <div className="input-group">
                                <label>Location / Link</label>
                                <input 
                                    type="text" 
                                    className="styled-input"
                                    placeholder="e.g. Community Center or Zoom Link" 
                                    value={location} 
                                    onChange={(e) => setLocation(e.target.value)} 
                                />
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <label>Headline</label>
                        <input 
                            className="styled-input title-field" 
                            type="text" 
                            placeholder="Give your post a catchy title..."
                            value={titleText} 
                            onChange={e => setArticleTitleText(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Content</label>
                        <textarea
                            className="styled-textarea" 
                            placeholder="Write your story here..."
                            value={articleText} 
                            onChange={e => setArticleText(e.target.value)}
                            rows="8"
                        />
                    </div>

                    <div className="input-group file-group">
                        <label>Media Uploads</label>
                        <div className="file-input-wrapper">
                            <input type="file" multiple onChange={e => setFiles(e.target.files)} id="file-upload" />
                            <label htmlFor="file-upload" className="file-label">
                                📁 {files.length > 0 ? `${files.length} files selected` : "Choose Images"}
                            </label>
                        </div>
                    </div>

                    <button className="submit-post-btn" onClick={submitArticle}>
                        Publish to Loop In
                    </button>
                </div>
            </div>
        </div>
    );
}