import { useState } from 'react';


export default function AddArticleForm( onAddArticle ){

    const [ titleText, setArticleTitleText ] = useState('');
    const [ articleText, setArticleText ] = useState('');
    

    return(
        <div>
            <h3>New Article</h3>
            <label>
                Title:
                <input type="text" value={ titleText } onChange={e => setNameText(e.target.value)}/>
            </label>
            <label>
                Text:
                <input className="article_text_input" type="text" value={ articleText } onChange={e => setArticleText(e.target.value)}/>
            </label>
            <button onClick={()=> {
                onAddArticle( {titleText, articleText});
                setArticleTitleText('');
                setArticleText('');
            }}>Add Comment</button>
        </div>
    )
}