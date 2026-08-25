import {useState} from 'react';
import { FaCog } from "react-icons/fa";
import '../css/settings.css';
import '../../mainComponents/css/classBackgrounds.css';
import ReactDOM from 'react-dom';

function Settings({ pokemonList, settings, updateSettings }) {
    const [open, setOpen] = useState(false);

    function handleCharacterClick(character) {
        // Check if character is already in disallowedCharacters
        if (settings.disallowedCharacters.includes(character)) {
            // If it is, remove it
            updateSettings({
                ...settings, 
                disallowedCharacters: settings.disallowedCharacters.filter(c => c !== character)
            });
        } else {
            if (pokemonList.length - settings.disallowedCharacters.length <= 16) {
                alert("There need to be at least 16 characters for a draft.");
                return;
            }
            // If it's not, add it
            updateSettings({
                ...settings, 
                disallowedCharacters: [...settings.disallowedCharacters, character]
            });
        }
    }

    const content = (
        <div id="settings-screen-cover" onClick={() => {setOpen(false)}}>
            <div id="settings-container">
                <h3>Settings</h3>
                {settings.timer != null && (
                    <div className="settings-content-row">
                        <label htmlFor="timerLen">Timer</label> 
                        <input name="timerLen" id="timerLen" type="number" min="5" value={settings.timer} onChange={(e) => updateSettings({...settings, timer: Number(e.target.value) >= 5 ? Number(e.target.value) : 5 })}></input>
                    </div>
                )}
                <div className="settings-content-row">
                    <label htmlFor="numPlayers">Select Mode</label> 
                    <select 
                        name="numPlayers" 
                        id="numPlayers" 
                        value={settings.numUsers}
                        onChange={(e) => updateSettings({...settings, numUsers: Number(e.target.value)})}
                    >
                        <option value={2}>Person VS Person (Local)</option>
                        <option value={1}>Person VS AI</option>
                        <option value={0}>AI VS AI</option>
                    </select>
                </div>
                <div className="settings-enable-disable-character-list">
                    <p>Disallowed Characters</p>
                    {pokemonList.map(character => (
                        <div 
                            key={character.pokemon_name} 
                            className={`settings-enable-disable-character-listDiv ${settings.disallowedCharacters.includes(character.pokemon_name) ? 'disallowed' : ''}`} 
                            onClick={() => handleCharacterClick(character.pokemon_name)}
                        >
                            <img 
                                className={`settings-enable-disable-character-listImg ${character.pokemon_class}`} 
                                src={`/assets/Draft/headshots/${character.pokemon_name}.png`} 
                                alt={character.pokemon_name} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button id="draft-settings-button" onClick={() => setOpen(true)}>
                <FaCog />
            </button>
            {open && ReactDOM.createPortal(content, document.body)}
        </>
    );
}

export default Settings;