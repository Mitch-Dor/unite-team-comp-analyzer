import React, { useEffect } from 'react';
const constants = require('../../../../common/naming_constants.js');
const routes = require('../../../../common/route_constants.js');

const DraftListing = ({ pokemonList, team1Bans, team2Bans, team1Picks, team2Picks, draftState, updateDraftState, updatePokemonStatus, draftProgression, numUsers, settings, targetPokemon, setTargetPokemon }) => { // Adding {} around this destructures the props. Otherwise everything will just be in one props obejct

    return (
        <>
            {pokemonList && pokemonList.length > 0 ? (
                pokemonList.map(pokemon => {
                    // Check if the pokemon is already picked/banned
                    const isUnavailable = team1Bans.includes(pokemon) || team2Bans.includes(pokemon) || team1Picks.includes(pokemon) || team2Picks.includes(pokemon);
                    return (
                        <div className={`draftCharacter ${pokemon.pokemon_class} ${isUnavailable ? 'unavailable' : 'available'} ${targetPokemon === pokemon ? 'targeted' : ''}`} key={pokemon.pokemon_id} onClick={() => {if(!isUnavailable){setTargetPokemon(pokemon)}}}>
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