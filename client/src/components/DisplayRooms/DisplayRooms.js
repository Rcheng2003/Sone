import React, { useState, useEffect } from 'react';
import './DisplayRoom.css';

const DisplayRoom = ({rooms, setRooms}) => {

  const handleEdit = (roomId) => {
    // Implement the edit functionality here, e.g., navigate to the edit page for the specific room.
    console.log('Edit room with ID:', roomId);
  };

  const handleDelete = async (roomId) => {
    try {
      await fetch(`http://localhost:3001/api/study-room/delete/${roomId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const indexToDelete = rooms.findIndex(item => item._id === roomId);

      // If the item is found (index is not -1), remove it from the list
      if (indexToDelete !== -1) {
        const updatedItems = [...rooms];
        updatedItems.splice(indexToDelete, 1);
        setRooms(updatedItems);
      }
    } catch (error) {
      // Handle error (e.g., show error message, log the error, etc.)
      console.error('Error deleting room:', error);
    }
  };


  return (
    <div>
      <ul className="Droom-list">
        {rooms.map((room) => (
          <li key={room._id} className="Droom-item">
            <span className="Droom-name">{room.roomName}</span>
            <span className="Droom-capacity">{room.users.length}/{room.capacity}</span>
            <button className="Dbutton" onClick={() => handleEdit(room.id)}>Edit</button>
            <button className="Dbutton" onClick={() => handleDelete(room._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayRoom;
