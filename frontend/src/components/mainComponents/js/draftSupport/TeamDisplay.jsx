import React, { useState } from 'react';
import HoverInsights from './HoverInsights';

const TeamDisplay = ({ team, bans, picks, idealTeams, side, setPosition, targetPokemon }) => {
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
        console.log(pokemon, team, position);
        if (pokemon){
            setPosition(pokemon, team, position);
        }
    }

    return (
        <>
            {setPosition ? ( /* This is the sandbox mode */
                <div>
                    <div id={`${team}Bans`}>
                        {["ban1", "ban2"].map((banPosition, index) => (
                            <div key={index} onClick={() => handleSetPosition(targetPokemon, team, banPosition)}>
                                <img 
                                    className={`characterPortrait banDisplay ${targetPokemon ? 'selectable' : null}`} 
                                    src={`/assets/Draft/headshots/${bans.find(ban => ban.position === banPosition)?.pokemon?.pokemon_name || ''}.png`} 
                                />
                            </div>
                        ))}
                    </div>
                    {["pick1", "pick2", "pick3", "pick4", "pick5"].map((pickPosition, index) => (
                        <div key={index} className={`characterSelection ${team}Selection ${picks.find(pick => pick.position === pickPosition)?.pokemon ? '' : 'placeholder'} ${targetPokemon ? 'selectable' : null}`} onClick={() => handleSetPosition(targetPokemon, team, pickPosition)}>
                            {picks.find(pick => pick.position === pickPosition)?.pokemon ? (
                                // Difference between purple and orange is just content is reversed
                                team === 'purple' ? (
                                    <>
                                        <h3>{picks.find(pick => pick.position === pickPosition).pokemon.pokemon_name}</h3>
                                        <img 
                                            className={`characterPortrait ${picks.find(pick => pick.position === pickPosition).pokemon.pokemon_class}`} 
                                            src={`/assets/Draft/headshots/${picks.find(pick => pick.position === pickPosition).pokemon.pokemon_name}.png`} 
                                            alt={picks.find(pick => pick.position === pickPosition).pokemon.pokemon_name} 
                                        />
                                    </>
                                ) : (
                                    <>
                                        <img 
                                            className={`characterPortrait ${picks.find(pick => pick.position === pickPosition).pokemon.pokemon_class}`} 
                                            src={`/assets/Draft/headshots/${picks.find(pick => pick.position === pickPosition).pokemon.pokemon_name}.png`} 
                                            alt={picks.find(pick => pick.position === pickPosition).pokemon.pokemon_name}  
                                        />
                                        <h3>{picks.find(pick => pick.position === pickPosition).pokemon.pokemon_name}</h3>
                                    </>
                                )
                            ) : (
                                team === 'purple' ? (
                                    <>
                                        <h3>Character</h3>
                                        <img className={`characterPortrait`} />
                                    </>
                                ) : (
                                    <>
                                        <img className={`characterPortrait`} />
                                        <h3>Character</h3>
                                    </>
                                )
                            )}
                        </div>
                    ))}
                </div>
            ) : ( /* This is the normal mode */
                <>
                    <div id={`${team}Bans`}>
                    {/* Create as many character portraits as there are picks but add blanks so there are 2 total */}
                    {[...bans, ...Array(2 - bans.length).fill(null)].map((pokemon, index) => (
                        <div key={index}>
                            {pokemon ? (
                                <>
                                    <img className="characterPortrait banDisplay" src={`/assets/Draft/headshots/${pokemon.pokemon_name}.png`} ></img>
                                </>
                            ) : (
                                <>
                                    <img className="characterPortrait banDisplay"></img>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                {/* Create as many character portraits as there are picks but add blanks so there are 5 total */}
                {[...picks, ...Array(5 - picks.length).fill(null)].map((pokemon, index) => (
                    <div key={index} className={`characterSelection ${team}Selection ${pokemon ? '' : 'placeholder'}`}>
                        {pokemon ? (
                            // Difference between purple and orange is just content is reversed
                            team === 'purple' ? (
                                <>
                                    <h3>{pokemon.pokemon_name}</h3>
                                    <img className={`characterPortrait ${pokemon.pokemon_class}`} src={`/assets/Draft/headshots/${pokemon.pokemon_name}.png`} alt={pokemon.pokemon_name} onMouseEnter={(e) => handleMouseEnter(e, pokemon, index)} onMouseLeave={handleMouseLeave} />
                                </>
                            ) : (
                                <>
                                    <img className={`characterPortrait ${pokemon.pokemon_class}`} src={`/assets/Draft/headshots/${pokemon.pokemon_name}.png`} alt={pokemon.pokemon_name} onMouseEnter={(e) => handleMouseEnter(e, pokemon, index)} onMouseLeave={handleMouseLeave} />
                                    <h3>{pokemon.pokemon_name}</h3>
                                </>
                            )
                        ) : (
                            team === 'purple' ? (
                                <>
                                    <h3>Character</h3>
                                    <img className="characterPortrait" />
                                </>
                            ) : (
                                <>
                                    <img className="characterPortrait" />
                                    <h3>Character</h3>
                                </>
                            )
                        )}
                    </div>
                ))}
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