import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

export default function  ProfilePage(){
    const { id } = useParams();
    const [ profile, setProfile ] = useState( null );
    const [ loading, setLoading ] = useState( true );

    useEffect(() => {
        const fetchProfile = async () => {
            try{
                const response = await fetch(`/api/profile/${id}`);
                const data = await response.json();
                setProfile( data );
            } catch( err ){
                console.error("Failed to fetch profile: ", err);
            } finally{
                setLoading( false );
            }
        };

        fetchProfile();
    }, [id]);

    if( loading ) return <p>Loading...</p>;
    if( !profile ) return <p>User not found</p>;

    return(
        <>
        <div className="profile_container">
            <h3>Profile</h3>
            <p>Email: { profile.email }</p>
        </div>
        </>
    );
}