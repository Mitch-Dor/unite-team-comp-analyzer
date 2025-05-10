import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/main.css'
import Settings from '../../sideComponents/js/Settings';
import Login from '../../sideComponents/js/Login';
import Information from '../../sideComponents/js/Information';
import { IoIosInformationCircle } from "react-icons/io";
import { IoMdAlert } from "react-icons/io";


function Main() {
  const [numUsers, setNumUsers] = useState(2);
  const [settings, setSettings] = useState({timer: 25, userTurn: "first", disallowedCharacters: []});
  const [settingsActive, setSettingsActive] = useState(false);
  const [infoActive, setInfoActive] = useState(false);
  const [user, setUser] = useState(null);
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
  }

  useEffect(() => {
    chooseBackgrounds(); // Choose the background on the component mounting
    setTitle();
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div id="mainContainer" className="scrollingBackground">
        <div id="cornerContainer">
            <button id="report" className="cornerBTN" onClick={() => window.open("https://forms.gle/CcD2mnziUqcEsy56A", "_blank")}>
              <IoMdAlert style={{ width: '100%', height: '100%' }} />
            </button>
            <button id="info" className="cornerBTN" onClick={() => setInfoActive(true)}>
              <IoIosInformationCircle style={{ width: '100%', height: '100%' }} />
            </button>
            <Login setUser={setUser} />
        </div>
        <div id="titleContainer"></div>
        <div id="bigBTNContainer">
            <div id="modesContainer">
                <button id="SingleDraft" className="modeBTN bigBTNs" onClick={() => navigate('/single-draft', {state: {numUsers: numUsers, settings: settings}})}>Single Draft</button>
                <button id="DraftSandbox" className="modeBTN bigBTNs" onClick={() => navigate('/draft-sandbox')}>Draft Sandbox</button>
                <button id="MultiDraft" className="modeBTN bigBTNs" onClick={() => navigate('/multi-draft', {state: {settings: settings, user: user}})}>Multiplayer Draft</button>
            </div>
            <div id="AdditionalFeaturesContainer">
                <button id="tierList" className="modeBTN bigBTNs" onClick={() => navigate('/tier-list', {state: {user: user}})}>Tier List</button>
                <button id="compScoreBTN" className="modeBTN bigBTNs" onClick={() => navigate('/score-a-comp')}>Score A Comp</button>
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
            <div id="setSettings" onClick={(e) => e.stopPropagation()}>
              < Settings settings={settings} updateSettings={setSettings} numUsers={numUsers} setNumUsers={setNumUsers} ></Settings>
            </div>
          </div>
        )}
        { infoActive && (
          <div id="infoScreenCover" onClick={() => setInfoActive(false)}>
            <div id="infoScreen" onClick={(e) => e.stopPropagation()}>
              < Information ></Information>
            </div>
          </div>
        )}
    </div>
  );
}

export default Main;