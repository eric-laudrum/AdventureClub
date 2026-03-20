import React from 'react';

export default function AboutPage() {
    return (
        <div className="section-container">
            <div className="article-head">
                <h2 className="section-title">About Loop In</h2>
            </div>

            <div className="images-container">
                {/* Placeholder for your future asset */}
                <img 
                    src="/api/placeholder/800/400" 
                    className="article-image" 
                    alt="Loop In Music and Coding" 
                />
            </div>

            <div className="article-body">
                <p className="article-text">
                    Welcome to <strong>Loop In</strong>, a space to explore computer programming and music production. 

                    MPC's and DAW's have become staples of modern music. After programming in different groups and sequences of loops and triggers, 
                    using an MPC is only a few steps away from the kind of programming used to make the hardware itself.

                    There's something there that I want to explore, and this is where I'll keep you looped-in.

                </p>

                <h3 className="sub-title">The Intersection of Sound & Syntax</h3>
                <p className="article-text">
                    
                    You’ll find regular updates on coding projects, including the 
                    <strong>Trellis</strong> sequencer and other audio-visual experiments.
                </p>

                <h3 className="sub-title">Join the Loop</h3>
                <p className="article-text">
                    <strong>Loop In</strong> is meant to be interactive. 
                    Create an account to <strong>upvote</strong> posts and join the conversation in the <strong>comments</strong>. 
                    
                </p>

                <p className="article-text">
                    Stay tuned for discussions, project logs, and loops.
                </p>
            </div>
        </div>
    );
}