import React from 'react';
import { fetchCharacterIdAndName } from '../backendCalls/http.js';
const constants = require('../../../../common/naming_constants.js');
const routes = require('../../../../common/route_constants.js');

const DraftListing = ({ pokemonList, updatePokemonStatus }) => { // Adding {} around this destructures the props. Otherwise everything will just be in one props obejct
    const setBan1 = (pokemonId) => {
        updatePokemonStatus(pokemonId, "ban1");
    }
    const setBan2 = (pokemonId) => {
        updatePokemonStatus(pokemonId, "ban2");
    }
    const setTeam1 = (pokemonId) => {
        updatePokemonStatus(pokemonId, "team1");
    }
    const setTeam2 = (pokemonId) => {
        updatePokemonStatus(pokemonId, "team2");
    }

    return (
        <div>
            {pokemonList && pokemonList.length > 0 ? (
                pokemonList.map(pokemon => (
                <div className="draftCharacter" key={pokemon.pokemon_id}>
                    <img className="characterPortrait" src={""} alt={pokemon.pokemon_name} />
                    <h4>{pokemon.pokemon_name}</h4>
                </div>
                ))
            ) : (
                <p>No Pokémon available</p>
            )}
        </div>
    );
};

export default DraftListing;