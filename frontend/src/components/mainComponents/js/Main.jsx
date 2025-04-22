import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/main.css'
import Settings from './Settings';

function Main() {
  const [settings, setSettings] = useState({timer: 25, userTurn: "first"});
  const [settingsActive, setSettingsActive] = useState(false);
  const [settingsLocation, setSettingsLocation] = useState({x: 0, y: 0});
  const navigate = useNavigate();

  function chooseBackgrounds(){
    let rand = Math.floor(Math.random() * 5); // 5 Possible backgrounds
    switch(rand){
        case 0:
            setBackground("/assets/landingPageBackgrounds/Blurred/UNITE_Auroma_Park.png")
            break;
        case 1:
            setBackground("/assets/landingPageBackgrounds/Blurred/UNITE_Mer_Stadium.png")
            break;
        case 2:
            setBackground("/assets/landingPageBackgrounds/Blurred/UNITE_Remoat_Stadium.png")
            break;
        case 3:
            setBackground("/assets/landingPageBackgrounds/Blurred/UNITE_Shivre_City.png")
            break;
        case 4:
            setBackground("/assets/landingPageBackgrounds/Blurred/UNITE_Theia_Sky_Ruins.png")
            break;
        default:
            console.error("Background Generation Error");
            setBackground("/assets/landingPageBackgrounds/Blurred/UNITE_Theia_Sky_Ruins.png")
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
    const titleImage = "/assets/Title.png";
    if (titleContainer) {
      titleContainer.style.backgroundImage = `url(${titleImage})`;
      titleContainer.style.backgroundSize = "contain";
      titleContainer.style.backgroundRepeat = "no-repeat";
      titleContainer.style.backgroundPosition = "center";
    }
  }

  function openCloseSettings (event) {
    setSettingsActive(!settingsActive);
    const rect = event.target.getBoundingClientRect();
    setSettingsLocation({ x: ((rect.left + rect.right)/2)-(window.innerWidth/10), y: rect.top - (window.innerHeight/4) });
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
                <button id="YOUvsAI" className="modeBTN bigBTNs" onClick={() => navigate('/person-vs-ai', {state: {numUsers: 1, settings: settings}})}>Person VS AI</button>
                <button id="MULTI" className="modeBTN bigBTNs" onClick={() => navigate('/multi-draft', {state: {numUsers: 2, settings: settings}})}>Multi Draft</button>
                <button id="PERSONvsPERSON" className="modeBTN bigBTNs" onClick={() => navigate('/person-vs-person', {state: {numUsers: 2, settings: settings}})}>Person VS Person</button>
                <button id="AIvsAI" className="modeBTN bigBTNs" onClick={() => navigate('/ai-vs-ai', {state: {numUsers: 0, settings: settings}})}>AI VS AI</button>
            </div>
            <div id="AdditionalFeaturesContainer">
                <button id="tierList" className="modeBTN bigBTNs" onClick={() => navigate('/tier-list')}>Tier List</button>
                <button id="compScore" className="modeBTN bigBTNs" onClick={() => navigate('/score-a-comp')}>Score A Comp</button>
                <button id="stats" className="modeBTN bigBTNs" onClick={() => navigate('/stats')}>Stats</button>
                <button id="traits" className="modeBTN bigBTNs" onClick={() => navigate('/traits')}>Traits</button>
                <button id="comps" className="modeBTN bigBTNs" onClick={() => navigate('/comps')}>Team Comps</button>
            </div>
            <div id="settingContainer">
                <button id="settings" className="settingBTN bigBTNs" onClick={(e) => openCloseSettings(e)}>Draft Settings</button>
            </div>
        </div>
        <div id="nametag">Created by Mitchell Dorward</div>
        { settingsActive && (
          <div id="settingsScreenCover" onClick={() => setSettingsActive(false)}>
            <div id="setSettings">
              < Settings settings={settings} updateSettings={setSettings} ></Settings>
            </div>
          </div>
        )}
    </div>
  );
}

export default Main;