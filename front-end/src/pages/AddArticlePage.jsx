import { useState } from 'react';
import axios from 'axios';
import  useUser  from '../use_user';


export default function AddArticleForm({ articleName, onArticleUpdated }){

    const [ titleText, setArticleTitleText ] = useState('');
    const [ articleText, setArticleText ] = useState('');
    const { user } = useUser();

    const submitArticle = async () => {

        // Verify user
        if( !user ){
            console.log("Error: no user logged in");
            return;
        }


        try{
            const token = user && await user.getIdToken();

            const headers = token ? { authtoken: token } : {};

            const response = await axios.post(`/api/articles`, {
                articleTitle: titleText,
                articleText: articleText,
            }, { headers });

            const updatedArticleData = response.data;
            if ( onArticleUpdated ){
                onArticleUpdated( updatedArticleData );
            }

            // Reset form
            setArticleTitleText('');
            setArticleText('');


        } catch( error ){
            console.error("\nError adding article: ", error)
        }
    };

    return(
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
                    <input
                        className="article_text_input" 
                        type="text" 
                        value={ articleText } 
                        onChange={e => setArticleText(e.target.value)}
                    />

                </label>


                {/* --- ADD BUTTON --- */}
                <button 
                    className="add_button" 
                    onClick={ submitArticle }>Add Article
                </button>


            </div>
        </div>
    )
}