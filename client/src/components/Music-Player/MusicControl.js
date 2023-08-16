import { useState, useEffect } from 'react'; 
import { LinearProgress } from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import './MusicControl.css'

function MusicControl({ token }) {
    const [player, setPlayer] = useState(null); 
    const [track, setTrack] = useState(null); 
    const [state, setState] = useState(false); 
    const [paused, setPaused] = useState(false); 
    const [position, setPosition] = useState(0); 
    const [currentTime, setCurrentTime] = useState({min: 0, sec: 0}); 
    const [duration, setDuration] = useState({min: 0, sec: 0}); 
    const [msDuration, setmsDuration] = useState(0); 
    const [progress, setProgress] = useState(0); 
    const [WebPlaybackPlayer, setWebPlaybackPlayer] = useState(null);

    const msToMinsSecs = (ms) => {
        var min = Math.floor(ms / 60000);
        var sec = Math.floor((ms % 60000) / 1000);
        return {min, sec} 
    }

    function secondsToTime(s) {
        var min = Math.floor((s % 3600) / 60);
        var sec = s % 60;
        return {min, sec}
    }

    useEffect(() => {
        const script = document.createElement("script"); 
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true; 

        document.body.appendChild(script); 

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK Quick Start Player', 
                getOAuthToken: cb => { cb(token); }, 
                volume: 0.5 
            }); 

            setPlayer(player); 

            player.addListener('ready', ({ device_id }) => {
                console.log("Ready with Device ID", device_id); 
            })

            player.addListener('not_ready', ({ device_id }) => {
                console.log("Device ID is not ready for playback", device_id); 
            })

            player.addListener('initialization_error', ({ message }) => {
                console.error("Failed to initialize", message); 
            })

            player.addListener('authentication_error', ({ message }) => {
                console.error("Authentication failed", message); 
            })

            player.addListener('account_error', ({ message }) => {
                console.error("Account error", message); 
            })

            player.addListener('player_state_changed', (state => {
                if (!state) return; 
                
                setTrack(state.track_window.current_track); 
                setPaused(state.paused); 
                setWebPlaybackPlayer(state);

                if (state.position === 0) {
                    setPosition(state.position);
                    setCurrentTime(secondsToTime(state.position)); 
                    setDuration(msToMinsSecs(state.duration));
                    setmsDuration(state.duration); 
                }
                
                player.getCurrentState().then(state => {
                    state ? setState(true) : setState(false) 
                });
            }));

            player.connect();

        };
    }, []);

    useEffect(() => {
        const trackProgression = setInterval(() => {
            if (track && !paused) {  
                let msPosition = position * 1000; 
                let progressPercentage = Math.round((msPosition / msDuration) * 100) 

                setPosition(position + 1);
                setCurrentTime(secondsToTime(position)); 
                setProgress(progressPercentage); 
            }

        }, 1000)

        return () => {
            clearInterval(trackProgression)
        }

    }, [position, currentTime, WebPlaybackPlayer, paused])

    if (!state) {
        return (
            <>
                Play on Spotify
            </>
        )
    } else {    
        return (
            <>  
                <div className='MusicPlayer'> 
                    <div className='trackDisplay'>
                        <img 
                            className="trackImage" 
                            src={track.album.images[0].url} />

                            {track.name} <br/>
                            {track.artists[0].name}
                    </div>

                    <div className='progressContainer'>
                        {currentTime.min} : {currentTime.sec.toString().padStart(2, '0')}
                        <LinearProgress 
                            className='trackProgress'
                            variant='determinate' 
                            value={progress}
                        />
                        {duration.min} : {duration.sec.toString().padStart(2, '0')}
                    </div>
                    
                    <div className='playbackControl'> 
                        <SkipPreviousIcon 
                            className='playbackElement' 
                            sx={{fontSize: 35}}
                            onClick={() => {player.previousTrack()}}
                        />

                        {paused ?
                            <PlayArrowIcon 
                                className='playbackElement'
                                sx={{fontSize: 35}}
                                onClick={() => {player.togglePlay()}}
                            /> :
                            <PauseIcon 
                                className='playbackElement'
                                sx={{fontSize: 35}}
                                onClick={() => {player.togglePlay()}}
                            />
                        }
                        
    
                        <SkipNextIcon 
                            className='playbackElement' 
                            sx={{fontSize: 35}}
                            onClick={() => {player.nextTrack()}}
                        />
                    </div>
                </div>
            </>
        )
    }
}

export default MusicControl; 