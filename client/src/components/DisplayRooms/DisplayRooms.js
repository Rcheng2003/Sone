import React, { useState, useEffect } from 'react';
import './DisplayRoom.css';

const DisplayRoom = ({rooms}) => {

  const handleEdit = (roomId) => {
    // Implement the edit functionality here, e.g., navigate to the edit page for the specific room.
    console.log('Edit room with ID:', roomId);
  };

  const handleDelete = (roomId) => {
    // Implement the delete functionality here, e.g., send a DELETE request to the API.
    console.log('Delete room with ID:', roomId);
  };

  return (
    <div>
      <ul className="Droom-list">
        {rooms.map((room) => (
          <li key={room._id} className="Droom-item">
            <span className="Droom-name">{room.roomName}</span>
            <span className="Droom-capacity">{room.users.length}/{room.capacity}</span>
            <button className="Dbutton" onClick={() => handleEdit(room.id)}>Edit</button>
            <button className="Dbutton" onClick={() => handleDelete(room.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayRoom;
