import React from 'react';

const TeamDisplay = ({ team, bans, picks }) => {

    return (
        <>
            <div id={`${team}Bans`}>
                {/* Create as many character portraits as there are picks but add blanks so there are 5 total */}
                {[...bans, ...Array(2 - bans.length).fill(null)].map((pokemon, index) => (
                    <>
                        {pokemon ? (
                            <>
                                <img key={index} className="characterPortrait banDisplay" src={`/assets/Draft/headshots/${pokemon.pokemon_name}.png`}></img>
                            </>
                        ) : (
                            <>
                                <img key={index} className="characterPortrait banDisplay"></img>
                            </>
                        )}
                    </>
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
                                <img className={`characterPortrait ${pokemon.pokemon_class}`} src={`/assets/Draft/headshots/${pokemon.pokemon_name}.png`} alt={pokemon.pokemon_name} />
                            </>
                        ) : (
                            <>
                                <img className={`characterPortrait ${pokemon.pokemon_class}`} src={`/assets/Draft/headshots/${pokemon.pokemon_name}.png`} alt={pokemon.pokemon_name} />
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
        </>
    );
};

export default TeamDisplay;