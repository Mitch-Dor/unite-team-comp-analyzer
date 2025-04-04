// File used to initialize the database.

//https://www.linode.com/docs/guides/getting-started-with-nodejs-sqlite/

// NOTE: CREATES DATABASE WHERE FILE IS RUN FROM

const constants = require('../../common/naming_constants.js');
const pokemonData = require('./databaseData/pokemonData');

var sqlite3 = require('sqlite3');
var db;

createDB();

function createDB() {
    // Connect to or create the database
    db = new sqlite3.Database('unite_information.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err && err.code == "SQLITE_CANTOPEN") {
            createDatabase();
            return;
            } else if (err) {
                console.log("Getting error " + err);
                process.exit(1);
        }
        clearDatabase(db, () => {
            createTables(db);
        });
    });

    // Function to create the database file itself if it doesn't exist
    function createDatabase() {
        var newdb = new sqlite3.Database('unite_information.db', (err) => {
            if (err) {
                console.log("Getting error " + err);
                process.exit(1);
            }
            createTables(newdb);
        });
    }

    // Function to create the tables themselves
    function createTables(newdb) {
        newdb.exec(`
        create table playable_characters (
            pokemon_name text primary key not null,
            pokemon_class text not null
        );
        create table pokemon_attributes (
            pokemon_name text not null,
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
            FOREIGN KEY (pokemon_name) REFERENCES playable_characters (pokemon_name)
        );
        create table comps (
            comp_id integer primary key AUTOINCREMENT not null,
            pokemon_1 int not null,
            pokemon_2 int not null,
            pokemon_3 int not null,
            pokemon_4 int not null,
            pokemon_5 int not null,
            FOREIGN KEY (pokemon_1) REFERENCES playable_characters(pokemon_name),
            FOREIGN KEY (pokemon_2) REFERENCES playable_characters(pokemon_name),
            FOREIGN KEY (pokemon_3) REFERENCES playable_characters(pokemon_name),
            FOREIGN KEY (pokemon_4) REFERENCES playable_characters(pokemon_name),
            FOREIGN KEY (pokemon_5) REFERENCES playable_characters(pokemon_name)
        );
        `, (err) => {
            if (err) {
                console.log("Error creating tables: " + err.message);
                process.exit(1);
            } else {
                console.log("Successfully created tables.");
                populateCharacters(newdb);
                populateAttributes(newdb);
                runQueries(newdb);
            }
        });
    }

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

    // Testing to make sure the database populated correctly
    function runQueries(db) {
        db.all(`
        select * from playable_characters natural join pokemon_attributes`, (err, rows) => {
            if (err) {
                console.log("Getting error " + err);
                return;
            }
            rows.forEach(row => {
                console.log(row.pokemon_name, row.pokemon_class);
            });
        });
    }

    // Drops all existing tables to clear the database
    function clearDatabase(db, callback) {
        db.exec(`
        DROP TABLE IF EXISTS pokemon_attributes;
        DROP TABLE IF EXISTS playable_characters;
        DROP TABLE IF EXISTS comps;
        `, (err) => {
            if (err) {
                console.log("Getting error " + err);
                return;
            }
            callback();
        });
    }
}