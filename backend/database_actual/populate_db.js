// Import necessary modules or dependencies
// const someModule = require('some-module');

// Define the populate_db function
function populate_db() {
    function populateCharacters(db) {
        const values = pokemonData.map(pokemon => {
            // Convert pokemon name to match your constants format
            const pokemonName = pokemon.name.toUpperCase().replace('-', '_');
            // Map the Classification to your class constants
            const pokemonClass = mapClassToProperClass(pokemon.class);
            return `('${pokemonName}', '${pokemonClass}')`;
        }).join(',\n            ');
    
        db.exec(`
        insert into playable_characters (pokemon_name, pokemon_class) 
        values 
            ${values}
        `, (err) => {
            if (err) {
                console.log("Error inserting into playable_characters: " + err.message);
                process.exit(1);
            } else {
                console.log("Successfully inserted characters.");
            }
        });
    }

    // Helper function to map Classifications to your class constants
    function mapClassToProperClass(givenClass) {
        const classMap = {
            'Attacker': constants.ATTACKER,
            'Defender': constants.DEFENDER,
            'Speedster': constants.SPEEDSTER,
            'Supporter': constants.SUPPORTER,
            'AllRounder': constants.ALL_ROUNDER,
        };
        return classMap[givenClass];
    }

    function populateAttributes(db) {
        const values = pokemonData.map(pokemon => {
            const pokemonName = pokemon.name.toUpperCase().replace('-', '_');

            return `('${pokemonName}', '${pokemon.early_game}', '${pokemon.mid_game}', '${pokemon.late_game}', '${pokemon.mobility}', '${pokemon.range}', '${pokemon.bulk}', '${pokemon.damage}', '${pokemon.damage_type}', '${pokemon.damage_affect}', '${pokemon.cc}', '${pokemon.play_style}', '${pokemon.classification}', '${pokemon.other_attr}', '${pokemon.can_exp_share}', '${pokemon.can_top_lane_carry}', '${pokemon.can_jungle_carry}', '${pokemon.can_bottom_lane_carry}', '${pokemon.best_lane}', '${pokemon.assumed_move_1}', '${pokemon.assumed_move_2}')`;
        }).join(',\n            ');

        db.exec(`
        insert into pokemon_attributes (pokemon_name, early_game, mid_game, late_game, mobility, range, bulk, damage, damage_type, damage_affect, cc, play_style, classification, other_attr, can_exp_share, can_top_lane_carry, can_jungle_carry, can_bottom_lane_carry, best_lane, assumed_move_1, assumed_move_2)
        values
            ${values}
        `, (err) => {   
            if (err) {
                console.log("Error inserting into pokemon_attributes: " + err.message);
                process.exit(1);
            } else {
                console.log("Successfully inserted attributes.");
            }       
        });
    }
}

// Export the populate_db function
module.exports = populate_db;
