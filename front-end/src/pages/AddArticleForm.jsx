import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import  useUser  from '../use_user';


export default function AddArticleForm({ articleName, onArticleUpdated }){

    const [ titleText, setArticleTitleText ] = useState('');
    const [ articleText, setArticleText ] = useState('');
    const [ files, setFiles ] = useState([]);
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


        } catch( error ){
            console.error("\nError adding article: ", error)
        }
    };

    return(
        <>
        <div className="add_article_container">

            <h3>New Article</h3>
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