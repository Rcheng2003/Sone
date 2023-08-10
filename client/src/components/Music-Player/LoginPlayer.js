import React from 'react'; 
import './LoginPlayer.css'; 

function LoginPlayer() {
    return (
        <div className='loginWrapper'>
            <a className="loginSpotify" href="/auth/login">Login with Spotify</a>
        </div>
    )
}

export default LoginPlayer; 