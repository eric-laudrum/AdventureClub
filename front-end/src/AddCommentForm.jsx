import { useState } from 'react';

export default function AddCommentForm({ onAddComment }){
    const [nameText, setNameText] = useState('');
    const [commentText, setCommentText] = useState('')
    
    return(
        <div className="comment_form">
            <h3 className="sub_title">Add a Comment</h3>

            <label>
                Title:
                <input className="article_title_input" type="text" value={ nameText } onChange={e => setNameText(e.target.value)}/>
            </label>
            
            <label>
                Text:
                <input className="article_text_input" type="text" value={ commentText } onChange={e => setCommentText(e.target.value)}/>
            </label>

            <button className="add_comment" onClick={()=> {
                onAddComment( {nameText, commentText});
                setNameText('');
                setCommentText('');
            }}>Add Comment</button>
        </div>
    )
}