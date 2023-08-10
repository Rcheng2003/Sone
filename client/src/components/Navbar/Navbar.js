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
import Notepad from "../Notepad/Notepad";
import Calendar from "../Calendar/Calendar";
import UserProfile from "../User-Profile/UserProfile";
import Timer from "../Pomodoro-Timer/Timer";
import Calculator from "../Calculator/Calculator";
import Background from "../Background-Video/Background";

function Navbar() {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const [showTodo, setShowTodo] = useState(false);
  const [showNotepad, setShowNotepad] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showUserProfile, setUserProfile] = useState(false);
  const [showBackground, setBackground] = useState(false);
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

  const SetVisibleCalculator = () => {
    setShowCalculator(true);
  };

  const SetVisibleCalendar = () => {
    setShowCalendar(true);
  };

  const SetVisibleNotepad = () => {
    setShowNotepad(true);
  };

  const handleCloseNotepad = () => {
    setShowNotepad(false);
  };

  const handleCloseTodo = () => {
    setShowTodo(false);
  };

  const handleCloseCalculator = () => {
    setShowCalculator(false);
  };

  const SetVisibleTimer = () => {
    setShowTimer(true);
  };

  const handleCloseTimer = () => {
    setShowTimer(false);
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false);
  };

  const SetUserProfile = () => {
    if (!user) {
      navigate("/login");
    } else {
      setUserProfile(true);
    }
  };

  const SetVisibleBackground = () => {
    setBackground(true);
  }

  const handleCloseBackground = () => {
    setBackground(false);
  }

  const handleCloseUser = () => {
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
            <button onClick={SetVisibleBackground}>
              <AiIcons.AiFillPicture />
            </button>
            <button>
              <HiIcons.HiMusicNote />
            </button>
            <button onClick={SetVisibleTodo}>
              <BsIcons.BsCardChecklist />
            </button>
            <button onClick={SetVisibleNotepad}>
              <BsIcons.BsStickyFill />
            </button>
            <button onClick={SetVisibleCalendar}>
              <BsIcons.BsCalendar3 />
            </button>
            <button onClick={SetVisibleCalculator}>
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
      <div className="Components">
        {showTimer && <Timer onClose={handleCloseTimer} />}
        {showTodo && <Todo onClose={handleCloseTodo} />}
        {showNotepad && <Notepad onClose={handleCloseNotepad} />}
        {showCalendar && <Calendar onClose={handleCloseCalendar} />}
        {showCalculator && <Calculator onClose={handleCloseCalculator} />}
        {showUserProfile && (
          <UserProfile user={user} email={email} isOpen = {showUserProfile} onClose={handleCloseUser} />
        )}
        {showBackground && <Background onClose={handleCloseBackground} />}
      </div>
    </div>
  );
}

export default Navbar;
