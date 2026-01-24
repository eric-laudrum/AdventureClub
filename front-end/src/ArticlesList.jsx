import { Link } from 'react-router-dom';

export default function ArticlesList({ articles }){

    return(
        <>
        <div className="article_card">{/* this wraps all articles */}

            {articles.map(a=>(
            <Link key={a.name} to={'/articles/' + a.name} className='article_link'>
                <h3>{a.title}</h3>
                <p>{a.content[0].substring(0, 150)}</p>
            </Link>
        ))}
            
        </div>
        
        </>

    )
};