import { Link } from 'react-router-dom';


export default function ArticlesList({ articles, user }){
    if (!articles || articles.length === 0) {
        return <p>No articles found. Try adding one!</p>;
    }

    return (
        <div className="article_list">
            {articles.map(article => (
                <div key={article._id} className="article_pane">
                    <Link to={`/articles/${article.name}`}>
                        <h3 className='article_title'>{article.title}</h3>
                        
                        {/* Show extra info only if it's an event */}
                        {article.type === 'event' && (
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>
                                <p>📍 {article.location}</p>
                                <p>📅 {article.eventDate ? new Date(article.eventDate).toLocaleDateString() : 'TBD'}</p>
                            </div>
                        )}
                    </Link>
                    <p>{article.content[0].substring(0, 150)}...</p>
                </div>
            ))}
        </div>
    );
};