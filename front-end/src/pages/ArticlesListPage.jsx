import articles from '../article-content';
import ArticlesList from '../ArticlesList';

export default function ArticlesListPage(){
    return(
        <>
        <h2> - - - - - ArticlesListPage.jsx - - - - - </h2>
        <ArticlesList articles={articles} />
            
        </>
    );
}