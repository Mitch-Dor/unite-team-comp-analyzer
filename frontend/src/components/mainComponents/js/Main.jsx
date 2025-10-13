import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/main.css';
import '../css/base.css';
import Settings from '../../sideComponents/js/Settings';
import Login from '../../sideComponents/js/Login';
import Information from '../../sideComponents/js/Information';
import { IoMdAlert } from "react-icons/io";
import { isAdmin } from './common/http.js';


function Main() {
  const [numUsers, setNumUsers] = useState(2);
  const [settings, setSettings] = useState({timer: 25, userTurn: "first", disallowedCharacters: []});
  const [settingsActive, setSettingsActive] = useState(false);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAdmin() {
      if (user) {
        const admin = await isAdmin();
        setAdmin(admin);
      }
    }
    checkAdmin();
  }, [user]);

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
    const mainContainer = document.getElementById("main-base-container");
    if (mainContainer) {
      mainContainer.style.backgroundImage = `url(${pngPath})`;
    }
  }

  useEffect(() => {
    chooseBackgrounds(); // Choose the background on the component mounting
  }, []);

  return (
    <div id="main-base-container" className="scrollingBackground">
        <div id="main-top-buttons-container">
            <button id="main-report-button" className="main-top-buttons" onClick={() => window.open("https://forms.gle/CcD2mnziUqcEsy56A", "_blank")}>
              <IoMdAlert style={{ width: '100%', height: '100%' }} />
            </button>
            <div id="main-info-button" className="main-top-buttons">
              <Information />
            </div>
            <Login setUser={setUser} />
        </div>
        <div id="main-title-container"></div>
        <div id="main-directory-buttons-container">
            <div className="main-directory-buttons-row">
                <button id="SingleDraft" className="main-core-component-button main-directory-button main-draft-button" onClick={() => navigate('/single-draft', {state: {numUsers: numUsers, settings: settings}})}>Single Draft</button>
                <button id="DraftSandbox" className="main-core-component-button main-directory-button main-draft-button" onClick={() => navigate('/draft-sandbox')}>Draft Sandbox</button>
                <button id="MultiDraft" className="main-core-component-button main-directory-button main-draft-button" onClick={() => navigate('/multi-draft', {state: {settings: settings, user: user}})}>Multiplayer Draft</button>
            </div>
            <div className="main-directory-buttons-row">
                <button id="tierList" className="main-core-component-button main-directory-button" onClick={() => navigate('/tier-list', {state: {user: user}})}>Tier List</button>
                <button id="compScoreBTN" className="main-core-component-button main-directory-button" onClick={() => navigate('/insights')}>Insights</button>
                <button id="stats" className="main-core-component-button main-directory-button" onClick={() => navigate('/stats')}>Stats</button>
                {admin && (
                  <button id="traits" className="main-core-component-button main-directory-button" onClick={() => navigate('/traits', {state: {user: user}})}>Traits</button>
                )}
                <button id="proMatches" className="main-core-component-button main-directory-button" onClick={() => navigate('/pro-matches', {state: {user: user}})}>Pro Matches</button>
            </div>
            <div class="main-directory-buttons-row">
                <button id="settings" className="main-setting-button main-directory-button" onClick={() => setSettingsActive(!settingsActive)}>Draft Settings</button>
            </div>
        </div>
        <div id="main-nametag">Created by Mitchell Dorward</div>
        { settingsActive && (
          <Settings settings={settings} updateSettings={setSettings} numUsers={numUsers} setNumUsers={setNumUsers} closeSettings={() => {setSettingsActive(false)}} ></Settings>
        )}
    </div>
  );
}

export default Main;