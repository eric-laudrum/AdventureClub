import axios from 'axios';
import ArticlesList from '../ArticlesList';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLoaderData } from 'react-router-dom';
import useUser from '../../hooks/useUser';

import ArticleScroll from '../components/ArticleScroll';

export default function ArticlesListPage(){

    const { articles } = useLoaderData();
    const { user } = useUser();
    
    return(
        <>

        <div className="articles-only-page">
            <ArticleScroll articles={articles} />
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