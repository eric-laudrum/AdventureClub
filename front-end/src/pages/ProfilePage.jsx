import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import useUser from "../../hooks/useUser";



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
        <div className="section_container">
                { isOwner && <button className="edit_button">Edit Profile</button> }
                <h2 className="section_title">Profile</h2>
               
          
            
            <div className="profile_details">
                <p>Email: {profile.email}</p>
                <p>ID: { profile.uid }</p>
                <p>Bio: { profile.bio || "No bio added" }</p>
            </div>
        </div>
        </>
    );
}