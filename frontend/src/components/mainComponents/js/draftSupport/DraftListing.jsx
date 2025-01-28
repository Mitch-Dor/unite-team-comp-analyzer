import React, { useEffect } from 'react';
const constants = require('../../../../common/naming_constants.js');
const routes = require('../../../../common/route_constants.js');

const DraftListing = ({ pokemonList, team1Bans, team2Bans, team1Picks, team2Picks, draftState, updateDraftState, updatePokemonStatus, draftProgression, numUsers, settings }) => { // Adding {} around this destructures the props. Otherwise everything will just be in one props obejct
    
    useEffect(() => {
        if (draftState !== 'done'){
            if(numUsers == 0) {
                // It's all AI just let them do their thing
                const choiceAI = pickAI();
                doAction(choiceAI);
            } else if (numUsers == 1) {
                if ((settings.userTurn === "first" && draftState.includes("team2")) || (settings.userTurn === "second" && draftState.includes("team1"))){
                    // There is a user but it's the AI's turn
                    const choiceAI = pickAI();
                    doAction(choiceAI);
                }
            }
        }
    }, [draftState]);

    const pickAI = () => {
        return genRandomPokemon();
    }

    function genRandomPokemon() {
        const randIndex = Math.floor(Math.random() * pokemonList.length);
        const pokemon = pokemonList[randIndex];
        if (!team1Bans.includes(pokemon) && !team2Bans.includes(pokemon) && !team1Picks.includes(pokemon) && !team2Picks.includes(pokemon)) {
            return pokemon;
        } 
        return genRandomPokemon();
    }
    
    const setBan1 = (pokemon) => {
        updatePokemonStatus(pokemon, "ban1");
    }
    const setBan2 = (pokemon) => {
        updatePokemonStatus(pokemon, "ban2");
    }
    const setTeam1 = (pokemon) => {
        updatePokemonStatus(pokemon, "team1");
    }
    const setTeam2 = (pokemon) => {
        updatePokemonStatus(pokemon, "team2");
    }
    const doAction = (pokemon) => {
        // Can just move to next index in draftProgression to keep track of draft state
        const currentIndex = draftProgression.indexOf(draftState);
        // Ensure it's not the last state
        if (currentIndex >= 0 && currentIndex < draftProgression.length - 1) {
            // Get the next state
            const nextState = draftProgression[currentIndex + 1];
            // Update the draft state
            updateDraftState(nextState);
            // Perform the action based on the current state
            switch (draftState) {
                case 'team1Ban1':
                case 'team1Ban2':
                    setBan1(pokemon);
                    break;
                case 'team2Ban1':
                case 'team2Ban2':
                    setBan2(pokemon);
                    break;
                case 'team1Pick1':
                case 'team1Pick2':
                case 'team1Pick3':
                case 'team1Pick4':
                case 'team1Pick5':
                    setTeam1(pokemon);
                    break;
                case 'team2Pick1':
                case 'team2Pick2':
                case 'team2Pick3':
                case 'team2Pick4':
                case 'team2Pick5':
                    setTeam2(pokemon);
                    break;
                default:
                    console.error('Unhandled draft state:', draftState);
            }
        } else {
            console.warn('Draft is already at the final state or invalid state.');
        }
    }

    return (
        <>
            {pokemonList && pokemonList.length > 0 ? (
                pokemonList.map(pokemon => {
                    // Check if the pokemon is already picked/banned
                    const isUnavailable = team1Bans.includes(pokemon) || team2Bans.includes(pokemon) || team1Picks.includes(pokemon) || team2Picks.includes(pokemon);
                    return (
                        <div className={`draftCharacter ${pokemon.pokemon_class} ${isUnavailable ? 'unavailable' : 'available'}`} key={pokemon.pokemon_id} onClick={() => {doAction(pokemon)}}>
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