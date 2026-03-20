import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from 'firebase/auth';
import useUser from "../hooks/useUser";
import NavBar from './NavBar'
import './App.css'


export default function Header(){

    const { isLoading, user } = useUser();
    const navigate = useNavigate();
    const accountLink = user ? `/profile/${user.uid}` : '/login';

    return(

        <div className="header-section">


            {/* Account Container (in/out) */}
            <div className="account-container">
                {isLoading ? (
                    <span className="loading-text">...</span>
                ) : (
                    <div className="account-controls">
                        {user ? (
                        // Show Sign Out if logged in
                        <button 
                            className="sign-out-link" 
                            onClick={() => {
                                signOut(getAuth());
                                navigate('/'); // Clean redirect to home
                            }}
                        >
                            Sign Out
                        </button>
                    ) : (
                        // Show Sign In if logged out
                        <Link to="/login" className="sign-out-link">
                            Sign In
                        </Link>
                    )}
                        <Link to={accountLink} className="account-icon-link">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="24" height="24" 
                                viewBox="0 0 24 24" 
                                fill="white"
                            >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                            </svg>
                        </Link>
                    </div>
                )}
            </div>

            <div className="header-img-container">
                <img className="header-img" src="/src/assets/LOOPIN.png" alt="Logo" />
            </div>
            
            <NavBar />
        </div>
    );
}