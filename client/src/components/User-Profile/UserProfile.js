import React, {useState} from "react";
import "./userProfile.css"; // Import the CSS file for styling
//API

const UserProfile = ({user, email, pfp, setPfp, isOpen, onClose}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError(''); // Reset error
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image to upload.");
      return;
    }
    
    const formData = new FormData();
    formData.append('profilePic', selectedFile);

    try {
      const response = await fetch("http://localhost:3001/api/user/uploadPfp", {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      const data = await response.json();

      if (data.status === "ok") {
        // Refresh the profile picture
        setPfp(data.filePath);
      } else {
        setError(data.error || "Failed to upload profile picture.");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("An error occurred while uploading the image.");
    }
  };


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
                <img src={`http://localhost:3001${pfp}`} alt="User's profile" />
                <form onSubmit={e => e.preventDefault()}>
                  <input type="file" onChange={handleFileChange} />
                  <button type="button" onClick={handleUpload}>Upload</button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
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