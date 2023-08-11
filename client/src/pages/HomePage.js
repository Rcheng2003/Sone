import React, { useState,useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import TopNavbar from "../components/TopNavbar/TopNavbar";
import ReactPlayer from 'react-player';
import "./HomePage.css"

import sunhigh1 from "../components/Background-Video/SunHigh1.mov";

function HomePage() {
  const [currentVideo, setCurrentVideo] = useState(sunhigh1);

  return (
    <div className="App">
      <TopNavbar currRoom={null}></TopNavbar>
      <Navbar onChange={setCurrentVideo}></Navbar>
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
