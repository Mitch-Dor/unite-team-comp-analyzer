import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/main.css';
import '../css/base.css';
import Login from '../../sideComponents/js/Login';
import Information from '../../sideComponents/js/Information';
import { isAdmin } from './common/http.js';


function Main() {
  const [hoveredButton, setHoveredButton] = useState(null);
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
    const bgContainer = document.getElementById("scrollingBackground");
    if (bgContainer) {
      bgContainer.style.backgroundImage = `url(${pngPath})`;
    }
  }

  useEffect(() => {
    chooseBackgrounds(); // Choose the background on the component mounting
  }, []);

  return (
    <div id="main-base-container">
        <div id="backgroundBlackCover"/>
        <div id="scrollingBackground"/>
        <div id="main-top-buttons-container">
            <div id="main-info-button"><Information /></div>
            <Login setUser={setUser} />
        </div>
        <div id="main-title-container"></div>
        <div id="main-directory-buttons-container">
                <button id="SingleDraft-DirectoryButton" className="main-directory-button" onMouseEnter={() => {setHoveredButton("singleDraft")}} onMouseLeave={() => {setHoveredButton(null)}} onClick={() => navigate('/single-draft')}>Single Draft</button>
                <button id="DraftSandbox-DirectoryButton" className="main-directory-button" onMouseEnter={() => {setHoveredButton("sandboxDraft")}} onMouseLeave={() => {setHoveredButton(null)}} onClick={() => navigate('/draft-sandbox')}>Draft Sandbox</button>
                <button id="tierList-DirectoryButton" className="main-directory-button" onMouseEnter={() => {setHoveredButton("tierList")}} onMouseLeave={() => {setHoveredButton(null)}} onClick={() => navigate('/tier-list')}>Tier List</button>
                <button id="compScoreBTN-DirectoryButton" className="main-directory-button" onMouseEnter={() => {setHoveredButton("insights")}} onMouseLeave={() => {setHoveredButton(null)}} onClick={() => navigate('/insights')}>Insights</button>
                {admin && (
                  <button id="traits" className="main-core-component-button main-directory-button" onClick={() => navigate('/traits', {state: {user: user}})}>Traits</button>
                )}
        </div>
        <div id="preview-container" className={hoveredButton !== null ? hoveredButton.includes("Draft") ? "purple" : "orange" : ""}>
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <clipPath id="curvedBlob" clipPathUnits="objectBoundingBox">
                <path d="
                  M 0.92,0.5
                  Q 0.98,0.775 0.71,0.87
                  Q 0.5,1.05 0.29,0.87
                  Q 0.024,0.775 0.08,0.5
                  Q 0.024,0.225 0.29,0.13
                  Q 0.5,-0.05 0.71,0.13
                  Q 0.976,0.225 0.92,0.5
                  Z
                " />
              </clipPath>
            </defs>
          </svg>
          {/* <video></video> */}
        </div>
        <div id="main-nametag">Created by Mitchell Dorward</div>
    </div>
  );
}

export default Main;