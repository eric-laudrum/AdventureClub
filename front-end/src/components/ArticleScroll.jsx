import { Link } from 'react-router-dom';

export default function ArticleScroll({ articles }) {
    if (!articles || articles.length === 0) return null;

    return (
        <div className="article-scroll-container">
            {articles.map(article => (
                <div key={article._id} className="list-item-container">
                    <div className="article-pane">
                        <Link to={`/articles/${article.name}`} className="article-card-link">
                            <div className="article-image-container">
                                <img className="article-image" src={article.primaryImage} alt={article.title} />
                            </div>
                            <div className="article-title-bar">
                                <h3 className="article-title">{article.title}</h3>
                            </div>
                        </Link>
                    </div>
                    
                    <div className="article-preview-text">
                        <p>{article.content[0]}</p>
                        <Link to={`/articles/${article.name}`} className="text-link">
                            Read More
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}