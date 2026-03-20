import React, { useState } from 'react';

export default function ContactPage() {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    
        setStatus('Thanks for reaching out! I will get back to you soon.');
    };

    return (
        <div className="section-container">
            <div className="article-head">
                <h2 className="section-title">Contact Loop In</h2>
            </div>

            <p className="article-text">
                Have a question about the <strong>Trellis Sequencer</strong>, a music theory, 
                or a coding project?
            </p>
            <p>Leave a message below.</p>

            <form onSubmit={handleSubmit} className="new-article-form">
                <div className="input-field">
                    <label>Name</label>
                    <input type="text" className="article-title-input" required />
                </div>

                <div className="input-field">
                    <label>Email</label>
                    <input type="email" className="article-title-input" required />
                </div>

                <div className="input-field">
                    <label>Message</label>
                    <textarea 
                        rows="8"  
                        required 
                    ></textarea>
                </div>

                <button type="submit" className="edit-button">
                    Send Message
                </button>
            </form>

            {status && <p>{status}</p>}
            
            <div >
                <h3 className="sub-title">Other Ways to Connect</h3>
                <p className="article-text">
                    You can also find me on <strong>GitHub</strong>
                </p>
            </div>
        </div>
    );
}