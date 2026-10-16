import React from 'react';
import "../../css/draftSupport/draftListing.css";
import { getInversePokemon } from '../common/common';

const NONE_POKEMON = { pokemon_name: "none", pokemon_class: "none" };

const DraftListing = ({ mode, pokemonList, purpleTeamDraft, orangeTeamDraft, draftState, settings, targetPokemon, setTargetPokemon, lockIn }) => {

    function isUnavailablePokemon(pokemon){
        // Special cases for Pokemon that are technically grouped as one in the game but are separate in my database
        if(pokemon === NONE_POKEMON){
            return false;
        }
        
        let specialCaseUnavailable = false;
        const inversePokemon = getInversePokemon(pokemon, pokemonList);
        if (inversePokemon && (purpleTeamDraft.bans.some(item => item.pokemon === inversePokemon) || orangeTeamDraft.bans.some(item => item.pokemon === inversePokemon) || purpleTeamDraft.picks.some(item => item.pokemon === inversePokemon) || orangeTeamDraft.picks.some(item => item.pokemon === inversePokemon))) {
            specialCaseUnavailable = true;
        }
        return specialCaseUnavailable ||
            purpleTeamDraft.bans.some(item => item.pokemon === pokemon) || 
            orangeTeamDraft.bans.some(item => item.pokemon === pokemon) || 
            purpleTeamDraft.picks.some(item => item.pokemon === pokemon) || 
            orangeTeamDraft.picks.some(item => item.pokemon === pokemon) ||
            settings.disallowedCharacters.includes(pokemon.pokemon_name);
    }

    function handleTargetPokemon(pokemon){
        if (targetPokemon && targetPokemon === pokemon && mode !== 'sandbox') {
            lockIn(pokemon);
            setTargetPokemon(null);
            return;
        }

        // Check if the pokemon is already picked/banned
        const isUnavailable = isUnavailablePokemon(pokemon);
        if (draftState !== 'done' && !isUnavailable){
            if(settings.numUsers == 2) {
                // It's definitely a user turn
                setTargetPokemon(pokemon);
            } else if (settings.numUsers == 1) {
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

    const displayList = (draftState?.includes("Ban") || draftState === "") ? [NONE_POKEMON, ...pokemonList] : pokemonList;

    return (
        <div id="draft-board-characters-container">
            {pokemonList && pokemonList.length > 0 ? (
                displayList.map(pokemon => {
                    const isUnavailable = isUnavailablePokemon(pokemon);
                    return (
                        <div key={pokemon.pokemon_name} className={`draft-listing-character-container ${isUnavailable ? 'unavailable' : 'available'} ${targetPokemon === pokemon ? 'targeted' : ''}`} onClick={() => {handleTargetPokemon(pokemon)}}>
                            <img className={`draft-character-portrait ${pokemon.pokemon_class}`} src={`/assets/Draft/headshots/${pokemon.pokemon_name}.png`} alt={pokemon.pokemon_name} />
                            <h4>{pokemon.pokemon_name}</h4>
                        </div>
                    );
                })
            ) : (
                <p>No Pokémon available</p>
            )}
        </div>
    );
};

export default DraftListing;