import { Link } from 'react-router-dom';


export default function ArticlesList({ articles, user }){
    if (!articles || articles.length === 0) {
        return <p>No articles found. Try adding one!</p>;
    }

    return (
        <div className="article_list">
            {articles.map(article => (
                <div key={article._id} className="article_pane">
                    <div className="article_head"> 
                        {/* 1. Add the image here */}
                        {article.primaryImage && (
                            <img 
                                className="article_image" 
                                src={article.primaryImage} 
                                alt={article.title} 
                            />
                        )}

                        <div className="article_list_content" style={{ marginLeft: '20px' }}>
                            <Link to={`/articles/${article.name}`}>
                                <h3 className="article_title">{article.title}</h3>
                                
                                {article.type === 'event' && (
                                    <div className="event_metadata">
                                        <p>📍 {article.location}</p>
                                        <p>📅 {article.eventDate ? new Date(article.eventDate).toLocaleDateString() : 'TBD'}</p>
                                    </div>
                                )}
                            </Link>
                            <p className="article_text">
                                {article.content[0].substring(0, 150)}...
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};