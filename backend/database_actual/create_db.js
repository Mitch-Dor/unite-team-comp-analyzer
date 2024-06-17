// File used to initialize the database.

//https://www.linode.com/docs/guides/getting-started-with-nodejs-sqlite/

import * as constants from '../../src/common/naming_constants.js';

var sqlite3 = require('sqlite3');
var db;

function createDB() {
    // Connect to or create the database
    db = new sqlite3.Database('./unite_information.db', sqlite3.OPEN_READWRITE, (err) => {
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
            pokemon_id integer primary key AUTOINCREMENT not null,
            pokemon_name text not null,
            pokemon_class text not null
        );
        create table pokemon_attributes (
            pokemon_id int not null,
            attribute text not null,
            FOREIGN KEY (pokemon_id)
                REFERENCES playable_characters (pokemon_id)
        );
        create table comps (
            comp_id integer primary key AUTOINCREMENT not null,
            pokemon_1 int not null,
            pokemon_2 int not null,
            pokemon_3 int not null,
            pokemon_4 int not null,
            pokemon_5 int not null,
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
        db.exec(`
        insert into playable_characters (pokemon_name, pokemon_class) 
        values 
            ('${constants.CINDERACE_NAME}', '${constant.ATTACKER}'), 
            ('${constants.GARCHOMP_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.GENGAR_NAME}', '${constants.SPEEDSTER}'),
            ('${constants.CRAMORANT_NAME}', '${constants.ATTACKER}'),
            ('${constants.ALOLANNINETALES_NAME}', '${constants.ATTACKER}'),
            ('${constants.WIGGLYTUFF_NAME}', '${constants.SUPPORTER}'),
            ('${constants.MACHAMP_NAME}', '${constants.ALL_ROUNDER}'),
            ('${consants.ABSOL_NAME}', '${constants.SPEEDSTER}'),
            ('${consants.SLOWBRO_NAME}', '${constants.DEFENDER}'),
            ('${consants.MRMIME_NAME}', '${constants.SUPPORTER}'),
            ('${consants.VENUSAUR_NAME}', '${constants.ATTACKER}'),
            ('${consants.LUCARIO_NAME}', '${constants.ALL_ROUNDER}'),
            ('${consants.TALONFLAME_NAME}', '${constants.SPEEDSTER}'),
            ('${consants.ELDEGOSS_NAME}', '${constants.SUPPORTER}'),
            ('${consants.GRENINJA_NAME}', '${constants.ATTACKER}'),
            ('${consants.CRUSTLE_NAME}', '${constants.DEFENDER}'),
            ('${consants.SNORLAX_NAME}', '${constants.DEFENDER}'),
            ('${consants.CHARIZARD_NAME}', '${constants.ALL_ROUNDER}'),
            ('${consants.PIKACHU_NAME}', '${constants.ATTACKER}'),
            ('${consants.ZERAORA_NAME}', '${constants.SPEEDSTER}'),
            ('${consants.GARDEVOIR_NAME}', '${constants.ATTACKER}'),
            ('${consants.BLISSEY_NAME}', '${constants.SUPPORTER}'),
            ('${consants.BLASTOISE_NAME}', '${constants.DEFENDER}'),
            ('${consants.MAMOSWINE_NAME}', '${constants.DEFENDER}'),
            ('${consants.SYLVEON_NAME}', '${constants.ATTACKER}'),
            ('${consants.GREEDENT_NAME}', '${constants.DEFENDER}'),
            ('${consants.DECIDUEYE_NAME}', '${constants.ATTACKER}'),
            ('${consants.TSAREENA_NAME}', '${constants.ALL_ROUNDER}'),
            ('${consants.DRAGONITE_NAME}', '${constants.ALL_ROUNDER}'),
            ('${consants.TREVENANT_NAME}', '${constants.DEFENDER}'),
            ('${consants.AEGISLASH_NAME}', '${constants.ALL_ROUNDER}'),
            ('${consants.HOOPA_NAME}', '${constants.SUPPORTER}'),
            ('${consants.DURALUDON_NAME}', '${constants.ATTACKER}'),
            ('${consants.AZUMARILL_NAME}', '${constants.ALL_ROUNDER}'),
            ('${consants.ESPEON_NAME}', '${constants.ATTACKER}'),
            ('${consants.DELPHOX_NAME}', '${constants.ATTACKER}'),
            ('${consants.GLACEON_NAME}', '${constants.ATTACKER}'),
            ('${consants.BUZZWOLE_NAME}', '${constants.ALL_ROUNDER}'),
            ('${consants.TYRANITAR_NAME}', '${constants.ALL_ROUNDER}'),
            ('${consants.MEW_NAME}', '${constants.ATTACKER}'),
            ('${consants.DODRIO_NAME}', '${constants.SPEEDSTER}'),
            ('${consants.SCIZOR_NAME}', '${constants.ALL_ROUNDER}'),
            ('${consants.SCYTHER_NAME}', '${constants.SPEEDSTER}');
            ('${consants.CLEFABLE_NAME}', '${constants.SUPPORTER}'),
            ('${consants.ZOROARK_NAME}', '${constants.SPEEDSTER}'),
            ('${consants.SABLEYE_NAME}', '${constants.SUPPORTER}'),
            ('${consants.URSHIFU-SS_NAME}', '${constants.ALL_ROUNDER}'),
            ('${consants.URSHIFU-RS_NAME}', '${constants.ALL_ROUNDER}'),
            ('${consants.DRAGAPULT_NAME}', '${constants.ATTACKER}'),
            ('${consants.COMFEY_NAME}', '${constants.SUPPORTER}'),
            ('${consants.ZACIAN_NAME}', '${constants.ALL_ROUNDER}'),
            ('${consants.GOODRA_NAME}', '${constants.DEFENDER}'),
            ('${consants.LAPRAS_NAME}', '${constants.ATTACKER}'),
            ('${consants.CHANDELURE_NAME}', '${constants.ATTACKER}'),
            ('${consants.UMBREON_NAME}', '${constants.DEFENDER}'),
            ('${consants.LEAFEON_NAME}', '${constants.SPEEDSTER}'),
            ('${consants.INTELEON_NAME}', '${constants.ATTACKER}'),
            ('${consants.MEWTWOY_NAME}', '${constants.ATTACKER}'),
            ('${consants.MEWTWOX_NAME}', '${constants.ALL_ROUNDER}'),
            ('${consants.BLAZIKEN_NAME}', '${constants.ALL_ROUNDER}'),
            ('${consants.MIMIKYU_NAME}', '${constants.ALL_ROUNDER}'),
            ('${consants.MEOWSCARADA_NAME}', '${constants.SPEEDSTER}'),
            ('${consants.METAGROSS_NAME}', '${constants.ALL_ROUNDER}');
            ('${consants.GYARADOS_NAME}', '${constants.ALL_ROUNDER}'),
            ('${consants.MIRAIDON_NAME}', '${constants.ATTACKER}'),
            ('${consants.FALINKS_NAME}', '${constants.ALL_ROUNDER}');
        `, (err) => {
            if (err) {
                console.log("Error inserting into playable_characters: " + err.message);
                process.exit(1);
            } else {
                console.log("Successfully inserted characters.");
            }
        });
    }

    function populateAttributes(db) {
        db.exec(`
        insert into pokemon_attributes (pokemon_id, attribute)
            values
                (1, 'ADC'),
                (1, 'Mobile'),
                (2, 'Bruiser');
        `, (err) => {
            if (err) {
                console.log("Error inserting into pokemon_attributes: " + err.message);
                process.exit(1);
            } else {
                console.log("Successfully inserted attributess.");
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
                console.log(row.pokemon_id, row.pokemon_name, row.pokemon_class, row.attribute);
            });
        });
    }

    // Drops all existing tables to clear the database
    function clearDatabase(db, callback) {
        db.exec(`
        DROP TABLE IF EXISTS pokemon_attributes;
        DROP TABLE IF EXISTS playable_characters;
        `, (err) => {
            if (err) {
                console.log("Getting error " + err);
                return;
            }
            callback();
        });
    }
}