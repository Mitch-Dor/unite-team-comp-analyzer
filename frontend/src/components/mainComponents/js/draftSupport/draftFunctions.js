
// This file serves as a utility module for draft-related functions.
// Other files can import these functions to use them in their own logic.

// Function to check if a given Pokemon is a special case for the purposes of if it is still available (true = unavailable | false = available)
function checkIfSpecialCase(pokemon, purpleTeamDraft, orangeTeamDraft) {
    if (pokemon.pokemon_name === 'Scyther' && (purpleTeamDraft.bans.some(ban => ban.pokemon.pokemon_name === 'Scizor') || orangeTeamDraft.bans.some(ban => ban.pokemon.pokemon_name === 'Scizor') || purpleTeamDraft.picks.some(pick => pick.pokemon.pokemon_name === 'Scizor') || orangeTeamDraft.picks.some(pick => pick.pokemon.pokemon_name === 'Scizor'))) {
        return true;
    } else if (pokemon.pokemon_name === 'Scizor' && (purpleTeamDraft.bans.some(ban => ban.pokemon.pokemon_name === 'Scyther') || orangeTeamDraft.bans.some(ban => ban.pokemon.pokemon_name === 'Scyther') || purpleTeamDraft.picks.some(pick => pick.pokemon.pokemon_name === 'Scyther') || orangeTeamDraft.picks.some(pick => pick.pokemon.pokemon_name === 'Scyther'))) {
        return true;
    } else if (pokemon.pokemon_name === 'Urshifu_SS' && (purpleTeamDraft.bans.some(ban => ban.pokemon.pokemon_name === 'Urshifu_RS') || orangeTeamDraft.bans.some(ban => ban.pokemon.pokemon_name === 'Urshifu_RS') || purpleTeamDraft.picks.some(pick => pick.pokemon.pokemon_name === 'Urshifu_RS') || orangeTeamDraft.picks.some(pick => pick.pokemon.pokemon_name === 'Urshifu_RS'))) {
        return true;
    } else if (pokemon.pokemon_name === 'Urshifu_RS' && (purpleTeamDraft.bans.some(ban => ban.pokemon.pokemon_name === 'Urshifu_SS') || orangeTeamDraft.bans.some(ban => ban.pokemon.pokemon_name === 'Urshifu_SS') || purpleTeamDraft.picks.some(pick => pick.pokemon.pokemon_name === 'Urshifu_SS') || orangeTeamDraft.picks.some(pick => pick.pokemon.pokemon_name === 'Urshifu_SS') )) {
        return true;
    }
    return false;
}

// Function to generate a random Pokemon that is not banned or picked
function genRandomPokemon(pokemonList, purpleTeamDraft, orangeTeamDraft, disallowedCharacters) {
    if (pokemonList.length === 0) {
        console.error("Cannot generate random Pokemon: pokemonList is empty");
        return null;
    }
    
    const isTaken = (p) =>
        purpleTeamDraft.bans.some(item => item.pokemon === p) ||
        purpleTeamDraft.picks.some(item => item.pokemon === p) ||
        orangeTeamDraft.bans.some(item => item.pokemon === p) ||
        orangeTeamDraft.picks.some(item => item.pokemon === p);

    const randIndex = Math.floor(Math.random() * pokemonList.length);
    const pokemon = pokemonList[randIndex];
    if (!isTaken(pokemon) && 
        !disallowedCharacters.includes(pokemon.pokemon_name) &&
        !checkIfSpecialCase(pokemon, purpleTeamDraft, orangeTeamDraft)) {
        return pokemon;
    } 
    
    let availableOptions = pokemonList.filter(p => 
        !isTaken(p) &&
        !disallowedCharacters.includes(p.pokemon_name) &&
        !checkIfSpecialCase(p, purpleTeamDraft, orangeTeamDraft)
    );
    
    if (availableOptions.length === 0) {
        console.error("No available Pokemon to select");
        return null;
    }
    
    return genRandomPokemon(pokemonList, purpleTeamDraft, orangeTeamDraft, disallowedCharacters);
}

// Export the functions for use in other modules
export { checkIfSpecialCase, genRandomPokemon };

