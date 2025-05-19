import React from 'react';

const DraftListing = ({ pokemonList, team1Bans, team2Bans, team1Picks, team2Picks, draftState, updateDraftState, updatePokemonStatus, draftProgression, numUsers, settings, targetPokemon, setTargetPokemon }) => { // Adding {} around this destructures the props. Otherwise everything will just be in one props obejct

    function isUnavailablePokemon(pokemon){
        // Special cases for Pokemon that are technically grouped as one in the game but are separate in my database
        let specialCaseUnavailable = false;
        switch (pokemon.pokemon_name){
            case 'Scyther':
                if (team1Bans.some(item => item.pokemon_name === 'Scizor' || (item.pokemon && item.pokemon.pokemon_name === 'Scizor')) || team2Bans.some(item => item.pokemon_name === 'Scizor' || (item.pokemon && item.pokemon.pokemon_name === 'Scizor')) || team1Picks.some(item => item.pokemon_name === 'Scizor' || (item.pokemon && item.pokemon.pokemon_name === 'Scizor')) || team2Picks.some(item => item.pokemon_name === 'Scizor' || (item.pokemon && item.pokemon.pokemon_name === 'Scizor'))){
                    specialCaseUnavailable = true;
                }
                break;
            case 'Scizor':
                if (team1Bans.some(item => item.pokemon_name === 'Scyther' || (item.pokemon && item.pokemon.pokemon_name === 'Scyther')) || team2Bans.some(item => item.pokemon_name === 'Scyther' || (item.pokemon && item.pokemon.pokemon_name === 'Scyther')) || team1Picks.some(item => item.pokemon_name === 'Scyther' || (item.pokemon && item.pokemon.pokemon_name === 'Scyther')) || team2Picks.some(item => item.pokemon_name === 'Scyther' || (item.pokemon && item.pokemon.pokemon_name === 'Scyther'))){
                    specialCaseUnavailable = true;
                }
                break;
            case 'Mewtwo_Y':
                if (team1Bans.some(item => item.pokemon_name === 'Mewtwo_X' || (item.pokemon && item.pokemon.pokemon_name === 'Mewtwo_X')) || team2Bans.some(item => item.pokemon_name === 'Mewtwo_X' || (item.pokemon && item.pokemon.pokemon_name === 'Mewtwo_X')) || team1Picks.some(item => item.pokemon_name === 'Mewtwo_X' || (item.pokemon && item.pokemon.pokemon_name === 'Mewtwo_X')) || team2Picks.some(item => item.pokemon_name === 'Mewtwo_X' || (item.pokemon && item.pokemon.pokemon_name === 'Mewtwo_X'))){
                    specialCaseUnavailable = true;
                }
                break;
            case 'Mewtwo_X':
                if (team1Bans.some(item => item.pokemon_name === 'Mewtwo_Y' || (item.pokemon && item.pokemon.pokemon_name === 'Mewtwo_Y')) || team2Bans.some(item => item.pokemon_name === 'Mewtwo_Y' || (item.pokemon && item.pokemon.pokemon_name === 'Mewtwo_Y')) || team1Picks.some(item => item.pokemon_name === 'Mewtwo_Y' || (item.pokemon && item.pokemon.pokemon_name === 'Mewtwo_Y')) || team2Picks.some(item => item.pokemon_name === 'Mewtwo_Y' || (item.pokemon && item.pokemon.pokemon_name === 'Mewtwo_Y'))){
                    specialCaseUnavailable = true;
                }
                break;
            case 'Urshifu_SS':
                if (team1Bans.some(item => item.pokemon_name === 'Urshifu_RS' || (item.pokemon && item.pokemon.pokemon_name === 'Urshifu_RS')) || team2Bans.some(item => item.pokemon_name === 'Urshifu_RS' || (item.pokemon && item.pokemon.pokemon_name === 'Urshifu_RS')) || team1Picks.some(item => item.pokemon_name === 'Urshifu_RS' || (item.pokemon && item.pokemon.pokemon_name === 'Urshifu_RS')) || team2Picks.some(item => item.pokemon_name === 'Urshifu_RS' || (item.pokemon && item.pokemon.pokemon_name === 'Urshifu_RS'))){
                    specialCaseUnavailable = true;
                }
                break;
            case 'Urshifu_RS':
                if (team1Bans.some(item => item.pokemon_name === 'Urshifu_SS' || (item.pokemon && item.pokemon.pokemon_name === 'Urshifu_SS')) || team2Bans.some(item => item.pokemon_name === 'Urshifu_SS' || (item.pokemon && item.pokemon.pokemon_name === 'Urshifu_SS')) || team1Picks.some(item => item.pokemon_name === 'Urshifu_SS' || (item.pokemon && item.pokemon.pokemon_name === 'Urshifu_SS')) || team2Picks.some(item => item.pokemon_name === 'Urshifu_SS' || (item.pokemon && item.pokemon.pokemon_name === 'Urshifu_SS'))){
                    specialCaseUnavailable = true;
                }
                break;
        }
        if (settings){
            return specialCaseUnavailable ||
                team1Bans.includes(pokemon) || 
                team2Bans.includes(pokemon) || 
                team1Picks.includes(pokemon) || 
                team2Picks.includes(pokemon) || 
                settings.disallowedCharacters.includes(pokemon.pokemon_name);
        } else {
            return specialCaseUnavailable ||
                team1Bans.some(item => item.pokemon === pokemon) || 
                team2Bans.some(item => item.pokemon === pokemon) || 
                team1Picks.some(item => item.pokemon === pokemon) || 
                team2Picks.some(item => item.pokemon === pokemon);
        }
    }

    function handleTargetPokemon(pokemon){
        // Check if the pokemon is already picked/banned
        const isUnavailable = isUnavailablePokemon(pokemon);
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
        if (!draftState && !isUnavailable){
            setTargetPokemon(pokemon);
        }
    }

    return (
        <>
            {pokemonList && pokemonList.length > 0 ? (
                pokemonList.map(pokemon => {
                    const isUnavailable = isUnavailablePokemon(pokemon);
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