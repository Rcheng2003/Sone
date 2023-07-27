import React from 'react';
import './TopNavbar.css';

const TopNavbar = ({ onRoomsClick }) => {
  
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><button onClick={onRoomsClick}>Rooms</button></li>
      </ul>
    </nav>
  );
};

export default TopNavbar;
