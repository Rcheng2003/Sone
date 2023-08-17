import React, { useState,useEffect, useRef} from "react";
import TopNavbar from "../components/TopNavbar/TopNavbar";
import ChatIcon from '@mui/icons-material/Chat';
import { useParams, useNavigate } from "react-router-dom";
import {io} from "socket.io-client";
import "./Room.css"
const Room = () => {
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [currRoom, setCurrRoom] = useState();
  const { roomCode } = useParams();

  const messageContainerRef = useRef(null);

  const toggleChatModal = () => {
    setIsChatModalOpen((prevState) => !prevState);
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const response = await fetch("http://localhost:3001/api/message",{
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({
            content: newMessage,
            roomId: roomCode
          }),
        })
        const data = await response.json();
        setNewMessage("");
        socket.emit("new message",data);
        setMessages([...messages, data]);
      } catch (error) {
        console.log(error)
      }
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/message/${roomCode}`,{
        headers: {
        "Content-Type": "application/json",
        },
        credentials: 'include',
      })
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.log(error)
    }
    
  };

  const getRoomInfo = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/study-room/${roomCode}`,{
        headers: {
        "Content-Type": "application/json",
        },
        credentials: 'include',
      })
      const data = await response.json();
      setCurrRoom(data);
    } catch (error) {
      console.log(error)
    }
    
  }

  useEffect(() => {
    // Scroll to the bottom of the container whenever messages are updated or chat is opened
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages, isChatModalOpen]);


  useEffect(() => {
  if (socket) {
    socket.on("message received", (newMessageReceived) => {
      console.log(newMessageReceived)
      setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
    });
  }
  }, [socket]);


  useEffect(()=>{
    fetchMessages();
    getRoomInfo();
  }, [roomCode]);

  useEffect(() => {
    const initializeSocket = () => {
      const newSocket = io("http://localhost:3001");
      setSocket(newSocket);
    };

    initializeSocket();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("joined room", roomCode);
    }
  }, [socket, roomCode]);


  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };



  return (
    <div>
      <div className="Roombg">       </div>
        <TopNavbar currRoom = {currRoom}></TopNavbar>
        {!isChatModalOpen && (
          <div className="chat-icon" onClick={toggleChatModal}>
            <ChatIcon/>
          </div>
        )}
        {isChatModalOpen && (
        <div className="chat-modal" style={{ width: "20%", backgroundColor: "white" }}>
            <div className="message-container-container" ref={messageContainerRef}>
              {messages.map((message, index) => (
                <div className="message-container">
                  <div className="pfp-container">
                    <img src={message.sender.profilePicture === "/images/SoneDefaultPFP.png" ? "/images/SoneDefaultPFP.png" : message.sender.profilePicture} alt="User's profile" />
                  </div>
                  <div className="message-details">
                    <div className="top-message-container">
                      <div className="message-sender">{message.sender.name}</div>
                      <p className="message-date">{new Date(message.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="message-content">
                      {message.content}
                    </div>
                  </div>
                </div>
            ))}
            </div>
            <input
              type="text"
              value={newMessage}
              placeholder="Enter a message..."
              onChange={handleInputChange}
              onKeyDown={sendMessage}
            />
          <span className="close" onClick={toggleChatModal}>&times;</span>
        </div>
      )}

    </div>
  );
};

export default Room;
