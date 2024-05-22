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
            ('${constants.CINDERACE_NAME}', 'Attacker'), 
            ('${constants.GARCHOMP_NAME}', 'All-Rounder'),
            ('${constants.GENGAR_NAME}', 'All-Rounder'),
            ('${constants.CRAMORANT_NAME}', 'All-Rounder'),
            ('${constants.ALOLANNINETALES_NAME}', 'All-Rounder'),
            ('Wigglytuff', 'All-Rounder'),
            ('Machamp', 'All-Rounder'),
            ('Absol', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder'),
            ('Garchomp', 'All-Rounder');
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