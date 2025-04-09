// File used to initialize the database.

//https://www.linode.com/docs/guides/getting-started-with-nodejs-sqlite/

// NOTE: CREATES DATABASE WHERE FILE IS RUN FROM

const constants = require('../../frontend/src/common/naming_constants.js');
const pokemonData = require('./databaseData/pokemonData');
const populate_db = require('./populate_db');

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
        -- Table symbolizing the characters themselves
        create table playable_characters (
            pokemon_id integer primary key AUTOINCREMENT not null,
            pokemon_name text not null,
            pokemon_class text not null
        );
        -- Table symbolizing character traits for AI
        create table pokemon_attributes (
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
            other_attr text not null,
            can_exp_share text not null,
            can_top_lane_carry text not null,
            can_jungle_carry text not null,
            can_bottom_lane_carry text not null,
            best_lane text not null,
            assumed_move_1 text not null,
            assumed_move_2 text not null,
            FOREIGN KEY (pokemon_id) REFERENCES playable_characters (pokemon_id)
        );
        -- Table symbolizing moves that a pokemon can use
        create table pokemon_moves (
            move_id integer primary key AUTOINCREMENT not null,
            move_name text not null,
            pokemon_id int not null,
            FOREIGN KEY (pokemon_id) REFERENCES playable_characters (pokemon_id)
        );
        -- Table symbolizing a comp a team drafted
        create table professional_comps (
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
            -- 1 if this team won, 0 if this team lost
            did_win int not null,
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
        );
        -- A table symbolizing a match between two teams in a given set
        create table professional_matches (
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
        );
        -- A table symbolizing professional players
        create table professional_players (
            player_id integer primary key AUTOINCREMENT not null,
            player_name text not null
        );
        -- A table symbolizing a professional team 
        create table professional_teams (
            team_id integer primary key AUTOINCREMENT not null,
            team_name text not null,
            team_region text not null
        );
        -- A table symbolizing a set of matches at a given event
        create table professional_sets (
            set_id integer primary key AUTOINCREMENT not null,
            event_id int not null,
            set_descriptor text not null,
            FOREIGN KEY (event_id) REFERENCES events (event_id)
        );
        -- A table symbolizing an event
        create table events (
            event_id integer primary key AUTOINCREMENT not null,
            event_name text not null,
            event_date text not null,
            vod_url text not null
        )
        `, (err) => {
            if (err) {
                console.log("Error creating tables: " + err.message);
                process.exit(1);
            } else {
                console.log("Successfully created tables.");
                populate_db(newdb).then(() => {
                    runQueries(newdb);
                }).catch(err => {
                    console.log("Error populating database: " + err);
                    process.exit(1);
                });
            }
        });
    }

    // Testing to make sure the database populated correctly
    function runQueries(db) {
        console.log("Running queries");
        db.all(`
        select * from professional_teams`, (err, rows) => {
            if (err) {
                console.log("Getting error " + err);
                return;
            }
            rows.forEach(row => {
                console.log(row.team_id, row.team_name, row.team_region);
            });
        });
    }

    // Drops all existing tables to clear the database
    function clearDatabase(db, callback) {
        db.exec(`
        DROP TABLE IF EXISTS professional_matches;
        DROP TABLE IF EXISTS professional_sets;
        DROP TABLE IF EXISTS professional_comps;
        DROP TABLE IF EXISTS pokemon_moves;
        DROP TABLE IF EXISTS pokemon_attributes;
        DROP TABLE IF EXISTS playable_characters;
        DROP TABLE IF EXISTS professional_players;
        DROP TABLE IF EXISTS professional_teams;
        DROP TABLE IF EXISTS events;
        `, (err) => {
            if (err) {
                console.log("Getting error " + err);
                return;
            }
            callback();
        });
    }
}