import articles from '../article-content';
import ArticlesList from '../ArticlesList';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ArticlesListPage(){
    
    const navigate = useNavigate();
    
    return(
        <>
        <div className="section_container">
            <div className="section_header">
                <h2 className="section_title">Articles</h2>


                <button className="add_button">
                    <Link to="/add-article">+ article</Link>
                </button>
                
            </div>
            
        
            <ArticlesList articles={ articles } />

        </div>
        
            
        </>
    );
}