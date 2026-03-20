import {useState} from 'react';
import {Link , useNavigate } from 'react-router-dom';
import {getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage(){

    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function logIn(){
        try{
            await signInWithEmailAndPassword(getAuth(), email, password);
            navigate('/');
        } catch(e){
            setError(e.message);
        }
    }

    return(
        
        <div className="section-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="article-head">
                <h1 className="section-title">Log In</h1>
            </div>

            <div className="new-article-form">
                {error && <p>{error}</p>}

                <div className="input-field">
                    <label>Email Address</label>
                    <input 
                        className="article-title-input"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)} 
                    />
                </div>

                <div className="input-field">
                    <label>Password</label>
                    <input 
                        className="article-title-input"
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)} 
                    />
                </div>

                <button 
                    className="edit-button" 

                    onClick={logIn}
                >
                    Log In
                </button>

                <div>
                    <Link to='/create-account' className="text-link">
                        Don't have an account? Create one here!
                    </Link>
                </div>
            </div>
        </div>
    );
}