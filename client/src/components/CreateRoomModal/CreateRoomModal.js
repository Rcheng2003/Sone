import React, { useState } from 'react';
import './CreateRoomModal.css';

const CreateRoomModal = ({ isOpen, onClose, setRooms }) => {
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('private');
  const [capacity, setCapacity] = useState(10);

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
          public: roomType === 'private' ? true : false ,
          capacity,
        })
      });
      const data = await res.json();
      setRooms((prev) => [...prev, data]);
    } catch (error) {
      console.error('Error creating room:', error);
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
        <h2>Create Room</h2>
        <form className="room-form" onSubmit={handleSubmit}>
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
          <button type="submit" className="create-button">Create</button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
