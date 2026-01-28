import {useState} from 'react';

export default function AddCommentForm({ onAddComment }){
    const [nameText, setNameText] = useState('');
    const [commentText, setCommentText] = useState('')
    
    return(
        <div className="comment-form">
            <h3 className="sub-title">Add a Comment</h3>
            <label>
                Title:
                <input className="article-title-input" type="text" value={ nameText } onChange={e => setNameText(e.target.value)}/>
            </label>
            <label>
                Text:
                <input className="article-text-input" type="text" value={ commentText } onChange={e => setCommentText(e.target.value)}/>
            </label>
            <button className="add-comment" onClick={()=> {
                onAddComment( {nameText, commentText});
                setNameText('');
                setCommentText('');
            }}>Add Comment</button>
        </div>
    )
}