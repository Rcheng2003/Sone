import React, { useState, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import Draggable from 'react-draggable';
import './Notepad.css';

const Notepad = ({ onClose }) => {
  //get the saved notes from the local storage
  const [notes, setNotes] = useState(() => {
    const savedNotes = JSON.parse(localStorage.getItem('react-notes-app-data'));
    return savedNotes ? savedNotes : [];
  });

  //save the notes
  useEffect(() => {
    localStorage.setItem('react-notes-app-data', JSON.stringify(notes));
  }, [notes]);

  const initialNotePosition = { x: 0, y: 0 };

  //create new note
  const addNote = (text, position) => {
    const newNote = {
      id: nanoid(),
      text: text,
      position: position,
      date: new Date().toLocaleString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }), // Update the date to the current date and time up to minutes
    };
    const newNotes = [...notes, newNote];
    setNotes(newNotes);
  };

  //delete a note with the id
  const deleteNote = (id) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
  };

  //close the note with the id, so doesn't appear on the screen
  //if already closed, note with id appears on screen
  const closeNote = (id) => {
    const updatedNotes = notes.map((note) => {
      if (note.id === id) {
        return { ...note, closed: !note.closed }; // Toggle the closed property
      }
      return note;
    });
    setNotes(updatedNotes);
  };

  const textAreaRef = useRef(null); // Ref for the textarea element

  //allow user to double click and highlight text
  const handleDoubleClick = () => {
    if (textAreaRef.current) {
      textAreaRef.current.select(); // Select the text when double-clicked
    }
  };

  const [selectedNote, setSelectedNote] = useState(null); 

  //allow user to click on a note and note becomes highlighted and sidebar scrolls to the
  //entry correlating to that note
  const handleNoteClick = (id) => {
    const noteToDisplay = notes.find((note) => note.id === id);
    setSelectedNote(noteToDisplay);

    // Scroll the corresponding sidebar entry into view
    const sidebarEntry = document.querySelector(`.sidebar-entry[data-id="${id}"]`);
    if (sidebarEntry) {
      sidebarEntry.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  //updates position value of note with the id when note is moved around
  const handleNoteDrag = (id, newPosition) => {
    const updatedNotes = notes.map((note) => {
      if (note.id === id) {
        return { ...note, position: newPosition };
      }
      return note;
    });
    setNotes(updatedNotes);
  };

  //updates text value of note with the id when text is changed
  const handleNoteTextChange = (id, newText) => {
    const updatedNotes = notes.map((note) => {
      if (note.id === id) {
        return {
          ...note,
          text: newText,
          date: new Date().toLocaleString(undefined, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }), // Update the date to the current date and time up to minutes
        };
      }
      return note;
    });
    // Sort the notes based on the new date
    const sortedNotes = updatedNotes.sort((a, b) => new Date(b.date) - new Date(a.date));
    setNotes(sortedNotes);
  };

  //new note button when clicked, runs the add new note function
  const handleNewNoteClick = () => {
    // Create a new note and set its initial text to an empty string
    addNote('', initialNotePosition);
  };

  //find specific note based on the text contents of the note
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const [searchQuery, setSearchQuery] = useState('');

  //reset the list of notes to become no notes
  const handleDeleteAll = () => {
    setNotes([]); // Clear all notes
  };

  return (
    <div className="notepad-container">
      <Draggable>
        <div className="sidebar-wrapper">
          {/* Sidebar */}
          <div className="sidebar">
            <h1 className="sidebar-heading">Notes</h1>
            {/* Close All, Delete All, and New Note Buttons */}
            <div className="button-container">
              <button className="noteCloseAllButton" onClick={onClose}>
                Close All
              </button>
              <button className="noteDeleteAllButton" onClick={handleDeleteAll}>
                Delete All
              </button>
              <button className="newNoteButton" onClick={handleNewNoteClick}>
                New Note
              </button>
            </div>
            {/* Search bar */}
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {/* Sidebar note entries */}
            <ul className="notes-sidebar">
              {notes
                .filter((note) => note.text.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((note) => (
                  <li key={note.id}>
                  <div
                    className={`sidebar-entry ${selectedNote?.id === note.id ? 'active' : ''}`}
                    onClick={() => handleNoteClick(note.id)}
                    data-id={note.id} // Add data-id attribute
                  >
                    <span className={`sidebar-entry-text ${note.closed ? 'closed' : ''}`}>
                      {note.text.length > 25 ? `${note.text.substring(0, 25)}...` : note.text}
                    </span>
                    <span className="sidebar-entry-date">{note.date}</span>
                    {/* Open/Close and Delete Buttons on each sidebar note entry */}
                    <div className="sidebar-entry-footer">
                      {/* Open and Close Switch, Delete Stays */}
                      {note.closed ? (
                        <>
                          <button className="sidebar-entry-open-button" onClick={() => closeNote(note.id)}>
                            Open
                          </button>
                          <button className="sidebar-entry-delete-button" onClick={() => deleteNote(note.id)}>
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="sidebar-entry-close-button" onClick={() => closeNote(note.id)}>
                            Close
                          </button>
                          <button className="sidebar-entry-delete-button" onClick={() => deleteNote(note.id)}>
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Draggable>

      {/* Main note display aka the actual notes */}
      <div className="note-display">
        {notes.map((note) => (
          !note.closed && (
            <Draggable
              key={note.id}
              defaultPosition={note.position}
              onStop={(e, data) => handleNoteDrag(note.id, { x: data.x, y: data.y })}
            >
              <div
                className={`note ${selectedNote?.id === note.id ? 'active' : ''}`}
                onClick={() => handleNoteClick(note.id)}
              >
                {selectedNote?.id === note.id ? (
                  <textarea
                    ref={textAreaRef} // Add ref to the textarea element
                    value={note.text}
                    onChange={(e) => handleNoteTextChange(note.id, e.target.value)}
                    onBlur={() => setSelectedNote(null)}
                    onDoubleClick={handleDoubleClick} // Double-click event for text selection
                    autoFocus
                  />
                ) : (
                  <span>{note.text}</span>
                )}
              </div>
            </Draggable>
          )
        ))}
      </div>
    </div>
  );
};

export default Notepad;