// Function to get a dictionary of Pokemon to all their moves from the data from the charactersAndMoves route
export function getCharactersMovesDictionary(charactersAndMoves) {
    // Create a dictionary mapping pokemon_name to an array of their moves
    const pokemonToMoves = charactersAndMoves.reduce((acc, char) => {
        if (!acc[char.pokemon_name]) {
            acc[char.pokemon_name] = [];
        }
        acc[char.pokemon_name].push({ move_name: char.move_name, move_id: char.move_id, move_position: char.move_position });
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

// Function for maintaining Pokemon that have to choose which Pokemon they become
export function getInversePokemon(pokemon, pokemonList) {
    let otherPokemon = null;
    if (pokemon.pokemon_name === 'Scyther'){
        otherPokemon = pokemonList.find(pokemon => pokemon.pokemon_name === 'Scizor');
    } else if (pokemon.pokemon_name === 'Scizor'){
        otherPokemon = pokemonList.find(pokemon => pokemon.pokemon_name === 'Scyther');
    } else if (pokemon.pokemon_name === 'Urshifu_SS'){
        otherPokemon = pokemonList.find(pokemon => pokemon.pokemon_name === 'Urshifu_RS');
    } else if (pokemon.pokemon_name === 'Urshifu_RS'){
        otherPokemon = pokemonList.find(pokemon => pokemon.pokemon_name === 'Urshifu_SS');
    }
    return otherPokemon
}

export function getMove1ForPokemon(pokemon, charactersAndMoves) {
    const first_move_options = charactersAndMoves
        .filter(item =>
            item.pokemon_name === pokemon.pokemon_name && item.move_position === 1
        )
        .map(item => ({
            move_name: item.move_name,
            move_id: item.move_id
        }));
    return first_move_options;
}

export function getMove2ForPokemon(pokemon, charactersAndMoves) {
    const second_move_options = charactersAndMoves
        .filter(item =>
            item.pokemon_name === pokemon.pokemon_name && item.move_position === 2
        )
        .map(item => ({
            move_name: item.move_name,
            move_id: item.move_id
        }));
    return second_move_options;
}

export function pokemonToMovesetsDictionary(charactersAndMoves) {
    const uniquePokemon = getUniquePokemon(charactersAndMoves);
    const movesetsDict = {};

    uniquePokemon.forEach(pokemon => {
        const move1Options = getMove1ForPokemon(pokemon, charactersAndMoves);
        const move2Options = getMove2ForPokemon(pokemon, charactersAndMoves);

        // Make all permutations (move1 first, then move2)
        const combos = [];
        move1Options.forEach(m1 => {
            move2Options.forEach(m2 => {
                combos.push([m1, m2]);
            });
        });

        movesetsDict[pokemon.pokemon_name] = combos;
    });

    return movesetsDict;
}
