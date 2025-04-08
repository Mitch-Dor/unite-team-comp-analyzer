const constants = require('../../common/naming_constants.js');
const pokemonData = require('./databaseData/pokemonData');

// A function that populates the database with logged data
function populate_db(db) {
    return new Promise(async (resolve, reject) => {
        try {
            await populateCharacters(db);
            await populateAttributes(db);
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
    function populateMoves(db) {
        
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
    function populateComps(db) {

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
