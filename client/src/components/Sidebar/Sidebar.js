import React, { useState } from 'react';
import './Sidebar.css'; // Add your own CSS file for styling j

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="container">
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Your sidebar content goes here */}
      <div className="sidebar-content">
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </div>
      <button onClick={toggleSidebar} className={`toggle-button ${isOpen ? 'open' : ''}`}>
        <span className="toggle-icon">{isOpen ? "<" : ">"}</span>
      </button>
    </div>
    <div className={`content ${isOpen ? 'shift' : ''}`}>
      {/* Your main content goes here */}
      <h1>Welcome to my website</h1>
      <p>Some content...</p>
    </div>
  </div>


  );
};

export default Sidebar;
