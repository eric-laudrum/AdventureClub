import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut} from 'firebase/auth';
import useUser from "../hooks/useUser";
import './App.css'

export default function NavBar() {
    const { isLoading, user } = useUser();

    const navigate = useNavigate();

    return(
        <nav className='nav_bar'>

            <ul className='nav_links'>

                <li >
                    <Link to='/' className='nav_link'>Home</Link>
                </li>

                <li>
                     <Link to='/about' className='nav_link'>About</Link>
                </li>

                <li>
                     <Link to='/articles' className='nav_link'>Articles</Link>
                </li>

                <li>
                     <Link to='/events' className='nav_link'>Events</Link>
                </li>





                { isLoading ? <li>Loading...</li> :(
                    <>
                    { user && (
                    <Link to={`/profile/${user.uid}`}>
                        <li className='nav_link'>
                            { user.email }
                        </li>
                    </Link>


                    )}
                    <li>
                        { user 
                        ? <button onClick={()=> signOut(getAuth())}>Sign Out</button>
                        : <button className='sign_button'
                             onClick={()=> navigate('/login')}>Sign In</button> }
                    </li>
                    </>
                ) }
                

            </ul>
        </nav>
    )
}