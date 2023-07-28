import React, { useState, useEffect } from 'react';
import './RoomModal.css';
import CreateRoomModal from '../CreateRoomModal/CreateRoomModal';
import DisplayRoom from '../DisplayRooms/DisplayRooms';

const RoomModal = ({ isOpen, onClose }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedTab, setSelectedTab] = useState('myRooms');
  const [isCreateRoomModalOpen, setCreateRoomModalOpen] = useState(false);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

   useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/study-room', {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };


  return (
    <div className={`modal ${isOpen ? 'open' : 'closed'}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <div className="tabs">
          <button
            className={selectedTab === 'myRooms' ? 'active' : ''}
            onClick={() => handleTabChange('myRooms')}
          >
            My Rooms 
          </button>
          <button
            className={selectedTab === 'publicRooms' ? 'active' : ''}
            onClick={() => handleTabChange('publicRooms')}
          >
            Public Rooms
          </button>
        </div>
        <div className="tab-content">
          {selectedTab === 'myRooms' ? 
            <div>            
              <p>MY ROOMS</p> 
              <button onClick={() => setCreateRoomModalOpen(true)}>Create Room</button>
              <DisplayRoom rooms = {rooms} setRooms={setRooms}></DisplayRoom>
            </div>
            : null}
          {selectedTab === 'publicRooms' ? <p>Public ROOMS</p> : null}
        </div>
      </div>
      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={() => setCreateRoomModalOpen(false)}
        setRooms = {setRooms}
      />
    </div>
  );
};

export default RoomModal;
