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

    return(
        
        <div className="section-container">
            <div className="about-content-card">
                <h3>New Article / Event</h3>
                
                <div className="new_article_form">
                    <label>
                        <input 
                            type="checkbox" 
                            checked={isEvent} 
                            onChange={(e) => setIsEvent(e.target.checked)} 
                        /> 
                        Is this an Event?
                    </label>

                    {isEvent && (
                        <div className="event-fields">
                            <input 
                                type="datetime-local" 
                                className="article_title_input"
                                value={eventDate} 
                                onChange={(e) => setEventDate(e.target.value)} 
                            />
                            <input 
                                type="text" 
                                className="article_title_input"
                                placeholder="Location (or link)" 
                                value={location} 
                                onChange={(e) => setLocation(e.target.value)} 
                            />
                        </div>
                    )}

                    <label className="input_field">
                        Title:
                        <input className="article_title_input" 
                            type="text" 
                            value={ titleText } 
                            onChange={e => setArticleTitleText(e.target.value)}
                        />
                    </label>

                    <label className="input_field">
                        Text:
                        <textarea
                            className="article_text_input" 
                            value={ articleText } 
                            onChange={ e => setArticleText(e.target.value)}
                            rows="10"
                        />
                    </label>

                    <label className="input_field">
                        Image(s):
                        <input type="file" multiple onChange={ e => setFiles( e.target.files )} />
                    </label>

                    <button className="edit-button" style={{color: 'white', marginTop: '20px'}} onClick={ submitArticle }>
                        Post to Loop In
                    </button>
                </div>
            </div>
        </div>
    );
}