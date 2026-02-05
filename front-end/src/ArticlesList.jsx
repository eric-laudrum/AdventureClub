import { Link } from 'react-router-dom';

export default function ArticlesList({ articles }){
    if (!articles || articles.length === 0) {
        return <p>No articles found. Try adding one!</p>;
    }

    return (
        <div className="article-section">
            {articles.map((article, index) => (
                <Link 
                    key={article._id || `${article.name}-${index}`} 
                    to={'/articles/' + article.name} 
                    className='article_pane'
                >
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article_text">
                        {article.content && article.content[0] 
                            ? article.content[0].substring(0, 150) 
                            : "No content available"}
                    </p>
                </Link>
            ))}
        </div>
    );
};