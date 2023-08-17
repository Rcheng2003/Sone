import React from 'react';
import Draggable from 'react-draggable';
import './Note.css';

const Note = ({ selected, note, onNoteClick, onNoteDrag, Tref, onNoteTextChange, onClose, onSelectedNote, DoubleClick}) => {
    return (
        <Draggable
        key={note.id}
        defaultPosition={note.position}
        onStop={(e, data) => onNoteDrag(note.id, { x: data.x, y: data.y })}
      >
        <div
          className={`note ${selected?.id === note.id ? 'active' : ''}`}
          onClick={() => onNoteClick(note.id)}
        >
        
        <div className="note-header">
          <div className="close-note-button" onClick={() => onClose(note.id)}>
            -
          </div>
        </div>
          {selected?.id === note.id ? (
            <textarea
              ref={Tref} // Add ref to the textarea element
              value={note.text}
              onChange={(e) => onNoteTextChange(note.id, e.target.value)}
              onBlur={() => onSelectedNote(null)}
              onDoubleClick={DoubleClick} // Double-click event for text selection
              autoFocus
            />
          ) : (
            <span>{note.text}</span>
          )}
        </div>
      </Draggable>
    );
  };
  
  export default Note;