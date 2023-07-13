import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import * as IoIoIcons from "react-icons/io";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io5";
import * as BsIcons from "react-icons/bs";
import * as HiIcons from "react-icons/hi";
import * as FaIcons from "react-icons/fa";
import Todo from "../To-Do/Todo";
import UserProfile from "../User-Profile/UserProfile";
import Timer from "../Pomodoro-Timer/Timer";

function Navbar() {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const [showTodo, setShowTodo] = useState(false);
  const [showUserProfile, setUserProfile] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");

  async function populateUserInfo() {
    const req = await fetch("http://localhost:3001/api/user/profile", {
      headers: {
         "Content-Type": "application/json",
      },
      credentials: 'include',
    });

    const data = await req.json();
    if (data.status === "ok") {
      setUser(data.name);
      setEmail(data.email);
    }
  }

  useEffect(() => {
    setUser("");
    setEmail("");
    populateUserInfo();
  
  }, []);

  const showSidebar = () => setSidebar(!sidebar);

  const SetVisibleTodo = () => {
    setShowTodo(true);
  };

  const handleClose = () => {
    setShowTodo(false);
  };

  const SetVisibleTimer = () => {
    setShowTimer(true);
  };

  const handleClose3 = () => {
    setShowTimer(false);
  };

  const SetUserProfile = () => {
    if (!user) {
      navigate("/login");
    } else {
      setUserProfile(true);
    }
  };

  const handleClose2 = () => {
    setUserProfile(false);
  };

  return (
    <div className="bar">
      <div className="mainArrow" onClick={showSidebar}>
        <IoIoIcons.IoIosArrowForward />
      </div>

      <nav className={sidebar ? "list active" : "list"}>
        <div className="closeArrow" onClick={showSidebar}>
          <IoIoIcons.IoIosArrowBack />
        </div>
        <ul className="button-list">
          <div className="Button">
            <button onClick={SetVisibleTimer}>
              <IoIcons.IoAlarmSharp />
            </button>
            <button>
              <AiIcons.AiFillPicture />
            </button>
            <button>
              <HiIcons.HiMusicNote />
            </button>
            <button onClick={SetVisibleTodo}>
              <BsIcons.BsCardChecklist />
            </button>
            <button>
              <BsIcons.BsStickyFill />
            </button>
            <button>
              <BsIcons.BsCalendar3 />
            </button>
            <button>
              <FaIcons.FaCalculator />
            </button>
            <button>
              <BsIcons.BsPhoneFill />
            </button>
            <div className="bottom">
              <button className="special">
                <IoIoIcons.IoIosSettings />
              </button>
              <button className="special" onClick={SetUserProfile}>
                <FaIcons.FaUser />
              </button>
            </div>
          </div>
        </ul>
      </nav>
      {showTodo && <Todo onClose={handleClose} />}
      {showTimer && <Timer onClose={handleClose3} />}
      {showUserProfile && (
        <UserProfile user={user} email={email} onClose={handleClose2} />
      )}
    </div>
  );
}

export default Navbar;
