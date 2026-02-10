import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useUser from "../../hooks/useUser";


export default function AddArticleForm({ articleName, onArticleUpdated }){

    const [ titleText, setArticleTitleText ] = useState('');
    const [ articleText, setArticleText ] = useState('');
    const [ files, setFiles ] = useState([]);

    const [isEvent, setIsEvent] = useState(false);
    const [eventDate, setEventDate] = useState('');
    const [location, setLocation] = useState('');

    const { user } = useUser();


    const submitArticle = async () => {
        // Verify user - only users can submit articles
        if( !user ){
            console.log("Error: no user logged in");
            return;
        }

        try{
            const token = user && await user.getIdToken();

            const headers = token ? { 
                authtoken: token,
                'Content-Type': 'multipart/form-data'
            } : {};

            // Process form data
            const formData = new FormData();
            formData.append('articleTitle', titleText);
            formData.append('articleText', articleText);
            formData.append('type', isEvent ? 'event' : 'article');
            formData.append('eventDate', eventDate);
            formData.append('location', location);

            // Add files
            for( let i = 0; i < files.length; i++){
                formData.append('images', files[i]);
            }

            // 
            const response = await axios.post(`/api/articles`, formData, { 
                headers:{
                    authtoken: token,
                    'Content-Type' : 'multipart/form-data'
                } 
            });
            
            const updateArticleData = response.data;

            // 
            if( onArticleUpdated ){
                onArticleUpdated( updateArticleData );
            }

            // Reset form
            setArticleTitleText('');
            setArticleText('');
            setFiles([]);
            setIsEvent(false);
            setEventDate('');
            setLocation('');


        } catch( error ){
            console.error("\nError adding article: ", error)
        }
    };

    return(
        <>
        <div className="add_article_container">

            <h3>New Article</h3>

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
                        value={eventDate} 
                        onChange={(e) => setEventDate(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Location (or link)" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                    />
                </div>
            )}


            <div className="new_article_form">

                {/* --- TITLE --- */}
                <label className="input_field">
                    Title:
                    <input className="article_title_input" 
                        type="text" 
                        value={ titleText } 
                        onChange={e => setArticleTitleText(e.target.value)}
                    />
                    
                </label>

                {/* --- ARTICLE TEXT --- */}
                <label className="input_field">
                    Text:
                    <textarea
                        className="article_text_input" 
                        value={ articleText } 
                        onChange={ e => setArticleText(e.target.value)}
                        rows="10"
                    />

                </label>

                {/* ADD IMAGES */}
                <label className="input_field">
                    Image(s)
                    <input
                        type="file"
                        multiple
                        onChange={ e => setFiles( e.target.files )}
                        />
                </label>


                {/* --- ADD BUTTON --- */}
                <button 
                    className="add_button" 
                    onClick={ submitArticle }>Add Article
                </button>


            </div>
        </div>
        </>
    )
}