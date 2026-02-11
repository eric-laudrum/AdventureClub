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
            // Don't fetch if auth is still loading or user is missing
            if (isAuthLoading || !user) return; 

            try {
                setLoading(true); // Reset loading state when fetching
                const token = await user.getIdToken();
                const response = await fetch(`/api/profile/${uid}`, {
                    headers: {
                        authtoken: token, 
                    }
                });
                
                if (!response.ok) throw new Error('User not found');

                const data = await response.json();
                setProfile(data);
            } catch (err) {
                console.error("Failed to fetch profile: ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [uid, user, isAuthLoading]);

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

                <div className="attending_events"
                    style={{
                        'width':'100%',
                        'padding':'1em',
                        }}>

                    <h3>Events I'm Attending</h3>

                    {profile.attendingEvents?.length > 0 ? (
                        <ul style={{
                            'display':'flex',
                            'flexDirection':'column',
                          
                            'borderRadius':'10px',
                            'padding': '1em',
   
                            }}>

                            {profile.attendingEvents.map(event => (
                                <li key={event._id}
                                    style={{
                                        'borderRadius':'10px',
                                        'padding':'1em',
                                        'margin':'1em',
                                        'boxShadow': '0px 1px 5px gray'
                                    }}
                                >
                                    <a href={`/articles/${event.name}`} 
                                        style={{'color':'blue'}}>{event.title}
                                    </a>
                                    <div>
                                        {new Date(event.eventDate).toLocaleDateString()}
                                    </div>
                                    
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Not signed up for any events yet.</p>
                    )}
                </div>
               
          
            

        </div>
        </>
    );
}