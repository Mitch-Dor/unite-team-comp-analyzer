// Function to get a dictionary of Pokemon to all their moves from the data from the charactersAndMoves route
export function getCharactersMovesDictionary(charactersAndMoves) {
    // Create a dictionary mapping pokemon_name to an array of their moves
    const pokemonToMoves = charactersAndMoves.reduce((acc, char) => {
        if (!acc[char.pokemon_name]) {
            acc[char.pokemon_name] = [];
        }
        acc[char.pokemon_name].push({ move_name: char.move_name, move_id: char.move_id });
        return acc;
    }, {});

    // Sort the moves in each array by move_id
    Object.keys(pokemonToMoves).forEach(pokemon => {
        pokemonToMoves[pokemon].sort((a, b) => a.move_id - b.move_id);
    });

    return pokemonToMoves;
}

// Function to shrink charactersAndMoves route data down to just individual Pokemon.
export function getUniquePokemon(charactersAndMoves) {
    return [...new Set(charactersAndMoves.map(char => JSON.stringify({pokemon_name: char.pokemon_name, pokemon_id: char.pokemon_id})))].map(str => JSON.parse(str));
}