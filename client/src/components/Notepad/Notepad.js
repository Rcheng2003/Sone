import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Draggable from 'react-draggable';
import './Notepad.css';

const Notepad = () => {
    const [notes, setNotes] = useState(() => {
        const savedNotes = JSON.parse(localStorage.getItem('react-notes-app-data'));
        return savedNotes ? savedNotes : [];
    });

    useEffect(() => {
        localStorage.setItem('react-notes-app-data', JSON.stringify(notes));
    }, [notes]);

    const [noteText, setNoteText] = useState('');
    const initialNotePosition = { x: 0, y: 0 };

    const addNote = (text, position) => {
        const date = new Date();
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newNote = {
            id: nanoid(),
            text: text,
            date: `${formattedDate} ${formattedTime}`,
            position: position,
        };
        const newNotes = [...notes, newNote];
        setNotes(newNotes);
    };

    const deleteNote = (id) => {
        const newNotes = notes.filter((note) => note.id !== id);
        setNotes(newNotes);
    };

    const handleSaveClick = () => {
        if (noteText.trim().length > 0) {
            addNote(noteText, initialNotePosition);
            setNoteText('');
        }
    };

    const handleNoteDrag = (id, newPosition) => {
        const updatedNotes = notes.map((note) => {
            if (note.id === id) {
                return { ...note, position: newPosition };
            }
            return note;
        });
        setNotes(updatedNotes);
    };

    return (
        <div className="notepad-container">
            <div className="notes-list">
                {notes.map((note) => (
                    <Draggable
                        key={note.id}
                        defaultPosition={note.position}
                        onStop={(e, data) => handleNoteDrag(note.id, { x: data.x, y: data.y })}
                    >
                        <div className="note">
                            <span>{note.text}</span>
                            <div className="note-footer">
                                <small>{note.date}</small>
                                <button className="delete-button" onClick={() => deleteNote(note.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </Draggable>
                ))}
                <Draggable>
                    <div className="note new">
                        <textarea
                            rows="8"
                            cols="10"
                            placeholder="Type to add a note..."
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                        ></textarea>
                        <div className="note-footer">
                            <button className="save-button" onClick={handleSaveClick}>
                                Save
                            </button>
                        </div>
                    </div>
                </Draggable>
            </div>
        </div>
    );
};

export default Notepad;
