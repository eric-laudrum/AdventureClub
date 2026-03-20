import { Link } from 'react-router-dom';


export default function ArticlesList({ articles, user }){
    if (!articles || articles.length === 0) {
        return <p>No articles found. Try adding one!</p>;
    }

    const featuredArticles = articles.slice(0, 2);
    const remainingArticles = articles.slice(2);

    return (
        <div className="main-layout-container">
            
            {/* Left Column (Featured) */}
            <div className="featured-section">
                {featuredArticles.map(article => (
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

            {/* Right Side - Scroll */}
            <div className="scroll-column">
                {remainingArticles.map(article => (
                    <div key={article._id} className="list-item-container">
                        {/* Image */}
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
                            <Link title="Read more" to={`/articles/${article.name}`} className="text-link">
                                Read More
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};