import { Link } from 'react-router-dom';

export default function FeaturedArticles({ articles }) {
    if (!articles || articles.length === 0) return null;

    return (
        <div className="featured-section">
            {articles.map(article => (
                <div key={article._id} className="article-pane featured-pane">
                    <Link to={`/articles/${article.name}`} className="article-card-link">
                        <div className="article-image-container">
                            {article.primaryImage ? (
                                <img className="article-image" src={article.primaryImage} alt={article.title} />
                            ) : (
                                <div className="image-placeholder" /> 
                            )}
                        </div>
                        <div className="article-title-bar">
                            <h3 className="article-title">{article.title}</h3>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}