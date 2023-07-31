import React, { useState } from "react";
import './TopNavbar.css';
import RoomModal from "../RoomModal/RoomModal";

const TopNavbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <>
      <RoomModal isOpen={isModalOpen} onClose={handleModalToggle} />
      <nav className="navbar">
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><span className ="roomButton" onClick={handleModalToggle}>Rooms</span></li>
        </ul>
      </nav>
    </>
  );
};

export default TopNavbar;
