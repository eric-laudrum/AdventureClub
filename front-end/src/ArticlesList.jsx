import FeaturedArticles from './components/FeaturedSection';
import ArticleScroll from './components/ArticleScroll';

export default function ArticlesList({ articles }) {
    if (!articles || articles.length === 0) {
        return <p>No articles found. Try adding one!</p>;
    }

    const featured = articles.slice(0, 2);
    const remaining = articles.slice(2);

    return (
        <div className="main-layout-container">


            <FeaturedArticles articles={featured} />


            <div className="scroll-column"> 
                <ArticleScroll articles={remaining} />
            </div>


        </div>
    );
}