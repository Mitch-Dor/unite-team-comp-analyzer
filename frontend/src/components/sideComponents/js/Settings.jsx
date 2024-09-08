import React from 'react';
import '../css/settings.css';

function Settings() {
    return (
        <div id="popupContainer">
            <div id="popup">
                {/* Have one popup component that has just this shell that is just the black box. Then have it build something specific based off what was clicked */}
                <div id="popupCharacters">
                    {/* These will be created via a for loop with one for each character */}
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                    <button className="characterSelect"></button>
                </div>
                <div id="popupSettingsSelect">
                    <div className="popupSetting">
                        <input type="checkbox" id="allowBans"></input>
                        <label for="allowBans">Bans?</label>
                    </div>
                </div>
                <div id="popupApplyContainer">
                    <button id="popupApplyBTN">Apply</button>
                </div>
            </div>
        </div>
    )
}

export default Settings;