import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import TopNavbar from "../components/TopNavbar/TopNavbar";
import Modal from "../components/RoomModal/RoomModal";
import "./HomePage.css"

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <div className="App">
      <TopNavbar onRoomsClick={handleModalToggle} ></TopNavbar>
      <Navbar></Navbar>
      <Modal isOpen={isModalOpen} onClose={handleModalToggle} />
    </div>
  );
}

export default HomePage;
