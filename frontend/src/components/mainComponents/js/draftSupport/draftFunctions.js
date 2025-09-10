
// This file serves as a utility module for draft-related functions.
// Other files can import these functions to use them in their own logic.

// Function to check if a given Pokemon is a special case
function checkIfSpecialCase(pokemon, team1Bans, team2Bans, team1Picks, team2Picks) {
    if (pokemon.pokemon_name === 'Scyther' && (team1Bans.some(ban => ban.pokemon_name === 'Scizor') || team2Bans.some(ban => ban.pokemon_name === 'Scizor') || team1Picks.some(pick => pick.pokemon_name === 'Scizor') || team2Picks.some(pick => pick.pokemon_name === 'Scizor'))) {
        return true;
    } else if (pokemon.pokemon_name === 'Scizor' && (team1Bans.some(ban => ban.pokemon_name === 'Scyther') || team2Bans.some(ban => ban.pokemon_name === 'Scyther') || team1Picks.some(pick => pick.pokemon_name === 'Scyther') || team2Picks.some(pick => pick.pokemon_name === 'Scyther'))) {
        return true;
    } else if (pokemon.pokemon_name === 'Urshifu_SS' && (team1Bans.some(ban => ban.pokemon_name === 'Urshifu_RS') || team2Bans.some(ban => ban.pokemon_name === 'Urshifu_RS') || team1Picks.some(pick => pick.pokemon_name === 'Urshifu_RS') || team2Picks.some(pick => pick.pokemon_name === 'Urshifu_RS'))) {
        return true;
    } else if (pokemon.pokemon_name === 'Urshifu_RS' && (team1Bans.some(ban => ban.pokemon_name === 'Urshifu_SS') || team2Bans.some(ban => ban.pokemon_name === 'Urshifu_SS') || team1Picks.some(pick => pick.pokemon_name === 'Urshifu_SS') || team2Picks.some(pick => pick.pokemon_name === 'Urshifu_SS') )) {
        return true;
    }
    return false;
}

// Function to generate a random Pokemon that is not banned or picked
function genRandomPokemon(pokemonList, team1Bans, team2Bans, team1Picks, team2Picks, disallowedCharacters) {
    if (pokemonList.length === 0) {
        console.error("Cannot generate random Pokemon: pokemonList is empty");
        return null;
    }
    
    const randIndex = Math.floor(Math.random() * pokemonList.length);
    const pokemon = pokemonList[randIndex];
    if (!team1Bans.includes(pokemon) && 
        !team2Bans.includes(pokemon) && 
        !team1Picks.includes(pokemon) && 
        !team2Picks.includes(pokemon) && 
        !disallowedCharacters.includes(pokemon.pokemon_name) &&
        !checkIfSpecialCase(pokemon, team1Bans, team2Bans, team1Picks, team2Picks)) {
        return pokemon;
    } 
    
    // Safety check to prevent infinite recursion
    let availableOptions = pokemonList.filter(p => 
        !team1Bans.includes(p) && 
        !team2Bans.includes(p) && 
        !team1Picks.includes(p) && 
        !team2Picks.includes(p) && 
        !disallowedCharacters.includes(p.pokemon_name) &&
        !checkIfSpecialCase(p, team1Bans, team2Bans, team1Picks, team2Picks)
    );
    
    if (availableOptions.length === 0) {
        console.error("No available Pokemon to select");
        return null;
    }
    
    return genRandomPokemon(pokemonList, team1Bans, team2Bans, team1Picks, team2Picks, disallowedCharacters);
}

// Export the functions for use in other modules
export { checkIfSpecialCase, genRandomPokemon };

