// File used to initialize the database.

//https://www.linode.com/docs/guides/getting-started-with-nodejs-sqlite/

const constants = require('../../common/naming_constants.js');

var sqlite3 = require('sqlite3');
var db;

createDB();

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
            FOREIGN KEY (pokemon_id) REFERENCES playable_characters (pokemon_id)
        );
        create table comps (
            comp_id integer primary key AUTOINCREMENT not null,
            pokemon_1 int not null,
            pokemon_2 int not null,
            pokemon_3 int not null,
            pokemon_4 int not null,
            pokemon_5 int not null,
            FOREIGN KEY (pokemon_1) REFERENCES playable_characters(pokemon_id),
            FOREIGN KEY (pokemon_2) REFERENCES playable_characters(pokemon_id),
            FOREIGN KEY (pokemon_3) REFERENCES playable_characters(pokemon_id),
            FOREIGN KEY (pokemon_4) REFERENCES playable_characters(pokemon_id),
            FOREIGN KEY (pokemon_5) REFERENCES playable_characters(pokemon_id)
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
            ('${constants.CINDERACE_NAME}', '${constants.ATTACKER}'), 
            ('${constants.GARCHOMP_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.GENGAR_NAME}', '${constants.SPEEDSTER}'),
            ('${constants.CRAMORANT_NAME}', '${constants.ATTACKER}'),
            ('${constants.ALOLANNINETALES_NAME}', '${constants.ATTACKER}'),
            ('${constants.WIGGLYTUFF_NAME}', '${constants.SUPPORTER}'),
            ('${constants.MACHAMP_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.ABSOL_NAME}', '${constants.SPEEDSTER}'),
            ('${constants.SLOWBRO_NAME}', '${constants.DEFENDER}'),
            ('${constants.MRMIME_NAME}', '${constants.SUPPORTER}'),
            ('${constants.VENUSAUR_NAME}', '${constants.ATTACKER}'),
            ('${constants.LUCARIO_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.TALONFLAME_NAME}', '${constants.SPEEDSTER}'),
            ('${constants.ELDEGOSS_NAME}', '${constants.SUPPORTER}'),
            ('${constants.GRENINJA_NAME}', '${constants.ATTACKER}'),
            ('${constants.CRUSTLE_NAME}', '${constants.DEFENDER}'),
            ('${constants.SNORLAX_NAME}', '${constants.DEFENDER}'),
            ('${constants.CHARIZARD_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.PIKACHU_NAME}', '${constants.ATTACKER}'),
            ('${constants.ZERAORA_NAME}', '${constants.SPEEDSTER}'),
            ('${constants.GARDEVOIR_NAME}', '${constants.ATTACKER}'),
            ('${constants.BLISSEY_NAME}', '${constants.SUPPORTER}'),
            ('${constants.BLASTOISE_NAME}', '${constants.DEFENDER}'),
            ('${constants.MAMOSWINE_NAME}', '${constants.DEFENDER}'),
            ('${constants.SYLVEON_NAME}', '${constants.ATTACKER}'),
            ('${constants.GREEDENT_NAME}', '${constants.DEFENDER}'),
            ('${constants.DECIDUEYE_NAME}', '${constants.ATTACKER}'),
            ('${constants.TSAREENA_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.DRAGONITE_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.TREVENANT_NAME}', '${constants.DEFENDER}'),
            ('${constants.AEGISLASH_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.HOOPA_NAME}', '${constants.SUPPORTER}'),
            ('${constants.DURALUDON_NAME}', '${constants.ATTACKER}'),
            ('${constants.AZUMARILL_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.ESPEON_NAME}', '${constants.ATTACKER}'),
            ('${constants.DELPHOX_NAME}', '${constants.ATTACKER}'),
            ('${constants.GLACEON_NAME}', '${constants.ATTACKER}'),
            ('${constants.BUZZWOLE_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.TYRANITAR_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.MEW_NAME}', '${constants.ATTACKER}'),
            ('${constants.DODRIO_NAME}', '${constants.SPEEDSTER}'),
            ('${constants.SCIZOR_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.SCYTHER_NAME}', '${constants.SPEEDSTER}'),
            ('${constants.CLEFABLE_NAME}', '${constants.SUPPORTER}'),
            ('${constants.ZOROARK_NAME}', '${constants.SPEEDSTER}'),
            ('${constants.SABLEYE_NAME}', '${constants.SUPPORTER}'),
            ('${constants.URSHIFUSS_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.URSHIFURS_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.DRAGAPULT_NAME}', '${constants.ATTACKER}'),
            ('${constants.COMFEY_NAME}', '${constants.SUPPORTER}'),
            ('${constants.ZACIAN_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.GOODRA_NAME}', '${constants.DEFENDER}'),
            ('${constants.LAPRAS_NAME}', '${constants.ATTACKER}'),
            ('${constants.CHANDELURE_NAME}', '${constants.ATTACKER}'),
            ('${constants.UMBREON_NAME}', '${constants.DEFENDER}'),
            ('${constants.LEAFEON_NAME}', '${constants.SPEEDSTER}'),
            ('${constants.INTELEON_NAME}', '${constants.ATTACKER}'),
            ('${constants.MEWTWOY_NAME}', '${constants.ATTACKER}'),
            ('${constants.MEWTWOX_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.BLAZIKEN_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.MIMIKYU_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.MEOWSCARADA_NAME}', '${constants.SPEEDSTER}'),
            ('${constants.METAGROSS_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.GYARADOS_NAME}', '${constants.ALL_ROUNDER}'),
            ('${constants.MIRAIDON_NAME}', '${constants.ATTACKER}'),
            ('${constants.FALINKS_NAME}', '${constants.ALL_ROUNDER}')
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