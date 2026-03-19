import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut} from 'firebase/auth';
import useUser from "../hooks/useUser";
import './App.css'

export default function NavBar() {
    const navigate = useNavigate();

    return(
        <nav className='nav-bar'>

            <ul className='nav-links'>

                <li className='nav-link'>
                    <Link to='/' className='link'>Home</Link>
                </li>

                <li className='nav-link'>
                    <Link to='/' className='link'>About</Link>
                </li>

                <li className='nav-link'>
                    <Link to='/' className='link'>Articles</Link>
                </li>

                <li className='nav-link'>
                    <Link to='/' className='link'>Events</Link>
                </li>

                <li className='nav-link'>
                    <Link to='/' className='link'>Contact</Link>
                </li>
            </ul>
        </nav>
    )
}