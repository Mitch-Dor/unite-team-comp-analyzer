class ProLeague {
    /**
       * Constructor for proLeague class
       * @param {*} db Pass DB object into class
       */
    constructor(db) {
      this.db = db;
    }


    //// EVENTS ////

    // Get all events
    async getAllEvents() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM pro_events ORDER BY event_date DESC';
            this.db.query(sql, (err, res) => { 
                if (err) {
                    console.error("SQL Error:", err.message);
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            });
        });
    }

    // Insert an event
    async insertEvent(name, date) {
        return new Promise((resolve, reject) => { 
          const sql = 'INSERT INTO pro_events (event_name, event_date) VALUES ($1, $2) RETURNING event_id';
          this.db.query(sql, [name, date], function(err, result) {
            if (err) {
              reject(err);
            } else {
              // The ID of the last inserted row
              resolve({ id: result.rows[0].event_id });
            }
          });
        });
      }

    //// TEAMS ////

    async getAllTeams() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM pro_teams ORDER BY team_name ASC';
            this.db.query(sql, (err, res) => {
                if (err) {
                    console.error("SQL Error:", err.message);
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            });
        });
    }

    async insertTeam(name, region) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO pro_teams (team_name, team_region) VALUES ($1, $2) RETURNING team_id';  
            this.db.query(sql, [name, region], function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    // The ID of the last inserted row
                    resolve({ id: result.rows[0].team_id });
                }
            });
        });
    }

    //// PLAYERS ////

    async getAllPlayers() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM pro_players ORDER BY player_name ASC';
            this.db.query(sql, (err, res) => {
                if (err) {
                    console.error("SQL Error:", err.message);
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            });
        });
    }

    async insertPlayer(name) {
        return new Promise((resolve, reject) => { 
            const sql = 'INSERT INTO pro_players (player_name) VALUES ($1) RETURNING player_id';
            this.db.query(sql, [name], function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    // The ID of the last inserted row
                    resolve({ id: result.rows[0].player_id });
                }
            });
        });
    }

}

module.exports = ProLeague;