import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import useUser from "../use_user";



export default function  ProfilePage(){
    
    const { id: uid } = useParams();

    const { user, isLoading: isAuthLoading } = useUser();

    const [ profile, setProfile ] = useState( null );
    const [ loading, setLoading ] = useState( true );

    const isOwner = user && user.uid === uid;

    useEffect(() => {
        const fetchProfile = async () => {
            try{
                const token = user && await user.getIdToken();
                const response = await fetch(`/api/profile/${uid}`, {
                    headers: {
                        authtoken: token, 
                    }
                });
                if( !response.ok ) throw new Error('User not found');

                const data = await response.json();
                setProfile( data );

                

            } catch( err ){
                console.error("Failed to fetch profile: ", err);
            } finally{
                setLoading( false );
            }
        };

        if (uid) fetchProfile();
    }, [uid]);

    // Check loading states
    if( loading ) return <p>Loading...</p>;
    if( !profile ) return <p>User not found</p>;

    return(
        <>
        <div className="profile_container">
            <h3>Profile</h3>
            { isOwner && <button>Edit Profile</button> }

            <p>Email: { profile.email || user?.email }</p>
            
            <div className="profile_details">
                <p>ID: { profile.uid }</p>
                <p>Bio: { profile.bio || "No bio added" }</p>
            </div>
        </div>
        </>
    );
}