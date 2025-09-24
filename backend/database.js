const { Pool } = require('pg');

// URL encode the connection string to handle special characters in the password
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false // Required for some cloud PostgreSQL providers
    }
});

// Add error handling for the pool
pool.on('error', (err, client) => {
    console.error(`Unexpected error on idle client ${client}`, err);
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

const AI = require('./database/ai');
const ai = new AI(pool);
exports.ai = ai;

const Auth = require('./database/auth');
const auth = new Auth(pool);
exports.auth = auth;

const Comps = require('./database/comps');
const comps = new Comps(pool);
exports.comps = comps;

const Pokemon = require('./database/pokemon');
const pokemon = new Pokemon(pool);
exports.pokemon = pokemon;

const ProLeague = require('./database/proLeague');
const proLeague = new ProLeague(pool);
exports.proLeague = proLeague;

const Stats = require('./database/stats');
const stats = new Stats(pool);
exports.stats = stats;
