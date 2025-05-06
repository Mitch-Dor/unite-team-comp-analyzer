import React from 'react';

const DraftListing = ({ pokemonList, team1Bans, team2Bans, team1Picks, team2Picks, draftState, updateDraftState, updatePokemonStatus, draftProgression, numUsers, settings, targetPokemon, setTargetPokemon }) => { // Adding {} around this destructures the props. Otherwise everything will just be in one props obejct

    function handleTargetPokemon(pokemon){
        // Check if the pokemon is already picked/banned
        const isUnavailable = team1Bans.includes(pokemon) || team2Bans.includes(pokemon) || team1Picks.includes(pokemon) || team2Picks.includes(pokemon) || settings.disallowedCharacters.includes(pokemon.pokemon_name);
        console.log("handling target pokemon", pokemon);
        if (draftState !== 'done' && !isUnavailable){
            if(numUsers == 2) {
                // It's definitely a user turn
                setTargetPokemon(pokemon);
            } else if (numUsers == 1) {
                if ((settings.userTurn === "first" && draftState.includes("team1")) || (settings.userTurn === "second" && draftState.includes("team2"))){
                    // There is an AI but it's the user's turn
                    setTargetPokemon(pokemon);
                }
            }
        }
    }

    return (
        <>
            {pokemonList && pokemonList.length > 0 ? (
                pokemonList.map(pokemon => {
                    const isUnavailable = team1Bans.includes(pokemon) || team2Bans.includes(pokemon) || team1Picks.includes(pokemon) || team2Picks.includes(pokemon) || settings.disallowedCharacters.includes(pokemon.pokemon_name);
                    return (
                        <div key={pokemon.pokemon_name} className={`draftCharacter ${pokemon.pokemon_class} ${isUnavailable ? 'unavailable' : 'available'} ${targetPokemon === pokemon ? 'targeted' : ''}`} onClick={() => {handleTargetPokemon(pokemon)}}>
                            <img className="characterPortrait" src={`/assets/Draft/headshots/${pokemon.pokemon_name}.png`} alt={pokemon.pokemon_name} />
                            <h4>{pokemon.pokemon_name}</h4>
                        </div>
                    );
                })
            ) : (
                <p>No Pokémon available</p>
            )}
        </>
    );
};

export default DraftListing;