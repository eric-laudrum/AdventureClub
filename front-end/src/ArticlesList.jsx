import { Link } from 'react-router-dom';


export default function ArticlesList({ articles, user }){
    if (!articles || articles.length === 0) {
        return <p>No articles found. Try adding one!</p>;
    }

    return (
        <div className="article_list">
            {articles.map((article, index) => (
                <div className="article_pane" key={`${article._id}-${index}`}>
                    
                    {/* debugging */}
                    {console.log(`Article: ${article.title}, Author: ${article.authorUid}, Me: ${user?.uid}`)}
                    
                    <div className="article_list_head">
                        <Link 
                            key={ article._id || `${ article.name }${ index }`} 
                            to={'/articles/' + article.name }>

                            {/* TITLE */}
                            <h3 className="article_title">{ article.title }</h3>
                        </Link>

                        { article.type === 'event' &&(
                            <h2>This is an event</h2>
                        )}
                    </div>


                    {/* IMAGE */}
                            {article.primaryImage && (
                                <img
                                    src={ article.primaryImage }
                                    alt={ article.title }
                                    className="article_image"
                                />
                            )}


                    {/* MAIN TEXT */}
                    <p className="article_text">
                            {article.content && article.content[0] 
                                ? article.content[0].substring(0, 150) 
                                : "No content available"}
                    </p>
                
                </div>
                
            ))}
        </div>
    );
};