import React, { useState,useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import TopNavbar from "../components/TopNavbar/TopNavbar";
import "./HomePage.css"

function HomePage() {
  return (
    <div className="App">
      <TopNavbar></TopNavbar>
      <Navbar></Navbar>
    </div>
  );
}

export default HomePage;
