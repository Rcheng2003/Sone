import React, {useState} from 'react';
import Draggable from 'react-draggable';
import './Note.css';

const Note = ({ selected, note, onNoteClick, onNoteDrag, Tref, onNoteTextChange, onClose, onSelectedNote, DoubleClick}) => {
  const [editedText, setEditedText] = useState(note.text);
    return (
        <Draggable
        key={note._id}
        defaultPosition={note.position}
        onStop={(e, data) => onNoteDrag(note._id, { x: data.x, y: data.y })}
      >
        <div
          className={`note ${selected?._id === note._id ? 'active' : ''}`}
          onClick={() => onNoteClick(note._id)}
        >
        
        <div className="note-header">
          <div className="close-note-button" onClick={() => onClose(note._id)}>
            -
          </div>
        </div>
          {selected?._id === note._id ? (
            <textarea
              ref={Tref} // Add ref to the textarea element
              value={note._id === selected?._id ? editedText : note.text}
              onChange={(e) => setEditedText(e.target.value)}
              onBlur={() => {
                onNoteTextChange(note._id, editedText);
                onSelectedNote(null);
              }}
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