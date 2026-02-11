import { useState, useEffect } from 'react';
import axios from 'axios';
import '../Calendar.css';
import ArticlesList from '../ArticlesList';

export default function EventsPage() {
    const [ events, setEvents ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ currentDate, setCurrentDate ] = useState(new Date());

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/articles');
                // Filter once and set state
                const onlyEvents = response.data.filter(article => article.type === 'event');
                setEvents(onlyEvents);
            } catch (e) {
                console.error("Error fetching events:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const renderDays = () => {
        const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Blank squares for days before the 1st of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`blank-${i}`} className="calendar_day empty"></div>);
        }

        // Actual days
        for (let d = 1; d <= totalDays; d++) {
            const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
            const isPast = dateStr < today;

            // Find events for x day
            const dayEvents = events.filter(e => {
                const eDate = new Date(e.eventDate);
                return eDate.getDate() === d && 
                       eDate.getMonth() === currentDate.getMonth() && 
                       eDate.getFullYear() === currentDate.getFullYear();
            });

            days.push(
                <div key={d} className={`calendar_day ${isPast ? 'past' : ''}`}>
                    <span className="day_number">{d}</span>
                    {dayEvents.map(e => {
                        const startTime = new Date(e.eventDate);
                        // Defaulting end time to 2 hours after start
                        const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); 
                        
                        return (
                            <div key={e._id} className="calendar_event_link">
                                <a href={`/articles/${e.name}`}>{e.title}</a>
                                <small>
                                    {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                    {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </small>
                            </div>
                        );
                    })}
                </div>
            );
        }
        return days;
    };

    if (isLoading) return <p>Loading events...</p>;

    return (
        <div className="section_container">
            <h1 className="section_title">Upcoming Events</h1>
            {events.length > 0 ? (
                <ArticlesList articles={events} />
            ) : (
                <p>No events found.</p>
            )}

            <div className="calendar_header">
                <button onClick={prevMonth}>&lt;</button>
                <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
                <button onClick={nextMonth}>&gt;</button>
            </div>
            <div className="calendar_grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="weekday_label">{day}</div>
                ))}
                {renderDays()}
            </div>
        </div>





    );
}