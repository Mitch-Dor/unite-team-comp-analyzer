import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/main.css'

function Main() {
  const navigate = useNavigate();

  function chooseBackgrounds(){
    let rand = Math.floor(Math.random() * 5); // 5 Possible backgrounds
    switch(rand){
        case 0:
            setBackground(require("./assets/landingPageBackgrounds/Blurred/UNITE_Auroma_Park.png"))
            break;
        case 1:
            setBackground(require("./assets/landingPageBackgrounds/Blurred/UNITE_Mer_Stadium.png"))
            break;
        case 2:
            setBackground(require("./assets/landingPageBackgrounds/Blurred/UNITE_Remoat_Stadium.png"))
            break;
        case 3:
            setBackground(require("./assets/landingPageBackgrounds/Blurred/UNITE_Shivre_City.png"))
            break;
        case 4:
            setBackground(require("./assets/landingPageBackgrounds/Blurred/UNITE_Theia_Sky_Ruins.png"))
            break;
        default:
            console.error("Background Generation Error");
            setBackground(require("./assets/landingPageBackgrounds/Blurred/UNITE_Theia_Sky_Ruins.png"))
            break;
    }
  }

  function setBackground(pngPath){
    const mainContainer = document.getElementById("mainContainer");
    if (mainContainer) {
      mainContainer.style.backgroundImage = `url(${pngPath})`;
      mainContainer.style.backgroundSize = "cover";
      mainContainer.style.backgroundRepeat = "repeat-x";
    }
  }

  function setTitle(){
    const titleContainer = document.getElementById("titleContainer");
    const titleImage = require("./assets/Title.png");
    if (titleContainer) {
      titleContainer.style.backgroundImage = `url(${titleImage})`;
      titleContainer.style.backgroundSize = "contain";
      titleContainer.style.backgroundRepeat = "no-repeat";
      titleContainer.style.backgroundPosition = "center";
    }
  }

  useEffect(() => {
    chooseBackgrounds(); // Choose the background on the component mounting
    setTitle();
  }, []);

  return (
    <div id="mainContainer" className="scrollingBackground">
        <div id="cornerContainer">
            <button id="report" className="cornerBTN">!</button>
            <button id="info" className="cornerBTN">i</button>
        </div>
        <div id="titleContainer"></div>
        <div id="bigBTNContainer">
            <div id="modesContainer">
                <button id="YOUvsAI" className="modeBTN bigBTNs" onClick={() => navigate('/person-vs-ai')}>Person VS AI</button>
                <button id="AIvsAI" className="modeBTN bigBTNs" onClick={() => navigate('/ai-vs-ai')}>AI VS AI</button>
            </div>
            <div id="settingContainer">
                <button id="YOUvsAIset" className="settingBTN bigBTNs Left">Person VS AI Settings</button>
                <button id="compScore" className="modeBTN bigBTNs Left" onClick={() => navigate('/score-a-comp')}>Score A Comp</button>
                <button id="stats" className="modeBTN bigBTNs Right" onClick={() => navigate('/stats')}>Stats</button>
                <button id="AIvsAIset" className="settingBTN bigBTNs Right">AI VS AI Settings</button>
            </div>  
        </div>
        <div id="nametag">Created by Mitchell Dorward</div>
    </div>
  );
}

export default Main;