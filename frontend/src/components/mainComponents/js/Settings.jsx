import React from 'react';
import { BiQuestionMark } from "react-icons/bi";

function Settings({ settings, updateSettings }) {
    return (
        <div id="settingsInputs">
            <h3>Settings</h3>
            <label for="timerLen">Timer</label> 
            <input name="timerLen" id="timerLen" type="number" min="5" value={settings.timer} onChange={(e) => updateSettings({...settings, timer: Number(e.target.value) >= 5 ? Number(e.target.value) : 5 })}></input>
            <div className="informationHover" title="This only applies to Person VS AI"><BiQuestionMark /></div>
            <label for="playerTurn">Player picks...</label> 
            <select name="playerTurn" id="playerTurn" onChange={(e) => updateSettings({...settings, userTurn: e.target.value})}>
                <option value="first">first</option>
                <option value="second">second</option>
            </select>
        </div>
    );
}

export default Settings;