import React, {useState} from 'react';
import "./Navbar.css"
import * as IoIoIcons from "react-icons/io";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io5";
import * as BsIcons from "react-icons/bs";
import * as HiIcons from "react-icons/hi";
import * as FaIcons from "react-icons/fa";
import Todo from '../To-Do/Todo';


function Navbar () {
    const [sidebar, setSidebar] = useState(false)
    const [showTodo, setShowTodo] = useState(false);

    const showSidebar = () => setSidebar(!sidebar)

    const SetVisibleTodo = () => {
        setShowTodo(true);
    };

    const handleClose = () => {
        setShowTodo(false);
    };

    return (
        <div className="bar">
            <div className="mainArrow" onClick={showSidebar}>
            <IoIoIcons.IoIosArrowForward/>
            </div>

            <nav className={sidebar ? 'list active' : 'list'} >
              <div className="closeArrow" onClick={showSidebar}>
                  <IoIoIcons.IoIosArrowBack/>
              </div>
                <ul className='button-list'>
                    <div className="Button">
                          <button><IoIcons.IoAlarmSharp/></button>
                          <button><AiIcons.AiFillPicture/></button>
                          <button><HiIcons.HiMusicNote/></button>
                          <button onClick = {SetVisibleTodo}><BsIcons.BsCardChecklist/></button>
                          <button><BsIcons.BsStickyFill/></button>
                          <button><BsIcons.BsCalendar3/></button>
                          <button><FaIcons.FaCalculator/></button>
                          <button><BsIcons.BsPhoneFill/></button>
                          <div className='bottom'>
                            <button className='special'><IoIoIcons.IoIosSettings/></button>
                            <button className='special'><FaIcons.FaUser/></button>
                          </div>
                    </div>
                    
                </ul>
            </nav>
            {showTodo && <Todo onClose={handleClose}/>}
        </div>
    )
}

export default Navbar