/// LOCAL
// const sqlite3 = require('sqlite3');

// const localDB = './database_actual/unite_information.db';

// const db = new sqlite3.Database(localDB, sqlite3.OPEN_READWRITE, (err) => {
//     if (err) {
//         console.log("ERROR opening database: " + err);
//     }else {
//         console.log("Connected to Database.");
//     }
// });

// const remoteDB = process.env.DATABASE_URL;

// const Characters = require('./database/characters');
// const characters = new Characters(db);
// exports.characters = characters;

// const Teams = require('./database/teams');
// const teams = new Teams(db);
// exports.teams = teams;

// const Auth = require('./database/auth');
// const auth = new Auth(db);
// exports.auth = auth;

/// REMOTE
const { Pool } = require('pg');

// URL encode the connection string to handle special characters in the password
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false // Required for some cloud PostgreSQL providers
    },
    // Add connection pool settings
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // How long to wait for a connection
    maxUses: 7500, // Close a connection after it has been used this many times
    // Add statement timeout to prevent long-running queries
    statement_timeout: 30000 // 30 seconds
});

// Add error handling for the pool
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
});

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        console.log("ERROR connecting to database: " + err);
    } else {
        console.log("Connected to PostgreSQL Database.");
        release();
    }
});

const Characters = require('./database/characters');
const characters = new Characters(pool);
exports.characters = characters;

const Teams = require('./database/teams');
const teams = new Teams(pool);
exports.teams = teams;

const Auth = require('./database/auth');
const auth = new Auth(pool);
exports.auth = auth;