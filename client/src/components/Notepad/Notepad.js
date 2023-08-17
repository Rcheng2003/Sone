import React, { useState, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import Draggable from 'react-draggable';
import './Notepad.css';
import Note from './Note';

const api_base = 'http://localhost:3001/api/notes';

const Notepad = ({ onClose }) => {
  //get the saved notes from the local storage
  const [notes, setNotes] = useState([]);

  //save the notes
  useEffect(() => {
    getNotes();
  }, []);

  const initialNotePosition = { x: 0, y: 0 };

  const getNotes = () => {
    fetch(api_base + '/userNotes', {
      credentials: 'include',
    })
    .then((response) => response.json())
    .then((data) => setNotes(data))
    .catch((error) => console.error(error));
    console.log(notes);
  };

  //close the note with the id, so doesn't appear on the screen
  //if already closed, note with id appears on screen
  const closeNote = async (id) => {
    const data = await fetch(api_base + '/close/' + id, {
      credentials: 'include',
   }).then(res => res.json());

   const updatedNotes = notes.map((note) => {
    if (note._id === id) {
      return { ...note, closed: !note.closed }; // Toggle the closed property
    }
    return note;
  });
  setNotes(updatedNotes);
  notes.map((notes) => {
    console.log(notes);
  })
  }

  //create new note
  const addNote = async (Text) => {
    try {
      const response = await fetch(api_base + "/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
          text: Text,
          date: new Date().toLocaleString(undefined, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })
        })
      });
      if (response.ok) {
        const newNote = await response.json();
        const newNotes = [...notes, newNote];
        setNotes(newNotes);
      } else {
        // Handle error if the request fails
        console.error("Failed to add the new Note.");
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle error if needed
    }
  };
  

  //delete a note with the id
  const deleteNote = async (id) => {
    try {
      const response = await fetch(api_base + '/delete/' + id, {
        method: "DELETE",
        credentials: 'include',
      });
  
      if (response.ok) {
        // Delete was successful, update the state
        const newNotes = notes.filter((note) => note._id !== id);
        setNotes(newNotes);
      } else {
        console.log('Delete request failed:', response.status);
        // Handle error if needed
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle error if needed
    }
  };
  


  const updateNotes = async (id, newText) => {
    try {
      const response = await fetch(api_base + '/updateT/' + id, {
        method: "PUT",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: newText })
      });
  
      if (response.ok) {
        const updatedNote = await response.json();
        const updatedNotes = notes.map((note) => (note._id === updatedNote._id ? updatedNote : note));
        const sortedNotes = updatedNotes.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotes(sortedNotes);
      } else {
        // Handle error if the request fails
        console.error("Failed to update the Note item.");
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle error if needed
    }
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
    const noteToDisplay = notes.find((note) => note._id === id);
    setSelectedNote(noteToDisplay);

    // Scroll the corresponding sidebar entry into view
    const sidebarEntry = document.querySelector(`.sidebar-entry[data-id="${id}"]`);
    if (sidebarEntry) {
      sidebarEntry.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  //updates position value of note with the id when note is moved around
  const updatePosition = async (id, newPosition) => {
    try {
      const response = await fetch(api_base + '/updateP/' + id, {
        method: "PUT",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ position: newPosition })
      });
  
      if (response.ok) {
        const updatedNote = await response.json();
        const updatedNotes = notes.map((note) => (note._id === updatedNote._id ? updatedNote : note));
        setNotes(updatedNotes);
      } else {
        // Handle error if the request fails
        console.error("Failed to update the Note item.");
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle error if needed
    }
  };
  

  //new note button when clicked, runs the add new note function
  const handleNewNoteClick = () => {
    // Create a new note and set its initial text to an empty string
    addNote('');
  };

  //find specific note based on the text contents of the note
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const [searchQuery, setSearchQuery] = useState('');

  //reset the list of notes to become no notes
  const handleDeleteAll = () => {
    const data = fetch(api_base + '/delete-all/', { method: "DELETE", credentials: 'include',
    }).then(res => res.json());
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
                .filter((note) => String(note.text).toLowerCase().includes(searchQuery.toLowerCase()))
                .map((note) => (
                  <li key={note._id}>
                  <div
                    className={`sidebar-entry ${selectedNote?._id === note._id ? 'active' : ''}`}
                    onClick={() => handleNoteClick(note._id)}
                    data-id={note._id} // Add data-id attribute
                  >
                    <span className={`sidebar-entry-text ${note.closed ? 'closed' : ''}`}>
                      {String(note.text).length > 25 ? `${note.text.substring(0, 25)}...` : note.text}
                    </span>
                    <span className="sidebar-entry-date">{note.date}</span>
                    {/* Open/Close and Delete Buttons on each sidebar note entry */}
                    <div className="sidebar-entry-footer">
                      {/* Open and Close Switch, Delete Stays */}
                      {note.closed ? (
                        <>
                          <button className="sidebar-entry-open-button" key={note._id} onClick={() => closeNote(note._id)}>
                            Open
                          </button>
                          <button className="sidebar-entry-delete-button" key={note._id} onClick={() => deleteNote(note._id)}>
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="sidebar-entry-close-button" key={note._id} onClick={() => closeNote(note._id)}>
                            Close
                          </button>
                          <button className="sidebar-entry-delete-button" key={note._id} onClick={() => deleteNote(note._id)}>
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
            <Note
              selected = {selectedNote}
              note={note}
              onNoteClick={handleNoteClick}
              onNoteDrag={updatePosition}
              Tref = {textAreaRef}
              onNoteTextChange={updateNotes}
              onClose = {closeNote}
              onSelectedNote= {setSelectedNote}
              DoubleClick={handleDoubleClick}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default Notepad;