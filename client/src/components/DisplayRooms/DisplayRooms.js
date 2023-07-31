import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import CreateRoomModal from '../CreateRoomModal/CreateRoomModal';
import './DisplayRoom.css';

const DisplayRoom = ({rooms, setRooms, isPublic}) => {
  const navigate = useNavigate();
  const [roomInfo, setRoomInfo] = useState();
  const [isCreateRoomModalOpen, setCreateRoomModalOpen] = useState(false);
  
  const handleJoin =  (roomId) => {
    navigate(`/room/${roomId}`);
  }

  const handleEdit = async (roomId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/study-room/${roomId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await res.json()
      setRoomInfo(data);
    } catch (error) {
      // Handle error (e.g., show error message, log the error, etc.)
      console.error('Error getting room:', error);
    }
    setCreateRoomModalOpen(true);
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
            <button className="Dbutton" onClick={() => handleJoin(room._id)}>Join</button>
            {isPublic ? 
              <>
                <div>Owner: {room.owner.name}</div>
              </> 
            : 
            <>
              <button className="Dbutton" onClick={() => handleEdit(room._id)}>Edit</button>
              <button className="Dbutton" onClick={() => handleDelete(room._id)}>Delete</button>
            </>
            }
          </li>
        ))}
      </ul>
      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={() => setCreateRoomModalOpen(false)}
        rooms = {rooms}
        setRooms = {setRooms}
        roomInfo = {roomInfo}
      />
    </div>
  );
};

export default DisplayRoom;
