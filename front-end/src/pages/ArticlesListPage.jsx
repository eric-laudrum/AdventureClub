import axios from 'axios';
import ArticlesList from '../ArticlesList';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLoaderData } from 'react-router-dom';
import useUser from '../../hooks/useUser';

export default function ArticlesListPage(){
    
    const { user } = useUser();
    const data = useLoaderData();
    console.log("FRONTEND RECEIVED DATA:", data);
    
    const { articles } = data || { articles: [] };
    
    return(
        <>
        <div className="section_container">
            <div className="section_header">
                <h2 className="section_title">Articles</h2>

                <button className="add_button">
                    <Link to="/add-article">+ article</Link>
                </button>
            </div>
            
        
            <ArticlesList articles={ articles } user={ user }/>
        </div>
        </>
    );
}

export async function loader(){
    try{
        const response = await axios.get('/api/articles');
        return { articles: response.data };
    } catch(err){
        console.error("\nLoader Error: ", err.message);
        return { articles: []};
    }
    
}