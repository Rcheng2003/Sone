import React from "react";
import "./userProfile.css"; // Import the CSS file for styling
//API

const UserProfile = ({user, email, pfp, isOpen, onClose}) => {
  const logoutUser = async () => {
     try {
      const response = await fetch("http://localhost:3001/api/auth/logout", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        window.location.href = "/";
      } 
    } catch (err) {
      console.log(err);
    }
  };
  return (
         <div className={`profileModal ${isOpen ? 'open' : 'closed'}`}>
           <div className="profileModal-content">
              <span className="closeProfile" onClick={onClose}>&times;</span>
              <h2 className="UserProfileHeader">User Profile</h2>
              <div className="pfpConatiner">
                <img src={pfp} alt="User's profile" />
              </div>
              <div className="profile-details">
                  <p><strong>Username:</strong> {user}</p>
                  <p><strong>Email:</strong> {email}</p>
              </div>
              <button className="logout-button" onClick={logoutUser}>Logout</button>
            </div>
        </div>
  );
}

export default UserProfile;