import { useState, useEffect } from 'react';
import axios from 'axios';
import ArticlesList from '../ArticlesList';

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/articles');
                const allArticles = response.data;
                
                // Filter only events
                const onlyEvents = allArticles.filter(article => article.type === 'event');
                
                setEvents(onlyEvents);
                
            } catch (e) {
                console.error("Error fetching events:", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (isLoading) return <p>Loading events...</p>;

    return (
        <div className="section_container">
            <h1 className="section_title">Upcoming Events</h1>
            {events.length > 0 ? (
                <ArticlesList articles={events} />
            ) : (
                <p>No events found.</p>
            )}
        </div>
    );
}