import React, {useState} from "react";
import "./Background.css";

import Draggable from "react-draggable";

import sunhigh1 from "./SunHigh1.mov";
import sunhigh2 from "./SunHigh2.mov";

import sunset1 from "./RedSun.mov";
import sunset2 from "./Sunsetbird.mov";
import sunset3 from "./Sunsetbird2.mov";

import question1 from "./CampFire.mov";
import question2 from "./Fish.mov";
import question3 from "./Street.mov"


import * as TbIcons from "react-icons/tb";
import ReactPlayer from 'react-player';

import imgsh1 from "./SunHigh1.png"
import imgsh2 from "./SunHigh2.png"

import imgredsun from "./RedSun.png"
import imgssb from "./Sunsetbird.png"
import imgssb2 from "./Sunsetbird2.png"

import imgCampFire from "./CampFire.png"
import imgFish from "./Fish.png"
import imgstreet from "./Street.png"

function Background() {
    const [currentVideo, setCurrentVideo] = React.useState(sunhigh1);

    const Time = [true,false,false,false,false,false];

    const [currentSet, setCurrentSet] = React.useState(Time);

    const handleVideoChange = (newVideo) => {
      setCurrentVideo(newVideo);
    };

    const handleSetChange = (index) => {
        const updatedSet = currentSet.map((_,i) =>
            i === index
        );
        setCurrentSet(updatedSet);
    }

    return (
        <div className="Whole">
            <Draggable>
            <div className="mini-sidebar">
                <div className="Suns">
                    <button className="SunRise" onClick={() => handleSetChange(0)}>
                        <TbIcons.TbSunrise></TbIcons.TbSunrise>
                    </button>
                    <button className="SunRise2" onClick={() => handleSetChange(1)}>
                        <TbIcons.TbSunset2> </TbIcons.TbSunset2>
                    </button>
                    <button className="SunHigh" onClick={() => handleSetChange(2)}>
                        <TbIcons.TbSunHigh></TbIcons.TbSunHigh>
                    </button>
                    <button className="SunSet" onClick={() => handleSetChange(3)}>
                        <TbIcons.TbSunset></TbIcons.TbSunset>
                    </button>
                    <button className="Moon" onClick={() => handleSetChange(4)}>
                        <TbIcons.TbMoonStars></TbIcons.TbMoonStars> 
                    </button>
                    <button className="huh" onClick={() => handleSetChange(5)}>
                        <TbIcons.TbQuestionMark></TbIcons.TbQuestionMark> 
                    </button>
                </div>
            <div>
                {currentSet.map((isVisible, index) => (
                    <div>
                    {isVisible && index === 0 && <div className="SR">
                        <button className="options" onClick={() => handleVideoChange(question3)}><img src="./idk.png" alt="NA"/> </button>
                        <button className="options"onClick={() => handleVideoChange(sunhigh1)}><img src="./idk.png" alt="NA"/> </button>
                        <button className="options"onClick={() => handleVideoChange(question2)}><img src="./idk.png" alt="NA"/> </button>
                        </div>}

                    {isVisible && index === 1 && <div className="SR2">
                        <button className="options" onClick={() => handleVideoChange(sunhigh1)}><img src="./idk.png" alt="NA"/> </button>
                        <button className="options"onClick={() => handleVideoChange(sunhigh2)}><img src="./idk.png" alt="NA"/> </button>
                        <button className="options"onClick={() => handleVideoChange(question2)}><img src="./idk.png" alt="NA"/> </button>
                        </div>}

                    {isVisible && index === 2 && <div className="SH">
                        <button className="options" onClick={() => handleVideoChange(sunhigh1)}><img src={imgsh1} alt="SunHigh1"/> </button>
                        <button className="options"onClick={() => handleVideoChange(sunhigh2)}><img src={imgsh2} alt="SunHigh2"/> </button>
                        <button className="options"onClick={() => handleVideoChange(sunhigh2)}><img src={imgsh2} alt="SunHigh2"/> </button>
                        </div>}

                    {isVisible && index === 3 && <div className="SS">
                        <button className="options" onClick={() => handleVideoChange(sunset1)}><img src={imgredsun} alt="RedSun"/> </button>
                        <button className="options"onClick={() => handleVideoChange(sunset2)}><img src={imgssb} alt="SSB"/> </button>
                        <button className="options"onClick={() => handleVideoChange(sunset3)}><img src={imgssb2} alt="SSB2"/> </button>
                        </div>}

                    {isVisible && index === 4 && <div className="M">
                        <button className="options" onClick={() => handleVideoChange(question3)}><img src="./idk.png" alt="NA"/> </button>
                        <button className="options"onClick={() => handleVideoChange(sunhigh1)}><img src="./idk.png" alt="NA"/> </button>
                        <button className="options"onClick={() => handleVideoChange(question2)}><img src="./idk.png" alt="NA"/> </button>
                        </div>}

                    {isVisible && index === 5 && <div className="hu">
                        <button className="options" onClick={() => handleVideoChange(question1)}><img src={imgCampFire} alt="Campfire"/> </button>
                        <button className="options"onClick={() => handleVideoChange(question2)}><img src={imgFish} alt="Fish"/> </button>
                        <button className="options"onClick={() => handleVideoChange(question3)}><img src={imgstreet} alt="Street"/> </button>
                        </div>}
                    </div>

                    
                ))}
            </div>


        </div>
          
            </Draggable>
          
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
  };
  
  export default Background;