import React, { useState, useEffect } from 'react';
import './CreateRoomModal.css';

// Resuable component for creating and editing a room
const CreateRoomModal = ({ isOpen, onClose, rooms, setRooms, roomInfo }) => {
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('private');
  const [capacity, setCapacity] = useState(10);

  useEffect(() => {
    if (roomInfo && roomInfo.roomName){
      setRoomName(roomInfo.roomName)
      setRoomType(roomInfo.public ? "public":"private")
      setCapacity(roomInfo.capacity)
    }
  }, [roomInfo]);

  const createRoom = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/study-room/create', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify( {
          roomName,
          public: roomType === 'private' ? false : true ,
          capacity,
        })
      });
      const data = await res.json();
      setRooms((prev) => [...prev, data]);
      setRoomName('');
      setRoomType('private');
      setCapacity(10);
      onClose();
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const updateRoom = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/study-room/${roomInfo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify( {
          roomName,
          public: roomType === 'private' ? false : true ,
          capacity,
        })
      });
      const data = await res.json();
      const updatedRooms = rooms.map(room => {
        if (room._id === roomInfo._id) {
          // Make the necessary changes to the object
          return { ...room, roomName: roomName, public: roomType === 'private' ? false : true , capacity: capacity};
        }
        else {
          return room
        }
      })
      setRooms(updatedRooms);
      onClose();
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //make post request to create a room with certain information
    createRoom();
    // Reset the form fields
    setRoomName('');
    setRoomType('private');
    setCapacity(10);
    onClose();
  };

  return (
    <div className={`room-modal ${isOpen ? 'open' : 'closed'}`}>
      <div className="room-modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>{roomInfo ? (roomInfo.roomName ? "Update Room":"Create Room") : ""}</h2>
          <div className="form-group">
            <label htmlFor="roomName" className="form-label">Room Name:</label>
            <input
              type="text"
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Room Type:</label>
            <label>
              <input
                type="radio"
                value="private"
                checked={roomType === 'private'}
                onChange={() => setRoomType('private')}
                className="radio-input"
              />
              Private Room
            </label>
            <label>
              <input
                type="radio"
                value="public"
                checked={roomType === 'public'}
                onChange={() => setRoomType('public')}
                className="radio-input"
              />
              Public Room
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="capacity" className="form-label">Capacity:</label>
            <input
              type="number"
              id="capacity"
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value))}
              min={1}
              className="form-input"
            />
          </div>
          {roomInfo ? (
            roomInfo.roomName ? (
              // Room Info exists and has a roomName - Display the Update button
              <button onClick={updateRoom} className="create-button">Update</button>
            ) : (
              // Room Info exists, but roomName is falsy - Display the Create button
              <button onClick = {createRoom} className="create-button">Create</button>
            )
          ) : (
            // Room Info doesn't exist - Display nothing (you can add a fallback UI here if needed)
            null
          )}
          
      </div>
    </div>
  );
};

export default CreateRoomModal;
