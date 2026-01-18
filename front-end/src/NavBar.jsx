import { Link } from "react-router-dom";

export default function NavBar() {
    return(
        <nav className='nav_bar'>
            <ul className='nav_links'>
                <li className='nav_link'>
                    <Link to='/'>Home</Link>
                    </li>
                <li className='nav_link'>
                     <Link to='/about'>About</Link>
                    </li>
                <li className='nav_link'>
                     <Link to='/articles'>Articles</Link>
                  </li>
            </ul>
        </nav>
    )
}