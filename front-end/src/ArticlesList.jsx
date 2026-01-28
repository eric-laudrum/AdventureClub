import { Link } from 'react-router-dom';
import './App.css'

export default function ArticlesList({ articles }){

    return(
      
        <div className="article-section">

            {articles.map(a=>(
                <Link key={a.name} to={'/articles/' + a.name} className='article_pane'>
                    <h3 className="article-title">{ a.title }</h3>
                    
                    <p className="article_text">{ a.content[0].substring(0, 150) }</p>
                   
                    
                </Link>
            ))}
            
        </div>
        
     

    )
};