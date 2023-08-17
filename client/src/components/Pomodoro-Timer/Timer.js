import { useState, useEffect } from "react"; 
import { Resizable } from 'react-resizable';
import { Howl } from "howler"  
import Draggable from 'react-draggable';
import "./Timer.css"; 
import nirvana from './audios/nirvana.mp3'; 
import celebration from './audios/best_alarm.mp3'; 
import rooster from './audios/mixkit-rooster-crowing-in-the-morning-2462.wav';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import * as AiIcons from "react-icons/ai"

function Timer({onClose}) {
    const [pomoTime, setpomoTime] = useState({min: 25, sec: 0, decreasing: false, default: true}); 
    const [shortTime, setshortTime] = useState({min: 5, sec: 0, decreasing: false, default: true}); 
    const [longTime, setlongTime] = useState({min: 15, sec: 0, decreasing: false, default: true}); 
    const [time, setTime] = useState(pomoTime); 
    const [display, setDisplay] = useState(null); 
    const [mode, setMode] = useState("pomodoro"); 
    const [cycle, setCycle] = useState(0); 
    const [automatic, setAutomatic] = useState(false); 
    const [customize, setCustomize] = useState(false); 
    const [mute, setMute] = useState(false); 
    const [volume, setVolume] = useState({prev: 0, curr: 50});
    const [alarmOn, setalarmOn] = useState(false); 
    const [audio, setAudio] = useState(nirvana); 
    const [alarm, setAlarm] = useState(new Howl({src: [audio]}))

    const [width, setWidth] = useState(400);
    const [height, setHeight] = useState(300);
    const [position, setPosition] = useState({ x: 400, y: 100 });
  

    // to render the time display for the first time page is loaded or when it is decreasing in time  
    useEffect(() => {
        if (time.decreasing || time.default) {
            setDisplay(time.min.toString().padStart(2, '0') + ":" + time.sec.toString().padStart(2, '0')); 
        } 
    }, [time]);

    // to render the timer for each mode the client selects and certain constraints are put 
    useEffect(() => {
        if (mode === "pomodoro" && pomoTime.min > 0 && pomoTime.min < 361) {
            setTime(pomoTime); 
        } else if (mode === "short" && shortTime.min > 0 && shortTime.min < 361) {
            setTime(shortTime); 
        } else if (mode === "long" && longTime.min > 0 && longTime.min < 361) {
            setTime(longTime); 
        }
    }, [pomoTime, shortTime, longTime]); 

    // to render the tab title and display the time 
    useEffect(() => {
        if (time.decreasing) {
            document.title = display + " | Sone"; 
        } else {
            document.title = "Sone"; 
        }
    }, [display])

    // to render the volume display 
    useEffect(() => {  
        if (mute) {
            setVolume({prev: volume.curr, curr: 0}); 
        } else if (!volume.prev && !volume.curr) {
            setVolume({prev: 0, curr: 50});
        } else {
            setVolume({prev: volume.curr, curr: volume.prev});
        }
    }, [mute])  

    // update the volume 
    useEffect(() => {
        setVolume(volume); 
    }, [volume]) 

    useEffect(() => {
        // to make mode switching deterministic based on cycles 
        if (time.min === 0 && time.sec === 0) {
            if (mode === "pomodoro") {
                if (cycle !== 0 && cycle % 4 === 0) {
                    handleMode("long"); 
                } else {
                    handleMode("short"); 
                }
            } else if (mode === "short" || mode === "long") {
                handleMode("pomodoro"); 
                setCycle(cycle+1); 
            } 
            if (automatic) setTime((oldTime) => {return {...oldTime, decreasing: true}})
        }
        
        // main functionality for the timer 
        if (time.decreasing && time.min >= 0 && time.sec >= 0) {
            const timeoutID = setTimeout(() => {
                if (time.sec === 0) {   
                    setTime((oldTime) => {return {...oldTime, min: oldTime.min-1, sec: 60}})
                }
                setTime((oldTime) => {return {...oldTime, sec: oldTime.sec-1}})
            }, 1000)
            return () => {
                clearTimeout(timeoutID); 
            }
        }       
    }, [time]) 

    // plays the alarm of the ringtone chosen once the timer for the certain mode expires 
    useEffect(() => {
        if (time.min === 0 && time.sec === 0) {
            console.log(alarm); 
            alarm.play(); 
            setalarmOn(true);
        }

        let timeElapsed = 0; 
        if (alarmOn) {
            const intervalID = setInterval(() => {
                if (timeElapsed === 3) {  
                    setalarmOn(false); 
                    alarm.stop(); 
                }
                timeElapsed += 1; 
            }, 1000)
            return () => {
                clearInterval(intervalID)  
            }
        } 
    }, [time])

    // updates the alarm audio 
    useEffect(() => {
        alarm.unload(); 
        setAlarm(new Howl({
            src: [audio], 
            volume: volume.curr/100
        }))
        alarm.load(); 
    }, [audio, volume])


    // when the user hits start or pause 
    const handleTime = () => {
        if (!time.decreasing) {
            return setTime((oldTime) => {return {...oldTime, decreasing: true, default: false}})
        } else {
            return setTime((oldTime) => {return {...oldTime, decreasing: false}})
        }
    }

    // when the user clicks on other modes 
    const handleMode = (str) => {
        if (str === "pomodoro") {
            setMode("pomodoro"); 
            setTime(pomoTime);      
        } else if (str === "short") {
            setMode("short"); 
            setTime(shortTime);
        } else if (str === "long") {
            setMode("long"); 
            setTime(longTime);
        }
    }

    // when the user clicks reset 
    const handleReset = () => {
        if (mode === "pomodoro") {
            setTime(pomoTime);
        } else if (mode === "short") {
            setTime(shortTime);
        } else if (mode === "long") {
            setTime(longTime); 
        }
    }

    // for when options are shown 
    const handleOptions = () => {
        setCustomize((oldCustomize) => {return !oldCustomize});
    }

    // when automatic transition is activated
    const handleAutomatic = () => {
        setAutomatic((oldAutomatic) => {return !oldAutomatic});
    }

    // when the user clicks on the volume button or if either the previous 
    // or current volume is nonzero to handle when both are zero then you cannot unmute 
    const handleMute = () => {
        if (parseInt(volume.curr) !== 0 && parseInt(volume.prev) === 0 || 
            parseInt(volume.curr) === 0 && parseInt(volume.prev) !== 0 || !mute) {
                setMute((oldMute) => {return !oldMute});
        }
    }

    // used for the input to change based off of what user enters
    const handleChange = (e) => {
        const name = e.target.name; 
        const value = e.target.value; 

        if (e.target.id === "Pomodoro") {
            setpomoTime({...pomoTime, [name]: value});
        } else if (e.target.id === "Short") {
            setshortTime({...shortTime, [name]: value});
        } else if (e.target.id === "Long") {
            setlongTime({...longTime, [name]: value});
        }
    }

    // update the volume value and setting mute when volume is 0 
    const handleVolume = (e) => {
        setVolume((oldVolume) => {return {...oldVolume, curr: e.target.value}})

        if (parseInt(e.target.value) === 0) {
            setMute(true); 
        } else {
            setMute(false);
        }
    }

    const handleDrag = (e, ui) => {
    const { x, y } = position;
    const { width, height } = position;
    const innerWidth = document.documentElement.clientWidth - 100;
    const innerHeight = document.documentElement.clientHeight - 100;

    const newPosition = {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
    };

    setPosition(newPosition);
    };

    const handleClose = () => {
    if (onClose) {
        onClose();
    }
    };

    return (
        <Draggable
            position={position}
            onDrag={handleDrag}
            handle=".TimerHandle"
        >
            <div className="TimerMain">
                <div className="TimerHandle">
                    <div className="TimerHandle-content">Timer</div>
                    <button className="Timeclose-button" onClick={handleClose}>
                    <AiIcons.AiOutlineClose></AiIcons.AiOutlineClose>
                    </button>
                </div>
                <div className={customize ? "expandContainer" : "container"}>
                    {/* top component with the display and start and restart button*/}
                    <div className="top">
                        <div className="time">
                            {display}
                        </div>

                        <button className="start-pause" onClick={() => handleTime()}>
                            {time.decreasing ? "Pause" : "Start"}
                        </button>

                        <RestartAltIcon className="reset" onClick={() => handleReset()}/>
                    </div>

                    {/* bottom component with the modes and options */}
                    <div className="bot">
                        <button className="pomodoro" onClick={() => handleMode("pomodoro")}>
                            Pomodoro
                        </button>

                        <button className="short" onClick={() => handleMode("short")}>
                            Short Break
                        </button>

                        <button className="long" onClick={() => handleMode("long")}>
                            Long Break
                        </button>

                        <SettingsIcon className="settings" onClick={() => handleOptions()}/>
                    </div>
                </div>
            {/* settings tab */}
            <div className={customize ? "showSettings" : "hideSettings"}>
                <div className="clickers">
                    <input className="check" type="checkbox" 
                    onChange={() => handleAutomatic()} />
                    
                    <label>Auto-transition Timer</label>
                </div>
                
                {/* component for time inputs */}
                <div className="form"> 
                    <div className="form-control" >
                        <label htmlFor="Pomodoro">Pomodoro</label>
                        <input 
                            className="num"
                            type="number"
                            id="Pomodoro"
                            name="min"
                            value={pomoTime.min}
                            onChange={handleChange}
                        />
                    </div >

                    <div className="form-control">
                        <label htmlFor="Short">Short</label>
                        <input 
                            className="num"
                            type="number"
                            id="Short"
                            name="min"
                            value={shortTime.min}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-control">
                        <label htmlFor="Long">Long</label>
                        <input 
                            className="num"
                            type="number"
                            id="Long"
                            name="min"
                            value={longTime.min}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* component for choosing the timer sounds */}
                <div className="audio-selects">
                    <label>Timer Sound</label>
                    <select className="selections" 
                            value={audio}
                            onChange={(e) => setAudio(e.target.value)}>
                        <option value={nirvana}>Nirvana</option>
                        <option value={celebration}>Celebration</option>
                        <option value={rooster}>Rooster</option>
                    </select>
                </div>

                {/* volume component for adjusting the audio for the timer song */}
                <div className="volume"> 
                    {mute ? <VolumeOffIcon className="volume-icon" onClick={() => handleMute()}/> : 
                    <VolumeUpIcon className="volume-icon" onClick={() => handleMute()}/> }

                    <input 
                        className="volume-adjust"
                        type="range"
                        value={volume.curr}
                        onChange={handleVolume}
                    />
                </div> 

                <button 
                    className="save" 
                    type="submit" 
                    onClick={() => handleOptions()}>
                        Save
                </button>
            </div>
        </div>
        </Draggable>
    )
}

export default Timer; 