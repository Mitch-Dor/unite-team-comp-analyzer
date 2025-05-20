import React, { useState } from 'react';
import HoverInsights from './HoverInsights';
import { GoArrowSwitch } from "react-icons/go";

const TeamDisplay = ({ team, bans, picks, idealTeams, side, setPosition, targetPokemon, setTeam, pokemonList, settings }) => {
    const [hoveredPokemon, setHoveredPokemon] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })

    const handleMouseEnter = (event, pokemon, index) => {
        setHoveredPokemon(pokemon); 
        setHoveredIndex(index);
        const rect = event.target.getBoundingClientRect();
        setHoverPosition({ x: rect.right + 10, y: rect.top });
    };

    const handleMouseLeave = () => {
        setHoveredPokemon(null);
        setHoveredIndex(null);
    };

    function handleSetPosition(pokemon, team, position){
        if (pokemon){
            setPosition(pokemon, team, position);
        }
    }

    function specialCase(pokemon){
        let otherPokemon;
        if (pokemon.pokemon_name === 'Scyther'){
            otherPokemon = pokemonList.find(pokemon => pokemon.pokemon_name === 'Scizor');
        } else if (pokemon.pokemon_name === 'Scizor'){
            otherPokemon = pokemonList.find(pokemon => pokemon.pokemon_name === 'Scyther');
        } else if (pokemon.pokemon_name === 'Urshifu_SS'){
            otherPokemon = pokemonList.find(pokemon => pokemon.pokemon_name === 'Urshifu_RS');
        } else if (pokemon.pokemon_name === 'Urshifu_RS'){
            otherPokemon = pokemonList.find(pokemon => pokemon.pokemon_name === 'Urshifu_SS');
        }
        if (otherPokemon){
            if (settings && settings.disallowedCharacters && settings.disallowedCharacters.includes(otherPokemon)){
                return null;
            } else {
                return otherPokemon;
            }
        }
        return null;
    }

    function switchSpecialCase(pokemon, switchTo, position){
        if (position) { // Sandbox
            handleSetPosition(switchTo, team, position);
        } else { // Normal Draft
            const teamCopy = [...picks];
            // Find the location of pokemon in the team array
            const index = teamCopy.findIndex(p => p.pokemon_name === pokemon.pokemon_name);
            // Swap switchTo into the location of pokemon
            teamCopy[index] = switchTo;
            // Update the team
            setTeam(teamCopy);
        }
    }

    return (
        <>
            {setPosition ? ( /* This is the sandbox mode */
                <>
                    <div className="teamBans" id={`${team}Bans`}>
                        {["ban1", "ban2"].map((banPosition, index) => {
                            const currentBan = bans.find(ban => ban.position === banPosition);
                            return (
                                <div key={index} onClick={() => handleSetPosition(targetPokemon, team, banPosition)}>
                                    <img 
                                        className={`characterPortrait banDisplay ${targetPokemon ? 'selectable' : null}`} 
                                        src={currentBan ? `/assets/Draft/headshots/${currentBan?.pokemon?.pokemon_name || ''}.png` : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'} 
                                    />
                                </div>
                            );
                        })}
                    </div>
                    {["pick1", "pick2", "pick3", "pick4", "pick5"].map((pickPosition, index) => {
                        const currentPick = picks.find(pick => pick.position === pickPosition);
                        const relatedPick = currentPick ? specialCase(currentPick.pokemon) : null;
                        return (
                            <div key={index} className={`characterSelection ${team}Selection ${currentPick?.pokemon ? '' : 'placeholder'} ${targetPokemon ? 'selectable' : null}`} onClick={() => handleSetPosition(targetPokemon, team, pickPosition)}>
                                {currentPick?.pokemon ? (
                                    // Difference between purple and orange is just content is reversed
                                    team === 'purple' ? (
                                        <>
                                            <h3>{currentPick.pokemon.pokemon_name}</h3>
                                            {relatedPick && (
                                                <button className="switchButton" onClick={() => switchSpecialCase(currentPick, relatedPick, pickPosition)}>
                                                    <GoArrowSwitch />
                                                </button>
                                            )}
                                            <img 
                                                className={`characterPortrait ${currentPick.pokemon.pokemon_class}`} 
                                                src={`/assets/Draft/headshots/${currentPick.pokemon.pokemon_name}.png`} 
                                                alt={currentPick.pokemon.pokemon_name} 
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <img 
                                                className={`characterPortrait ${currentPick.pokemon.pokemon_class}`} 
                                                src={`/assets/Draft/headshots/${currentPick.pokemon.pokemon_name}.png`} 
                                                alt={currentPick.pokemon.pokemon_name}  
                                            />
                                            {relatedPick && (
                                                <button className="switchButton" onClick={() => switchSpecialCase(currentPick, relatedPick, pickPosition)}>
                                                    <GoArrowSwitch />
                                                </button>
                                            )}
                                            <h3>{currentPick.pokemon.pokemon_name}</h3>
                                        </>
                                    )
                                ) : (
                                    team === 'purple' ? (
                                        <>
                                            <h3>Character</h3>
                                            <img className="characterPortrait" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
                                        </>
                                    ) : (
                                        <>
                                            <img className="characterPortrait" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
                                            <h3>Character</h3>
                                        </>
                                    )
                                )}
                            </div>
                        );
                    })}
                </>
            ) : ( /* This is the normal mode */
                <>
                    <div className="teamBans" id={`${team}Bans`}>
                    {/* Create as many character portraits as there are picks but add blanks so there are 2 total */}
                    {[...bans, ...Array(2 - bans.length).fill(null)].map((pokemon, index) => {
                        return (
                            <div key={index}>
                                {pokemon ? (
                                    <>
                                        <img className="characterPortrait banDisplay" src={`/assets/Draft/headshots/${pokemon.pokemon_name}.png`} ></img>
                                    </>
                                ) : (
                                    <>
                                        <img className="characterPortrait banDisplay" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
                {/* Create as many character portraits as there are picks but add blanks so there are 5 total */}
                {[...picks, ...Array(5 - picks.length).fill(null)].map((pokemon, index) => {
                    const relatedPick = pokemon ? specialCase(pokemon) : null;
                    return (
                        <div key={index} className={`characterSelection ${team}Selection ${pokemon ? '' : 'placeholder'}`}>
                            {pokemon ? (
                                // Difference between purple and orange is just content is reversed
                                team === 'purple' ? (
                                    <>
                                        <h3>{pokemon.pokemon_name}</h3>
                                        {relatedPick && (
                                            <button className="switchButton" onClick={() => switchSpecialCase(pokemon, relatedPick)}>
                                                <GoArrowSwitch />
                                            </button>
                                        )}
                                        <img className={`characterPortrait ${pokemon.pokemon_class}`} src={`/assets/Draft/headshots/${pokemon.pokemon_name}.png`} alt={pokemon.pokemon_name} onMouseEnter={(e) => handleMouseEnter(e, pokemon, index)} onMouseLeave={handleMouseLeave} />
                                    </>
                                ) : (
                                    <>
                                        <img className={`characterPortrait ${pokemon.pokemon_class}`} src={`/assets/Draft/headshots/${pokemon.pokemon_name}.png`} alt={pokemon.pokemon_name} onMouseEnter={(e) => handleMouseEnter(e, pokemon, index)} onMouseLeave={handleMouseLeave} />
                                        {relatedPick && (
                                            <button className="switchButton" onClick={() => switchSpecialCase(pokemon, relatedPick)}>
                                                <GoArrowSwitch />
                                            </button>
                                        )}
                                        <h3>{pokemon.pokemon_name}</h3>
                                    </>
                                )
                            ) : (
                                team === 'purple' ? (
                                    <>
                                        <h3>Character</h3>
                                        <img className="characterPortrait" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
                                    </>
                                ) : (
                                    <>
                                        <img className="characterPortrait" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
                                        <h3>Character</h3>
                                    </>
                                )
                            )}
                        </div>
                    );
                })}
                {hoveredPokemon && (
                    <div id="hoverDiv" style={ side === 'purple' ? 
                        { top: hoveredIndex === 4 ? hoverPosition.y - 100 : hoverPosition.y, left: hoverPosition.x } : 
                        { top: hoveredIndex === 4 ? hoverPosition.y - 100 : hoverPosition.y, right: `calc(100vw - ${hoverPosition.x}px + 80px)` }} >
                        <HoverInsights pokemon={hoveredPokemon} index={hoveredIndex} idealTeam={idealTeams && idealTeams[hoveredIndex] ? idealTeams[hoveredIndex] : null} />
                    </div>
                )}
            </>
        )}
        </>
    );
};

export default TeamDisplay;