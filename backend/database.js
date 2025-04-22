const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./database_actual/unite_information.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log("ERROR opening database: " + err);
    }else {
        console.log("Connected to Database.");
    }
});

const Characters = require('./database/characters');
const characters = new Characters(db);
exports.characters = characters;

const Teams = require('./database/teams');
const teams = new Teams(db);
exports.teams = teams;

const Auth = require('./database/auth');
const auth = new Auth(db);
exports.auth = auth;