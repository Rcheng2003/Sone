import {useState, useEffect} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Draggable from 'react-draggable';
import './Calendar.css';
const api_base = 'http://localhost:3001/api/event';

function Calendar({onClose}) {
    const calendarWidth = 400; // You can adjust this width based on your design
    const calendarHeight = 400; // You can adjust this height based on your design
    const initialX = (window.innerWidth - calendarWidth) / 2;
    const initialY = (window.innerHeight - calendarHeight) / 2;
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Fetch events from the backend API
        fetch(api_base + '/userEvents', {
            credentials: 'include',
          })
          .then((response) => response.json())
          .then((data) => setEvents(data))
          .catch((error) => console.error(error));
      }, []);

      const handleEventClick = (info) => {
        if (window.confirm('Are you sure you want to remove this event?')) {
          const event = info.event;
          const eventId = event._id;
    
          // DELETE the event using the API
          fetch(api_base + '/delete/' + eventId, {
            method: 'DELETE',
            credentials: 'include',
          })
            .then((response) => response.json())
            .then((deletedEvent) => {
              // If the event is successfully deleted, fetch the updated events from the API.
              fetch(api_base + '/userEvents', {
                credentials: 'include',
              })
                .then((response) => response.json())
                .then((data) => setEvents(data))
                .catch((error) => console.error(error));
            })
            .catch((error) => console.error(error));
        }
      };
      
    /*
    const events = [
    {
        title: 'Event 1',
        start: '2023-07-31T10:00:00', // Event starts at 10:00 AM on July 31, 2023
        end: '2023-07-31T12:00:00',   // Event ends at 12:00 PM on July 31, 2023
    },
    {
        title: 'Event 2',
        start: '2023-08-01T15:30:00', // Event starts at 3:30 PM on August 1, 2023
        end: '2023-08-01T17:30:00',   // Event ends at 5:30 PM on August 1, 2023
    },
    // Add more events as needed...
    ];*/

    const handleDrag = (e, ui) => {
        const { x, y } = position;
        const { width, height } = position;
        const innerWidth = document.documentElement.clientWidth - 100;
        const innerHeight = document.documentElement.clientHeight - 100;

        const newPosition = {
            x: x + ui.deltaX,
            y: y + ui.deltaY,
        };

        setPosition(newPosition);
        };

        const handleClose = () => {
        if (onClose) {
            onClose();
        }
        };

  return (
    <Draggable
        position={position}
        onDrag={handleDrag}
        handle=".CalenHandle"
    >
        <div className='CalenMain'>
            <div className="CalenHandle">
                <div className="CalenHandle-content">Calendar</div>
                <button className="close-button" onClick={handleClose}>
                    -
                </button>
            </div>
            <FullCalendar
            plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin]}
            initialView="dayGridMonth" 
            headerToolbar={{
                start: "today prev,next",
                center: "title",
                end: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height={"70vh"}
            events={events}
            eventClick={handleEventClick}
            />
        </div>
    </Draggable>
  );
};

export default Calendar;