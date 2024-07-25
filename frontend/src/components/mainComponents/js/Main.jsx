import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/main.css'

function Main() {
  const navigate = useNavigate();

  return (
    <div id="mainContainer">
        <div id="cornerContainer">
            <button id="report" class="cornerBTN"></button>
            <button id="info" class="cornerBTN"></button>
        </div>
        <div id="titleContainer">
            {/* This should probably just be an image */}
        </div>
        <div id="bigBTNContainer">
            <div id="modesContainer">
                <button id="YOUvsAI" class="modeBTN bigBTNs" onClick={() => navigate('/person-vs-ai')}></button>
                <button id="AIvsAI" class="modeBTN bigBTNs" onClick={() => navigate('/ai-vs-ai')}></button>
            </div>
            <div id="settingContainer">
                <button id="YOUvsAIset" class="settingBTN bigBTNs"></button>
                <button id="compScore" class="modeBTN bigBTNs" onClick={() => navigate('/score-a-comp')}></button>
                <button id="stats" class="modeBTN bigBTNs" onClick={() => navigate('/stats')}></button>
                <button id="AIvsAIset" class="settingBTN bigBTNs"></button>
            </div>  
        </div>
        <div id="nametag">Created by Mitchell Dorward</div>
    </div>
  );
}

export default Main;