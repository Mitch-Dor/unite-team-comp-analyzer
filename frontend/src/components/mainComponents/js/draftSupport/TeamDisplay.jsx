import { GoArrowSwitch } from "react-icons/go";
import "../../css/draftSupport/teamDisplay.css";
import { getInversePokemon } from '../common/common';

const TeamDisplay = ({ team, bans, picks, setPosition, targetPokemon, setTeam, pokemonList, settings }) => {
    const isInRegularMode = !setPosition;

    const handleClick = (event, pokemon, team, position) => {
        event.preventDefault(); // Prevent default context menu
        if (event.button === 0) { // Left click
            handleSetPosition(pokemon, team, position);
        } else if (event.button === 2) { // Right click
            // Remove the selection
            handleSetPosition(null, team, position);
        }
    };

    function handleSetPosition(pokemon, team, position){
        if (position) { // Only call setPosition if we have a valid position
            setPosition(pokemon, team, position);
        }
    }

    function specialCase(pokemon){
        const otherPokemon = getInversePokemon(pokemon, pokemonList);
        if (otherPokemon){
            if (settings && settings.disallowedCharacters && settings.disallowedCharacters.includes(otherPokemon.pokemon_name)){
                return null;
            } else {
                return otherPokemon;
            }
        }
        return null;
    }

    function switchSpecialCase(pokemon, switchTo, position){
        if (isInRegularMode) { // Normal Draft
            const teamCopy = [...picks];
            // Find the location of pokemon in the team array
            const index = teamCopy.findIndex(p => p.pokemon_name === pokemon.pokemon.pokemon_name);
            // Swap switchTo into the location of pokemon
            teamCopy[index] = switchTo;
            // Update the team
            setTeam(teamCopy);
        } else { // Sandbox
            handleSetPosition(switchTo, team, position);
        }
    }

    // Assign .position to bans and picks when dealing with non-sandbox mode so everything works the same.
    // We know that everything in picks / bans will be in order so it's easy to assign

    const positionedBans = isInRegularMode
        ? bans.map((ban, index) => ({ pokemon: ban, position: `ban${index + 1}` }))
        : [...bans];
    const positionedPicks = isInRegularMode
        ? picks.map((pick, index) => ({ pokemon: pick, position: `pick${index + 1}` }))
        : [...picks];

    return (
        <>
            <div className="draft-team-display-bans-container" id={`${team}Bans`}>
                {["ban1", "ban2", "ban3"].map((banPosition, index) => {
                    const currentBan = positionedBans.find(ban => ban.position === banPosition);
                    return (
                        <img 
                            key={index}
                            onClick={isInRegularMode ? null : (e => handleClick(e, targetPokemon, team, banPosition))}
                            onContextMenu={isInRegularMode ? null : (e => handleClick(e, targetPokemon, team, banPosition))}
                            className={`draft-character-portrait draft-team-display-bans ${!isInRegularMode && targetPokemon ? 'selectable' : null}`} 
                            src={currentBan?.pokemon?.pokemon_name ? `/assets/Draft/headshots/${currentBan?.pokemon?.pokemon_name || ''}.png` : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'} 
                        />
                    );
                })}
            </div>
            <div className="draft-team-display-picks-container" id={`${team}Bans`}>
                {["pick1", "pick2", "pick3", "pick4", "pick5"].map((pickPosition, index) => {
                    const currentPick = positionedPicks.find(pick => pick.position === pickPosition);
                    const relatedPick = currentPick ? specialCase(currentPick.pokemon) : null;
                    return (
                        <div key={index} 
                            className={`draft-team-display-character-pick ${team}-side ${currentPick?.pokemon?.pokemon_class} ${!isInRegularMode && targetPokemon ? 'selectable' : null}`} 
                            onClick={isInRegularMode ? null : (e) => handleClick(e, targetPokemon, team, pickPosition)}
                            onContextMenu={isInRegularMode ? null : (e) => handleClick(e, targetPokemon, team, pickPosition)}
                        >
                            <h3>{currentPick?.pokemon?.pokemon_name || 'Character'}</h3>
                            {relatedPick && (
                                <button className="draft-team-display-switch-character-form-buttom" onClick={(e) => {e.stopPropagation(); switchSpecialCase(currentPick, relatedPick, pickPosition);}}>
                                    <GoArrowSwitch />
                                </button>
                            )}
                            <img className={`class-background-smear ${team} ${currentPick?.pokemon?.pokemon_class}`}/>
                            <img 
                                className={`draft-character-model`} 
                                src={currentPick?.pokemon?.pokemon_name ? `/assets/models/${currentPick?.pokemon?.pokemon_name}.png` : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'} 
                                alt={currentPick?.pokemon?.pokemon_name || 'blank'} 
                            />
                            {currentPick?.pokemon && (
                                <img 
                                className={`draft-character-portrait ${currentPick?.pokemon?.pokemon_class}`} 
                                src={currentPick?.pokemon?.pokemon_name ? `/assets/Draft/headshots/${currentPick?.pokemon?.pokemon_name}.png` : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'} 
                                alt={currentPick?.pokemon?.pokemon_name || 'blank'} 
                            />
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default TeamDisplay;