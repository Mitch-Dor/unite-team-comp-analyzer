const { constants, NAME_CONSTANTS, MOVE_CONSTANTS } = require('../../frontend/src/common/naming_constants.js');
const pokemonData = require('./databaseData/pokemonData');
const compsData = require('./databaseData/compsData');

let pokemonNameToIdMap = {};

// A function that populates the database with logged data
function populate_db(db) {
    return new Promise(async (resolve, reject) => {
        try {
            await populateCharacters(db);
            await populateAttributes(db);
            await populateMoves(db);
            await populateComps(db);
            resolve();
        } catch (error) {
            reject(error);
        }
    });

    /*
    Table of characters
        pokemon_id integer primary key AUTOINCREMENT not null,
        pokemon_name text not null,
        pokemon_class text not null
    */
    function populateCharacters(db) {
        return new Promise((resolve, reject) => {
            const values = pokemonData.map(pokemon => {
                // Convert pokemon name to match your constants format
                const pokemonName = pokemon.name;
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
                    reject(err);
                } else {
                    console.log("Successfully inserted characters.");
                    resolve();
                }
            });
        });
    }

    // Helper function to map Classifications to class constants
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

    /*
    Class of attributes for Pokemon. Used by AI to determine the best comps
        pokemon_id integer primary key not null,
        early_game text not null,
        mid_game text not null,
        late_game text not null,
        mobility text not null,
        range text not null,
        bulk text not null,
        damage text not null,
        damage_type text not null,
        damage_affect text not null,
        cc text not null,
        play_style text not null,
        classification text not null,
        class text not null,
        other_attr text not null,
        can_exp_share text not null,
        can_top_lane_carry text not null,
        can_jungle_carry text not null,
        can_bottom_lane_carry text not null,
        best_lane text not null,
        assumed_move_1 text not null,
        assumed_move_2 text not null,
        FOREIGN KEY (pokemon_id) REFERENCES playable_characters (pokemon_id)
    */
    async function populateAttributes(db) {
        try {
            const values = await Promise.all(pokemonData.map(async (pokemon) => {
                const pokemon_id = await getPokemonIdByName(db, pokemon.name);
                // Populate the pokemonNameToIdMap while we're doing this
                pokemonNameToIdMap[pokemon.name] = pokemon_id;

                if (pokemon_id === null) {
                    throw new Error(`Pokemon ID not found for ${pokemon.name}`);
                }

                return `('${pokemon_id}', '${pokemon.early_game}', '${pokemon.mid_game}', '${pokemon.late_game}', '${pokemon.mobility}', '${pokemon.range}', '${pokemon.bulk}', '${pokemon.damage}', '${pokemon.damage_type}', '${pokemon.damage_affect}', '${pokemon.cc}', '${pokemon.play_style}', '${pokemon.classification}', '${pokemon.other_attr}', '${pokemon.can_exp_share}', '${pokemon.can_top_lane_carry}', '${pokemon.can_jungle_carry}', '${pokemon.can_bottom_lane_carry}', '${pokemon.best_lane}', '${pokemon.assumed_move_1}', '${pokemon.assumed_move_2}')`;
            }));

            await new Promise((resolve, reject) => {
                db.exec(`
                INSERT INTO pokemon_attributes (pokemon_id, early_game, mid_game, late_game, mobility, range, bulk, damage, damage_type, damage_affect, cc, play_style, classification, other_attr, can_exp_share, can_top_lane_carry, can_jungle_carry, can_bottom_lane_carry, best_lane, assumed_move_1, assumed_move_2)
                VALUES
                    ${values.join(',\n            ')}
                `, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log("Successfully inserted attributes.");
                        resolve();
                    }
                });
            });
        } catch (error) {
            console.log("Error inserting into pokemon_attributes: " + error.message);
            process.exit(1);
        }
    }

    // Function to get the Pokemon ID by name
    function getPokemonIdByName(db, pokemonName) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT pokemon_id FROM playable_characters WHERE pokemon_name = ?`, [pokemonName], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row ? row.pokemon_id : null);
                }
            });
        });
    }

    /*
    Table of moves for Pokemon
        move_id integer primary key AUTOINCREMENT not null,
        move_name text not null,
        pokemon_id int not null,
        FOREIGN KEY (pokemon_id) REFERENCES playable_characters (pokemon_id)
    */
    async function populateMoves(db) {
        try {
            // Helper function to know how many moves to create for a given pokemon
            function getNumMoves(pokemon) {
                switch (pokemon) {
                    case NAME_CONSTANTS.BLAZIKEN_NAME: return 1;
                    case NAME_CONSTANTS.MEW_NAME: return 1;
                    case NAME_CONSTANTS.URSHIFUSS_NAME: return 2;
                    case NAME_CONSTANTS.URSHIFURS_NAME: return 2;
                    case NAME_CONSTANTS.SCIZOR_NAME: return 3;
                    case NAME_CONSTANTS.SCYTHER_NAME: return 3;
                    default: return 4;
                }
            }

            // Collect all move values
            const moveValues = [];
            let index = 0;
            
            // Process each pokemon
            for (const pokemon of pokemonData) {
                const pokemon_id = pokemonNameToIdMap[pokemon.name];
                
                if (pokemon_id === null) {
                    throw new Error(`Pokemon ID not found for ${pokemon.name}`);
                }
                
                const numMoves = getNumMoves(pokemon.name);
                
                // Add each move for this pokemon
                for (let i = 0; i < numMoves; i++) {
                    if (index < Object.values(MOVE_CONSTANTS).length) {
                        const move = Object.values(MOVE_CONSTANTS)[index];
                        moveValues.push(`('${move}', ${pokemon_id})`);
                        index++;
                    }
                }
            }
            
            // If we have moves to insert
            if (moveValues.length > 0) {
                await new Promise((resolve, reject) => {
                    db.exec(`
                    INSERT INTO pokemon_moves (move_name, pokemon_id)
                    VALUES
                        ${moveValues.join(',\n                    ')}
                    `, (err) => {
                        if (err) {
                            console.log("Error inserting into pokemon_moves: " + err.message);
                            reject(err);
                        } else {
                            console.log(`Successfully inserted ${moveValues.length} moves.`);
                            resolve();
                        }
                    });
                });
            } else {
                console.log("No moves to insert.");
            }
        } catch (error) {
            console.log("Error inserting into pokemon_moves: " + error.message);
            throw error; // Rethrow so it can be caught by the promise chain
        }
    }

    /*
    Table of comps played in professional matches
        comp_id integer primary key AUTOINCREMENT not null,
            pokemon_1 int not null,
            pokemon_2 int not null,
            pokemon_3 int not null,
            pokemon_4 int not null,
            pokemon_5 int not null,
            pokemon_1_move_1 int not null,
            pokemon_1_move_2 int not null,
            pokemon_2_move_1 int not null,
            pokemon_2_move_2 int not null,
            pokemon_3_move_1 int not null,
            pokemon_3_move_2 int not null,
            pokemon_4_move_1 int not null,
            pokemon_4_move_2 int not null,
            pokemon_5_move_1 int not null,
            pokemon_5_move_2 int not null,
            -- 1 if this team picked first, 0 if this team picked second
            first_pick int not null,
            FOREIGN KEY (pokemon_1) REFERENCES playable_characters(pokemon_id),
            FOREIGN KEY (pokemon_2) REFERENCES playable_characters(pokemon_id),
            FOREIGN KEY (pokemon_3) REFERENCES playable_characters(pokemon_id),
            FOREIGN KEY (pokemon_4) REFERENCES playable_characters(pokemon_id),
            FOREIGN KEY (pokemon_5) REFERENCES playable_characters(pokemon_id),
            FOREIGN KEY (pokemon_1_move_1) REFERENCES pokemon_moves(move_id),
            FOREIGN KEY (pokemon_1_move_2) REFERENCES pokemon_moves(move_id),
            FOREIGN KEY (pokemon_2_move_1) REFERENCES pokemon_moves(move_id),
            FOREIGN KEY (pokemon_2_move_2) REFERENCES pokemon_moves(move_id),
            FOREIGN KEY (pokemon_3_move_1) REFERENCES pokemon_moves(move_id),
            FOREIGN KEY (pokemon_3_move_2) REFERENCES pokemon_moves(move_id),
            FOREIGN KEY (pokemon_4_move_1) REFERENCES pokemon_moves(move_id),
            FOREIGN KEY (pokemon_4_move_2) REFERENCES pokemon_moves(move_id),
            FOREIGN KEY (pokemon_5_move_1) REFERENCES pokemon_moves(move_id),
            FOREIGN KEY (pokemon_5_move_2) REFERENCES pokemon_moves(move_id)
    */
    async function populateComps(db) {

        // Function to get the Move ID by name and pokemon ID
        function getMoveIdByName(db, moveName, pokemonId) {
            return new Promise((resolve, reject) => {
                // Check for special cases first
                if (!moveName || pokemonId === null) {
                    return resolve(null); // Or handle as appropriate for your app
                }

                if (moveName === "MEW_ALL_MOVES") {
                    moveName = "'Mew_All_Moves'";
                } else if (moveName === "BLAZIKEN_ALL_MOVES") {
                    moveName = "'Blaziken_All_Moves'";
                }

                // Pull move name out from between '' (including the quotes)
                const match = moveName.match(/'(.*)'/);
                if (!match) {
                    console.log(`Could not extract move name from: ${moveName}`);
                    return resolve(null); // Or handle differently
                }
                
                const refinedMoveName = match[1];
                db.get(`SELECT move_id FROM pokemon_moves WHERE move_name = ? AND pokemon_id = ?`, 
                    [refinedMoveName, pokemonId], 
                    (err, row) => {
                        if (err) {
                            console.log(`Error getting move ID: ${err.message}`);
                        }
                        resolve(row ? row.move_id : null);
                    }
                );
            });
        }

        try {
            let compValues = [];
            for (const comp of compsData) {
                // Comp 1
                const pokemon1_id = pokemonNameToIdMap[comp.t1poke1];
                const pokemon2_id = pokemonNameToIdMap[comp.t1poke2];
                const pokemon3_id = pokemonNameToIdMap[comp.t1poke3];
                const pokemon4_id = pokemonNameToIdMap[comp.t1poke4];
                const pokemon5_id = pokemonNameToIdMap[comp.t1poke5];

                const p1m1_id = await getMoveIdByName(db, comp.t1poke1move1, pokemon1_id);
                const p1m2_id = await getMoveIdByName(db, comp.t1poke1move2, pokemon1_id);
                const p2m1_id = await getMoveIdByName(db, comp.t1poke2move1, pokemon2_id);
                const p2m2_id = await getMoveIdByName(db, comp.t1poke2move2, pokemon2_id);
                const p3m1_id = await getMoveIdByName(db, comp.t1poke3move1, pokemon3_id);
                const p3m2_id = await getMoveIdByName(db, comp.t1poke3move2, pokemon3_id);
                const p4m1_id = await getMoveIdByName(db, comp.t1poke4move1, pokemon4_id);
                const p4m2_id = await getMoveIdByName(db, comp.t1poke4move2, pokemon4_id);
                const p5m1_id = await getMoveIdByName(db, comp.t1poke5move1, pokemon5_id);
                const p5m2_id = await getMoveIdByName(db, comp.t1poke5move2, pokemon5_id);

                const isFirstPick = comp.firstPick === "Team1";
                let firstPickNumber = 0;
                if (isFirstPick) {
                    firstPickNumber = 1;
                }

                if (pokemon1_id === null || pokemon2_id === null || pokemon3_id === null || pokemon4_id === null || pokemon5_id === null) {
                    throw new Error(`Pokemon ID not found for ${pokemon.name}`);
                }
            
                if (p1m1_id === null || p1m2_id === null || p2m1_id === null || p2m2_id === null || p3m1_id === null || p3m2_id === null || p4m1_id === null || p4m2_id === null || p5m1_id === null || p5m2_id === null) {
                    throw new Error(`Move ID not found for ${comp.t1poke1move1}`);
                }

                compValues.push(`('${pokemon1_id}', '${pokemon2_id}', '${pokemon3_id}', '${pokemon4_id}', '${pokemon5_id}', '${p1m1_id}', '${p1m2_id}', '${p2m1_id}', '${p2m2_id}', '${p3m1_id}', '${p3m2_id}', '${p4m1_id}', '${p4m2_id}', '${p5m1_id}', '${p5m2_id}', '${firstPickNumber}')`);

                // Comp 2
                const pokemon6_id = pokemonNameToIdMap[comp.t2poke1];
                const pokemon7_id = pokemonNameToIdMap[comp.t2poke2];
                const pokemon8_id = pokemonNameToIdMap[comp.t2poke3];
                const pokemon9_id = pokemonNameToIdMap[comp.t2poke4];
                const pokemon10_id = pokemonNameToIdMap[comp.t2poke5];

                const p6m1_id = await getMoveIdByName(db, comp.t2poke1move1, pokemon6_id);
                const p6m2_id = await getMoveIdByName(db, comp.t2poke1move2, pokemon6_id);
                const p7m1_id = await getMoveIdByName(db, comp.t2poke2move1, pokemon7_id);
                const p7m2_id = await getMoveIdByName(db, comp.t2poke2move2, pokemon7_id);
                const p8m1_id = await getMoveIdByName(db, comp.t2poke3move1, pokemon8_id);
                const p8m2_id = await getMoveIdByName(db, comp.t2poke3move2, pokemon8_id);
                const p9m1_id = await getMoveIdByName(db, comp.t2poke4move1, pokemon9_id);
                const p9m2_id = await getMoveIdByName(db, comp.t2poke4move2, pokemon9_id);
                const p10m1_id = await getMoveIdByName(db, comp.t2poke5move1, pokemon10_id);
                const p10m2_id = await getMoveIdByName(db, comp.t2poke5move2, pokemon10_id);

                if (pokemon6_id === null || pokemon7_id === null || pokemon8_id === null || pokemon9_id === null || pokemon10_id === null) {
                    throw new Error(`Pokemon ID not found for ${pokemon.name}`);
                }
            
                if (p6m1_id === null || p6m2_id === null || p7m1_id === null || p7m2_id === null || p8m1_id === null || p8m2_id === null || p9m1_id === null || p9m2_id === null || p10m1_id === null || p10m2_id === null) {
                    throw new Error(`Move ID not found for ${comp.t2poke1move1}`);
                }

                let secondPickNumber = 0;
                if (firstPickNumber === 0) {
                    secondPickNumber = 1;
                } else {
                    secondPickNumber = 0;
                }

                compValues.push(`('${pokemon6_id}', '${pokemon7_id}', '${pokemon8_id}', '${pokemon9_id}', '${pokemon10_id}', '${p6m1_id}', '${p6m2_id}', '${p7m1_id}', '${p7m2_id}', '${p8m1_id}', '${p8m2_id}', '${p9m1_id}', '${p9m2_id}', '${p10m1_id}', '${p10m2_id}', '${secondPickNumber}')`);
            }

            console.log(compValues);

            await new Promise((resolve, reject) => {
                db.exec(`
                INSERT INTO professional_comps (pokemon_1, pokemon_2, pokemon_3, pokemon_4, pokemon_5, pokemon_1_move_1, pokemon_1_move_2, pokemon_2_move_1, pokemon_2_move_2, pokemon_3_move_1, pokemon_3_move_2, pokemon_4_move_1, pokemon_4_move_2, pokemon_5_move_1, pokemon_5_move_2, first_pick)
                VALUES
                    ${compValues.join(',\n            ')}
                `, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log("Successfully inserted comps.");
                        resolve();
                    }
                });
            });
        } catch (error) {
            console.log("Error inserting into professional_comps: " + error.message);
            process.exit(1);
        }
    }

    /*
    Table of professional players
        player_id integer primary key AUTOINCREMENT not null,
        player_name text not null
    */
   function populatePlayers(db) {

   }

    /*
    Table of professional matches
        match_id integer primary key AUTOINCREMENT not null,
            set_id int not null,
            team_1_comp_id int not null,
            team_2_comp_id int not null,
            team_1_ban_1 int not null,
            team_2_ban_1 int not null,
            team_1_ban_2 int not null,
            team_2_ban_2 int not null,
            team_1_player_1 int not null,
            team_1_player_2 int not null,
            team_1_player_3 int not null,
            team_1_player_4 int not null,
            team_1_player_5 int not null,
            team_2_player_1 int not null,
            team_2_player_2 int not null,
            team_2_player_3 int not null,
            team_2_player_4 int not null,
            team_2_player_5 int not null,
            team_1_id int not null,
            team_2_id int not null,
            winning_team_id int not null, 
            FOREIGN KEY (set_id) REFERENCES professional_sets (set_id),
            FOREIGN KEY (team_1_comp_id) REFERENCES professional_comps (comp_id),
            FOREIGN KEY (team_2_comp_id) REFERENCES professional_comps (comp_id),
            FOREIGN KEY (team_1_player_1) REFERENCES professional_players (player_id),
            FOREIGN KEY (team_1_player_2) REFERENCES professional_players (player_id),
            FOREIGN KEY (team_1_player_3) REFERENCES professional_players (player_id),
            FOREIGN KEY (team_1_player_4) REFERENCES professional_players (player_id),
            FOREIGN KEY (team_1_player_5) REFERENCES professional_players (player_id),
            FOREIGN KEY (team_2_player_1) REFERENCES professional_players (player_id),
            FOREIGN KEY (team_2_player_2) REFERENCES professional_players (player_id),
            FOREIGN KEY (team_2_player_3) REFERENCES professional_players (player_id),
            FOREIGN KEY (team_2_player_4) REFERENCES professional_players (player_id),
            FOREIGN KEY (team_2_player_5) REFERENCES professional_players (player_id)
    */
   function populateMatches(db) {

   }

   /*
   Table of professional teams
        team_id integer primary key AUTOINCREMENT not null,
        team_name text not null,
        team_region text not null
   */
   function populateTeams(db) {

   }

   /*
   Table of professional sets of matches
        set_id integer primary key AUTOINCREMENT not null,
        event_id int not null,
        FOREIGN KEY (event_id) REFERENCES events (event_id)
   */
   function populateSets(db) {

   }

   /*
   Table of events
        event_id integer primary key AUTOINCREMENT not null,
        event_name text not null,
        event_date text not null,
        vod_url text not null
   */
   function populateEvents(db) {

   }
}

// Export the populate_db function
module.exports = populate_db;
