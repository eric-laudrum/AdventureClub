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

        <button className="add-button">
            <Link to="/add-article">+ article</Link>
        </button>


            <ArticlesList articles={ articles } user={ user }/>

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