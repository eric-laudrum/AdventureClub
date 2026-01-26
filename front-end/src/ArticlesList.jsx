import { Link } from 'react-router-dom';
import './App.css'

export default function ArticlesList({ articles }){

    return(
      
        <div className="article_card">

            {articles.map(a=>(
                <Link key={a.name} to={'/articles/' + a.name} className='article_pane'>
                    <h3 className="sub_title">{ a.title }</h3>
                    <ul class_name="section_list">
                        <li className="article_text">{ a.content[0].substring(0, 150) }</li>
                    </ul>
                    
                </Link>
            ))}
            
        </div>
        
     

    )
};