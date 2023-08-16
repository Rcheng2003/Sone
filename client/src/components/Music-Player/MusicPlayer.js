import React, { useState, useEffect } from 'react'
import LoginPlayer from './LoginPlayer.js'
import MusicControl from './MusicControl.js'
import './MusicPlayer.css'; 

function MusicPlayer() {
    const [token, setToken] = useState(''); 

    useEffect(() => {
        async function getToken() {
            const response = await fetch('/auth/token'); 
            const json = await response.json(); 
            setToken(json.access_token); 
        }
        getToken(); 
    }, [])

    return (
        token === "" ? <LoginPlayer/> : <MusicControl token={token} /> 
    )
}

export default MusicPlayer; 