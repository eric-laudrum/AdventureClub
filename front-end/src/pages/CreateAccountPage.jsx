import {useState} from 'react';
import {Link , useNavigate } from 'react-router-dom';
import {getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default function CreateAccountPage(){

    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function createAccount(){
        if(password !== confirmPassword){
            setError('Password and confirm password do not match');
            return;
        }
        try{
            const result = await createUserWithEmailAndPassword(getAuth(), email, password);
            const firebaseUser = result.user;

            await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({ 
                uid: firebaseUser.uid, 
                email: firebaseUser.email 
            }),
            headers: { 'Content-Type': 'application/json' }
        });

            navigate('/articles');
        } catch(e){
            setError(e.message);
        }
    }

    return (

        <div className="section-container">
            <div className="article-head">
                <h1 className="section-title">Create Account</h1>
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
                        placeholder="Minimum 6 characters"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)} 
                    />
                </div>

                <div className="input-field">
                    <label>Confirm Password</label>
                    <input 
                        className="article-title-input"
                        placeholder="Re-type password"
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)} 
                    />
                </div>

                <button 
                    className="edit-button" 
                    onClick={createAccount}
                >
                    Create Account
                </button>

                <div>
                    <Link to='/login' className="text-link">
                        Already have an account? Log in here!
                    </Link>
                </div>
            </div>
        </div>
    );
}