import {useState, useEffect} from 'react';
import { fetchCharacterDraftInfo } from '../../mainComponents/js/backendCalls/http.js';
import { BiQuestionMark } from "react-icons/bi";
import '../css/settings.css';

function Settings({ numUsers, setNumUsers, settings, updateSettings, startDraft, isConnected, joinCreate }) {
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        fetchCharacterDraftInfo().then(data => {
            setCharacters(data);
        });
    }, []);

    function handleCharacterClick(character) {
        // Check if character is already in disallowedCharacters
        if (settings.disallowedCharacters.includes(character)) {
            // If it is, remove it
            updateSettings({
                ...settings, 
                disallowedCharacters: settings.disallowedCharacters.filter(c => c !== character)
            });
        } else {
            // There need to be at least 14 characters for a draft.
            if (characters.length - settings.disallowedCharacters.length <= 14) {
                alert("There need to be at least 14 characters for a draft.");
                return;
            }
            // If it's not, add it
            updateSettings({
                ...settings, 
                disallowedCharacters: [...settings.disallowedCharacters, character]
            });
        }
    }
    
    return (
        <div id="settingsInputs">
            <h3>Settings</h3>
            <div className="settingsRow">
                <label htmlFor="timerLen">Timer</label> 
                <input name="timerLen" id="timerLen" type="number" min="5" value={settings.timer} onChange={(e) => updateSettings({...settings, timer: Number(e.target.value) >= 5 ? Number(e.target.value) : 5 })}></input>
            </div>
            {numUsers != null && (
                <div className="settingsRow">
                    <label htmlFor="numPlayers">Select Mode</label> 
                    <select 
                        name="numPlayers" 
                        id="numPlayers" 
                        value={numUsers}
                        onChange={(e) => setNumUsers(Number(e.target.value))}
                    >
                        <option value={2}>Person VS Person (Local)</option>
                        <option value={1}>Person VS AI</option>
                        <option value={0}>AI VS AI</option>
                    </select>
                </div>
            )}
            {numUsers === 1 &&(
                <div className="settingsRow">
                    <label htmlFor="playerTurn">Player picks...</label> 
                    <select name="playerTurn" id="playerTurn" value={settings.userTurn} onChange={(e) => updateSettings({...settings, userTurn: e.target.value})}>
                        <option value="first">first</option>
                        <option value="second">second</option>
                    </select>
                    <div className="informationHover" title="This only applies to Person VS AI"><BiQuestionMark /></div>
                </div>
            )}
            {settings.firstUser && (
                <div className="settingsRow">
                    <label htmlFor="playerTurn">Host picks...</label> 
                    <select name="playerTurn" id="playerTurn" value={settings.firstUser} onChange={(e) => updateSettings({...settings, firstUser: Number(e.target.value)})}>
                        <option value={1}>first</option>
                        <option value={2}>second</option>
                    </select>
                </div>
            )}
            <div className="characterList">
                <p>Disallowed Characters</p>
                {characters.map(character => (
                    <div 
                        key={character.pokemon_name} 
                        className={`characterListDiv ${settings.disallowedCharacters.includes(character.pokemon_name) ? 'disallowed' : ''}`} 
                        onClick={() => handleCharacterClick(character.pokemon_name)}
                    >
                        <img 
                            className={`characterListImg ${character.pokemon_class}`} 
                            src={`/assets/Draft/headshots/${character.pokemon_name}.png`} 
                            alt={character.pokemon_name} 
                        />
                    </div>
                ))}
            </div>
            {(joinCreate ? (joinCreate === "create" && isConnected && startDraft) : startDraft) && (
                <button id="startDraft" onClick={() => startDraft(true)}>Start Draft</button>
            )}
        </div>
    );
}

export default Settings;