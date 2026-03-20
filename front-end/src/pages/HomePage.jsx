import FeaturedArticles from '../components/FeaturedSection';
import ArticleScroll from '../components/ArticleScroll';
import { useLoaderData } from 'react-router-dom';

export default function HomePage(){
    const { articles } = useLoaderData(); // Get all articles
    
    const featured = articles.slice(0, 2);
    const remaining = articles.slice(2);

    return(
        <main className="main-layout-container">
            {/* The Left Side */}
            <FeaturedArticles articles={featured} />

            {/* The Right Side  */}
            <div className="scroll-column">
                <ArticleScroll articles={remaining} />
            </div>
        </main>
    );
}