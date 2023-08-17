import React, { useState,useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import TopNavbar from "../components/TopNavbar/TopNavbar";
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import "./HomePage.css"

import sunhigh1 from "../components/Background-Video/SunHigh1.mov";

function HomePage() {
  const [currentVideo, setCurrentVideo] = useState(sunhigh1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  async function populateUserInfo() {
    try {
      const req = await fetch("http://localhost:3001/api/user/profile", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });

      // Check if response status is not okay (like 401 for unauthorized)
      if (!req.ok) {
        throw new Error('Unauthorized');
      }

      const data = await req.json();
      if (data.status === "ok") {
        setUser(data.user);
      }
    } catch (error) {
      if (error.message === 'Unauthorized') {
        navigate("/login")
        return; // stop further execution
      }
      console.error("An error occurred:", error);
    } finally {
      setLoading(false); // authentication check completed, stop showing loading state
    }
  }

  useEffect(() => {
    populateUserInfo();
  }, []);

  const handleVideoChange = (newVideo) => {
    setCurrentVideo(newVideo);
  };
  // If it's loading, you can return a spinner or a simple message
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <TopNavbar currRoom={null}></TopNavbar>
      <Navbar onChange={handleVideoChange} user={user}></Navbar>
      <div className="video-background">
        <ReactPlayer
          url={currentVideo}
          playing
          loop
          muted
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
}

export default HomePage;
