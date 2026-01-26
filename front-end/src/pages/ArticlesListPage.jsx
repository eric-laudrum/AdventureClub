import articles from '../article-content';
import ArticlesList from '../ArticlesList';

export default function ArticlesListPage(){
    return(
        <>
        <div className="section_container">
            <h2 className="section_title">Articles</h2>
            <ArticlesList articles={articles} />
        </div>
        
            
        </>
    );
}