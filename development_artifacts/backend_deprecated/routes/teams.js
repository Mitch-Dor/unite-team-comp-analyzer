const aStar = require('./a_star/a_star');

class Teams {
    /**
       * Constructor for teams class
       * @param {*} db Pass DB object into class
       */
    constructor(db) {
      this.db = db;
    }

     // ID, Name, Class, img link
     async runAStarAlgorithm(targetTeam, opposingTeam, bans){
      try {
        // Properly wait for the database result by wrapping it in a Promise
        const rawTraitData = await new Promise((resolve, reject) => {
          this.db.query('select * from pokemon_attributes natural join playable_characters', (err, res) => {
            if (err) {
              console.error('Database error:', err);
              reject(err);
            } else {
              // console.log('Retrieved trait data:', res.rows.length, 'records');
              resolve(res.rows);
            }
          });
        });

        // Get the tier list data
        const tierList = await this.formatTierList();

        const aStarSolution = aStar.a_star_search(targetTeam, opposingTeam, bans, rawTraitData, tierList);
        
        // Transform the solution to a simplified format
        if (aStarSolution && aStarSolution.picks) {
          const simplifiedSolution = aStarSolution.picks.map(pokemon => ({
            pokemon_name: pokemon.name,
            pokemon_class: pokemon.attributes.class
          }));
          
          return simplifiedSolution;
        }
        
        return []; // Return empty array if no solution was found
      } catch (error) {
        console.error('Error in runAStarAlgorithm:', error);
        throw error;
      }
    }   
    
    // Get detailed match information with all string values instead of IDs
    async getAllComps() {
      return new Promise((resolve, reject) => {
        const sql = `
        SELECT
          pm.match_id,
          -- Team 1 Pokemon
          pc1_1.pokemon_name AS team1_pokemon1,
          pc1_2.pokemon_name AS team1_pokemon2,
          pc1_3.pokemon_name AS team1_pokemon3, 
          pc1_4.pokemon_name AS team1_pokemon4,
          pc1_5.pokemon_name AS team1_pokemon5,
          
          -- Team 2 Pokemon
          pc2_1.pokemon_name AS team2_pokemon1,
          pc2_2.pokemon_name AS team2_pokemon2,
          pc2_3.pokemon_name AS team2_pokemon3,
          pc2_4.pokemon_name AS team2_pokemon4,
          pc2_5.pokemon_name AS team2_pokemon5,
          
          -- Team 1 Moves
          m1_1.move_name AS team1_pokemon1_move1,
          m1_2.move_name AS team1_pokemon1_move2,
          m1_3.move_name AS team1_pokemon2_move1,
          m1_4.move_name AS team1_pokemon2_move2,
          m1_5.move_name AS team1_pokemon3_move1,
          m1_6.move_name AS team1_pokemon3_move2,
          m1_7.move_name AS team1_pokemon4_move1,
          m1_8.move_name AS team1_pokemon4_move2,
          m1_9.move_name AS team1_pokemon5_move1,
          m1_10.move_name AS team1_pokemon5_move2,
          
          -- Team 2 Moves
          m2_1.move_name AS team2_pokemon1_move1,
          m2_2.move_name AS team2_pokemon1_move2,
          m2_3.move_name AS team2_pokemon2_move1,
          m2_4.move_name AS team2_pokemon2_move2,
          m2_5.move_name AS team2_pokemon3_move1,
          m2_6.move_name AS team2_pokemon3_move2,
          m2_7.move_name AS team2_pokemon4_move1, 
          m2_8.move_name AS team2_pokemon4_move2,
          m2_9.move_name AS team2_pokemon5_move1,
          m2_10.move_name AS team2_pokemon5_move2,

          -- Team 1 Performance
          pope1_1.kills AS team1_pokemon1_kills,
          pope1_1.assists AS team1_pokemon1_assists,
          pope1_1.damage_dealt AS team1_pokemon1_dealt,
          pope1_1.damage_taken AS team1_pokemon1_taken,
          pope1_1.damage_healed AS team1_pokemon1_healed,
          pope1_1.points_scored AS team1_pokemon1_scored,
          pope1_1.position_played AS team1_pokemon1_position,
          pope1_2.kills AS team1_pokemon2_kills,
          pope1_2.assists AS team1_pokemon2_assists,
          pope1_2.damage_dealt AS team1_pokemon2_dealt,
          pope1_2.damage_taken AS team1_pokemon2_taken,
          pope1_2.damage_healed AS team1_pokemon2_healed,
          pope1_2.points_scored AS team1_pokemon2_scored,
          pope1_2.position_played AS team1_pokemon2_position,
          pope1_3.kills AS team1_pokemon3_kills,
          pope1_3.assists AS team1_pokemon3_assists,
          pope1_3.damage_dealt AS team1_pokemon3_dealt,
          pope1_3.damage_taken AS team1_pokemon3_taken,
          pope1_3.damage_healed AS team1_pokemon3_healed,
          pope1_3.points_scored AS team1_pokemon3_scored,
          pope1_3.position_played AS team1_pokemon3_position,
          pope1_4.kills AS team1_pokemon4_kills,
          pope1_4.assists AS team1_pokemon4_assists,
          pope1_4.damage_dealt AS team1_pokemon4_dealt,
          pope1_4.damage_taken AS team1_pokemon4_taken,
          pope1_4.damage_healed AS team1_pokemon4_healed,
          pope1_4.points_scored AS team1_pokemon4_scored,
          pope1_4.position_played AS team1_pokemon4_position,
          pope1_5.kills AS team1_pokemon5_kills,
          pope1_5.assists AS team1_pokemon5_assists,
          pope1_5.damage_dealt AS team1_pokemon5_dealt,
          pope1_5.damage_taken AS team1_pokemon5_taken,
          pope1_5.damage_healed AS team1_pokemon5_healed,
          pope1_5.points_scored AS team1_pokemon5_scored,
          pope1_5.position_played AS team1_pokemon5_position,

          -- Team 2 Performance
          pope2_1.kills AS team2_pokemon1_kills,
          pope2_1.assists AS team2_pokemon1_assists,
          pope2_1.damage_dealt AS team2_pokemon1_dealt,
          pope2_1.damage_taken AS team2_pokemon1_taken,
          pope2_1.damage_healed AS team2_pokemon1_healed,
          pope2_1.points_scored AS team2_pokemon1_scored,
          pope2_1.position_played AS team2_pokemon1_position,
          pope2_2.kills AS team2_pokemon2_kills,
          pope2_2.assists AS team2_pokemon2_assists,
          pope2_2.damage_dealt AS team2_pokemon2_dealt,
          pope2_2.damage_taken AS team2_pokemon2_taken,
          pope2_2.damage_healed AS team2_pokemon2_healed,
          pope2_2.points_scored AS team2_pokemon2_scored,
          pope2_2.position_played AS team2_pokemon2_position,
          pope2_3.kills AS team2_pokemon3_kills,
          pope2_3.assists AS team2_pokemon3_assists,
          pope2_3.damage_dealt AS team2_pokemon3_dealt,
          pope2_3.damage_taken AS team2_pokemon3_taken,
          pope2_3.damage_healed AS team2_pokemon3_healed,
          pope2_3.points_scored AS team2_pokemon3_scored,
          pope2_3.position_played AS team2_pokemon3_position,
          pope2_4.kills AS team2_pokemon4_kills,
          pope2_4.assists AS team2_pokemon4_assists,
          pope2_4.damage_dealt AS team2_pokemon4_dealt,
          pope2_4.damage_taken AS team2_pokemon4_taken,
          pope2_4.damage_healed AS team2_pokemon4_healed,
          pope2_4.points_scored AS team2_pokemon4_scored,
          pope2_4.position_played AS team2_pokemon4_position,
          pope2_5.kills AS team2_pokemon5_kills,
          pope2_5.assists AS team2_pokemon5_assists,
          pope2_5.damage_dealt AS team2_pokemon5_dealt,
          pope2_5.damage_taken AS team2_pokemon5_taken,
          pope2_5.damage_healed AS team2_pokemon5_healed,
          pope2_5.points_scored AS team2_pokemon5_scored,
          pope2_5.position_played AS team2_pokemon5_position,
          
          -- Team 1 Players
          CASE WHEN pp1_1.other_names IS NULL OR pp1_1.other_names = '' THEN pp1_1.player_name ELSE pp1_1.player_name || ' (' || pp1_1.other_names || ')' END AS team1_player1,
          CASE WHEN pp1_2.other_names IS NULL OR pp1_2.other_names = '' THEN pp1_2.player_name ELSE pp1_2.player_name || ' (' || pp1_2.other_names || ')' END AS team1_player2,
          CASE WHEN pp1_3.other_names IS NULL OR pp1_3.other_names = '' THEN pp1_3.player_name ELSE pp1_3.player_name || ' (' || pp1_3.other_names || ')' END AS team1_player3,
          CASE WHEN pp1_4.other_names IS NULL OR pp1_4.other_names = '' THEN pp1_4.player_name ELSE pp1_4.player_name || ' (' || pp1_4.other_names || ')' END AS team1_player4,
          CASE WHEN pp1_5.other_names IS NULL OR pp1_5.other_names = '' THEN pp1_5.player_name ELSE pp1_5.player_name || ' (' || pp1_5.other_names || ')' END AS team1_player5,
          
          -- Team 2 Players
          CASE WHEN pp2_1.other_names IS NULL OR pp2_1.other_names = '' THEN pp2_1.player_name ELSE pp2_1.player_name || ' (' || pp2_1.other_names || ')' END AS team2_player1,
          CASE WHEN pp2_2.other_names IS NULL OR pp2_2.other_names = '' THEN pp2_2.player_name ELSE pp2_2.player_name || ' (' || pp2_2.other_names || ')' END AS team2_player2,
          CASE WHEN pp2_3.other_names IS NULL OR pp2_3.other_names = '' THEN pp2_3.player_name ELSE pp2_3.player_name || ' (' || pp2_3.other_names || ')' END AS team2_player3,
          CASE WHEN pp2_4.other_names IS NULL OR pp2_4.other_names = '' THEN pp2_4.player_name ELSE pp2_4.player_name || ' (' || pp2_4.other_names || ')' END AS team2_player4,
          CASE WHEN pp2_5.other_names IS NULL OR pp2_5.other_names = '' THEN pp2_5.player_name ELSE pp2_5.player_name || ' (' || pp2_5.other_names || ')' END AS team2_player5,
          
          -- Team Names and Regions
          pt1.team_name AS team1_name,
          pt1.team_region AS team1_region,
          pt2.team_name AS team2_name,
          pt2.team_region AS team2_region,
          
          -- Bans
          ban1_1.pokemon_name AS team1_ban1,
          ban1_2.pokemon_name AS team1_ban2,
          ban2_1.pokemon_name AS team2_ban1,
          ban2_2.pokemon_name AS team2_ban2,
          
          -- Match-related information
          ps.set_descriptor,
          ps.set_id,
          e.event_name,
          e.event_date,
          e.vod_url,
          
          -- First pick and winning status
          pc1.first_pick AS team1_first_pick,
          pc1.did_win AS team1_win,
          pc2.first_pick AS team2_first_pick,
          pc2.did_win AS team2_win
           
        FROM professional_matches pm
        
        -- Join with teams
        JOIN professional_teams pt1 ON pm.team_1_id = pt1.team_id
        JOIN professional_teams pt2 ON pm.team_2_id = pt2.team_id
        
        -- Join with set and event
        JOIN professional_sets ps ON pm.set_id = ps.set_id
        JOIN events e ON ps.event_id = e.event_id
        
        -- Join with comps
        JOIN professional_comps pc1 ON pm.team_1_comp_id = pc1.comp_id
        JOIN professional_comps pc2 ON pm.team_2_comp_id = pc2.comp_id
        
        -- Team 1 Pokemon
        JOIN playable_characters pc1_1 ON pc1.pokemon_1 = pc1_1.pokemon_id
        JOIN playable_characters pc1_2 ON pc1.pokemon_2 = pc1_2.pokemon_id
        JOIN playable_characters pc1_3 ON pc1.pokemon_3 = pc1_3.pokemon_id
        JOIN playable_characters pc1_4 ON pc1.pokemon_4 = pc1_4.pokemon_id
        JOIN playable_characters pc1_5 ON pc1.pokemon_5 = pc1_5.pokemon_id
        
        -- Team 2 Pokemon
        JOIN playable_characters pc2_1 ON pc2.pokemon_1 = pc2_1.pokemon_id
        JOIN playable_characters pc2_2 ON pc2.pokemon_2 = pc2_2.pokemon_id
        JOIN playable_characters pc2_3 ON pc2.pokemon_3 = pc2_3.pokemon_id
        JOIN playable_characters pc2_4 ON pc2.pokemon_4 = pc2_4.pokemon_id
        JOIN playable_characters pc2_5 ON pc2.pokemon_5 = pc2_5.pokemon_id
        
        -- Team 1 Moves
        JOIN pokemon_moves m1_1 ON pc1.pokemon_1_move_1 = m1_1.move_id
        JOIN pokemon_moves m1_2 ON pc1.pokemon_1_move_2 = m1_2.move_id
        JOIN pokemon_moves m1_3 ON pc1.pokemon_2_move_1 = m1_3.move_id
        JOIN pokemon_moves m1_4 ON pc1.pokemon_2_move_2 = m1_4.move_id
        JOIN pokemon_moves m1_5 ON pc1.pokemon_3_move_1 = m1_5.move_id
        JOIN pokemon_moves m1_6 ON pc1.pokemon_3_move_2 = m1_6.move_id
        JOIN pokemon_moves m1_7 ON pc1.pokemon_4_move_1 = m1_7.move_id
        JOIN pokemon_moves m1_8 ON pc1.pokemon_4_move_2 = m1_8.move_id
        JOIN pokemon_moves m1_9 ON pc1.pokemon_5_move_1 = m1_9.move_id
        JOIN pokemon_moves m1_10 ON pc1.pokemon_5_move_2 = m1_10.move_id
        
        -- Team 2 Moves
        JOIN pokemon_moves m2_1 ON pc2.pokemon_1_move_1 = m2_1.move_id
        JOIN pokemon_moves m2_2 ON pc2.pokemon_1_move_2 = m2_2.move_id
        JOIN pokemon_moves m2_3 ON pc2.pokemon_2_move_1 = m2_3.move_id
        JOIN pokemon_moves m2_4 ON pc2.pokemon_2_move_2 = m2_4.move_id
        JOIN pokemon_moves m2_5 ON pc2.pokemon_3_move_1 = m2_5.move_id
        JOIN pokemon_moves m2_6 ON pc2.pokemon_3_move_2 = m2_6.move_id
        JOIN pokemon_moves m2_7 ON pc2.pokemon_4_move_1 = m2_7.move_id
        JOIN pokemon_moves m2_8 ON pc2.pokemon_4_move_2 = m2_8.move_id
        JOIN pokemon_moves m2_9 ON pc2.pokemon_5_move_1 = m2_9.move_id
        JOIN pokemon_moves m2_10 ON pc2.pokemon_5_move_2 = m2_10.move_id
        
        -- Team 1 Players
        JOIN professional_players pp1_1 ON pm.team_1_player_1 = pp1_1.player_id
        JOIN professional_players pp1_2 ON pm.team_1_player_2 = pp1_2.player_id
        JOIN professional_players pp1_3 ON pm.team_1_player_3 = pp1_3.player_id
        JOIN professional_players pp1_4 ON pm.team_1_player_4 = pp1_4.player_id
        JOIN professional_players pp1_5 ON pm.team_1_player_5 = pp1_5.player_id
        
        -- Team 2 Players
        JOIN professional_players pp2_1 ON pm.team_2_player_1 = pp2_1.player_id
        JOIN professional_players pp2_2 ON pm.team_2_player_2 = pp2_2.player_id
        JOIN professional_players pp2_3 ON pm.team_2_player_3 = pp2_3.player_id
        JOIN professional_players pp2_4 ON pm.team_2_player_4 = pp2_4.player_id
        JOIN professional_players pp2_5 ON pm.team_2_player_5 = pp2_5.player_id
        
        -- Bans
        JOIN playable_characters ban1_1 ON pm.team_1_ban_1 = ban1_1.pokemon_id
        JOIN playable_characters ban1_2 ON pm.team_1_ban_2 = ban1_2.pokemon_id
        JOIN playable_characters ban2_1 ON pm.team_2_ban_1 = ban2_1.pokemon_id
        JOIN playable_characters ban2_2 ON pm.team_2_ban_2 = ban2_2.pokemon_id

        -- Performance
        LEFT JOIN pokemon_performance pope1_1 ON (pope1_1.comp_id = pc1.comp_id OR pope1_1.comp_id = pc2.comp_id) AND (pope1_1.pokemon_id = pc1.pokemon_1)
        LEFT JOIN pokemon_performance pope1_2 ON (pope1_2.comp_id = pc1.comp_id OR pope1_2.comp_id = pc2.comp_id) AND (pope1_2.pokemon_id = pc1.pokemon_2)
        LEFT JOIN pokemon_performance pope1_3 ON (pope1_3.comp_id = pc1.comp_id OR pope1_3.comp_id = pc2.comp_id) AND (pope1_3.pokemon_id = pc1.pokemon_3)
        LEFT JOIN pokemon_performance pope1_4 ON (pope1_4.comp_id = pc1.comp_id OR pope1_4.comp_id = pc2.comp_id) AND (pope1_4.pokemon_id = pc1.pokemon_4)
        LEFT JOIN pokemon_performance pope1_5 ON (pope1_5.comp_id = pc1.comp_id OR pope1_5.comp_id = pc2.comp_id) AND (pope1_5.pokemon_id = pc1.pokemon_5)
        LEFT JOIN pokemon_performance pope2_1 ON (pope2_1.comp_id = pc1.comp_id OR pope2_1.comp_id = pc2.comp_id) AND (pope2_1.pokemon_id = pc2.pokemon_1)
        LEFT JOIN pokemon_performance pope2_2 ON (pope2_2.comp_id = pc1.comp_id OR pope2_2.comp_id = pc2.comp_id) AND (pope2_2.pokemon_id = pc2.pokemon_2)
        LEFT JOIN pokemon_performance pope2_3 ON (pope2_3.comp_id = pc1.comp_id OR pope2_3.comp_id = pc2.comp_id) AND (pope2_3.pokemon_id = pc2.pokemon_3)
        LEFT JOIN pokemon_performance pope2_4 ON (pope2_4.comp_id = pc1.comp_id OR pope2_4.comp_id = pc2.comp_id) AND (pope2_4.pokemon_id = pc2.pokemon_4)
        LEFT JOIN pokemon_performance pope2_5 ON (pope2_5.comp_id = pc1.comp_id OR pope2_5.comp_id = pc2.comp_id) AND (pope2_5.pokemon_id = pc2.pokemon_5)

        ORDER BY pm.match_id
        `;
        
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

    // Get all events
    async getAllEvents() {
      return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM events';
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
    
    // Get all teams
    async getAllTeams() {
      return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM professional_teams';
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

    // Get all players
    async getAllPlayers() {
      return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM professional_players';
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
    
    // Get all characters and moves
    async getAllCharactersAndMoves() {
      return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM playable_characters natural join pokemon_moves';
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
    async insertEvent(name, date, vodUrl) {
      return new Promise((resolve, reject) => { 
        const sql = 'INSERT INTO events (event_name, event_date, vod_url) VALUES ($1, $2, $3) RETURNING event_id';
        this.db.query(sql, [name, date, vodUrl], function(err, result) {
          if (err) {
            reject(err);
          } else {
            // The ID of the last inserted row
            resolve({ id: result.rows[0].event_id });
          }
        });
      });
    }

    // Insert a team
    async insertTeam(name, region) {
      return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO professional_teams (team_name, team_region) VALUES ($1, $2) RETURNING team_id';  
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

    // Insert a player
    async insertPlayer(name) {
      return new Promise((resolve, reject) => { 
        const sql = 'INSERT INTO professional_players (player_name) VALUES ($1) RETURNING player_id';
        this.db.query(sql, [name], function(err, result) {
          if (err) {
            reject(err);
          } else {
            // tThe ID of the last inserted row
            resolve({ id: result.rows[0].player_id });
          }
        });
      });
    }

    // Insert a set
    async insertSet(setMatches) {
      return new Promise((resolve, reject) => {
        const db = this.db; // Store db reference
        // Insert the set and its descriptor first
        const event_id = setMatches.event_id;
        const set_descriptor = setMatches.set_descriptor;
        let sql = 'INSERT INTO professional_sets (event_id, set_descriptor) VALUES ($1, $2) RETURNING set_id';
        db.query(sql, [event_id, set_descriptor], function(err, result) {
          if (err) {
            reject(err);
            return;
          }
          
          const set_id = result.rows[0].set_id;
          const compPromises = [];
          
          // Create promises for all comp insertions
          for (let i = 0; i < setMatches.matches.length; i++) {
            const draft = setMatches.matches[i];
            const team1 = draft.team1;
            const team2 = draft.team2;
            
            // Create promises for team1 and team2 comps
            const team1Promise = new Promise((resolve, reject) => {
              const firstPick = team1.isFirstPick === true ? 1 : 0;
              const didWin = draft.winningTeam === 1 ? 1 : 0;
              sql = 'INSERT INTO professional_comps (pokemon_1, pokemon_2, pokemon_3, pokemon_4, pokemon_5, pokemon_1_move_1, pokemon_1_move_2, pokemon_2_move_1, pokemon_2_move_2, pokemon_3_move_1, pokemon_3_move_2, pokemon_4_move_1, pokemon_4_move_2, pokemon_5_move_1, pokemon_5_move_2, first_pick, did_win) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING comp_id';
              db.query(sql, [team1.pokemon[0], team1.pokemon[1], team1.pokemon[2], team1.pokemon[3], team1.pokemon[4], team1.pokemon_moves[0], team1.pokemon_moves[1], team1.pokemon_moves[2], team1.pokemon_moves[3], team1.pokemon_moves[4], team1.pokemon_moves[5], team1.pokemon_moves[6], team1.pokemon_moves[7], team1.pokemon_moves[8], team1.pokemon_moves[9], firstPick, didWin], function(err, result) {
                if (err) reject(err);
                else resolve(result.rows[0].comp_id);
              });
            });
            
            const team2Promise = new Promise((resolve, reject) => {
              const firstPick2 = team2.isFirstPick === true ? 1 : 0;
              const didWin2 = draft.winningTeam === 2 ? 1 : 0;
              sql = 'INSERT INTO professional_comps (pokemon_1, pokemon_2, pokemon_3, pokemon_4, pokemon_5, pokemon_1_move_1, pokemon_1_move_2, pokemon_2_move_1, pokemon_2_move_2, pokemon_3_move_1, pokemon_3_move_2, pokemon_4_move_1, pokemon_4_move_2, pokemon_5_move_1, pokemon_5_move_2, first_pick, did_win) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING comp_id';
              db.query(sql, [team2.pokemon[0], team2.pokemon[1], team2.pokemon[2], team2.pokemon[3], team2.pokemon[4], team2.pokemon_moves[0], team2.pokemon_moves[1], team2.pokemon_moves[2], team2.pokemon_moves[3], team2.pokemon_moves[4], team2.pokemon_moves[5], team2.pokemon_moves[6], team2.pokemon_moves[7], team2.pokemon_moves[8], team2.pokemon_moves[9], firstPick2, didWin2], function(err, result) {
                if (err) reject(err);
                else resolve(result.rows[0].comp_id);
              });
            });
            
            compPromises.push(Promise.all([team1Promise, team2Promise]));
          }
          
          // Wait for all comps to be inserted
          Promise.all(compPromises)
            .then(async (compIds) => {
              // Now insert matches sequentially to maintain order
              for (let i = 0; i < setMatches.matches.length; i++) {
                const [comp1ID, comp2ID] = compIds[i];
                const team1 = setMatches.matches[i].team1;
                const team2 = setMatches.matches[i].team2;
                
                // Insert match sequentially
                await new Promise((resolve, reject) => {
                  sql = 'INSERT INTO professional_matches (set_id, team_1_comp_id, team_2_comp_id, team_1_ban_1, team_1_ban_2, team_2_ban_1, team_2_ban_2, team_1_player_1, team_1_player_2, team_1_player_3, team_1_player_4, team_1_player_5, team_2_player_1, team_2_player_2, team_2_player_3, team_2_player_4, team_2_player_5, team_1_id, team_2_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)';
                  db.query(sql, [set_id, comp1ID, comp2ID, team1.bans[0], team1.bans[1], team2.bans[0], team2.bans[1], team1.players[0], team1.players[1], team1.players[2], team1.players[3], team1.players[4], team2.players[0], team2.players[1], team2.players[2], team2.players[3], team2.players[4], team1.team_id, team2.team_id], function(err) {
                    if (err) reject(err);
                    else resolve();
                  });
                });

                // Insert performance data if available
                if (setMatches.matches[i].hasAdvancedData) {
                  const performancePromises = [];
                  for (let j = 0; j < 5; j++){
                    let team1Pokemon = team1.pokemon[j];
                    let team2Pokemon = team2.pokemon[j];
                    const statPromiseT1 = new Promise((resolve, reject) => {
                      sql = 'INSERT INTO pokemon_performance (comp_id, pokemon_id, kills, assists, points_scored, damage_dealt, damage_taken, damage_healed, position_played) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
                      db.query(sql, [comp1ID, team1Pokemon, team1.pokemon_data[j][0], team1.pokemon_data[j][1], team1.pokemon_data[j][2], team1.pokemon_data[j][3], team1.pokemon_data[j][4], team1.pokemon_data[j][5], team1.pokemon_data[j][6]], function(err) {
                        if (err) reject(err);
                        else resolve();
                      });
                    });
                    const statPromiseT2 = new Promise((resolve, reject) => {
                      sql = 'INSERT INTO pokemon_performance (comp_id, pokemon_id, kills, assists, points_scored, damage_dealt, damage_taken, damage_healed, position_played) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
                      db.query(sql, [comp2ID, team2Pokemon, team2.pokemon_data[j][0], team2.pokemon_data[j][1], team2.pokemon_data[j][2], team2.pokemon_data[j][3], team2.pokemon_data[j][4], team2.pokemon_data[j][5], team2.pokemon_data[j][6]], function(err) {
                        if (err) reject(err);
                        else resolve();
                      });
                    });
                    performancePromises.push(statPromiseT1, statPromiseT2);
                  }
                  // Wait for all performance data for this match to be inserted
                  await Promise.all(performancePromises);
                }
              }
            })
            .then(() => {
              // All operations completed successfully
              resolve({ id: set_id });
            })
            .catch(err => {
              reject(err);
            });
        });
      });
    }

    // Rate a comp using the heuristics used in A*
    async rateComp(comp) {
      // Properly wait for the database result by wrapping it in a Promise
      const rawTraitData = await new Promise((resolve, reject) => {
        this.db.query('select * from pokemon_attributes natural join playable_characters', (err, res) => {
          if (err) {
            console.error('Database error:', err);
            reject(err);
          } else {
            // console.log('Retrieved trait data:', res.rows.length, 'records');
            resolve(res.rows);
          }
        });
      });

      // Remove nulls from comp
      const filteredComp = comp.filter(pokemon => pokemon !== null);

      const tierList = await this.formatTierList();

      const {totalScore, tierScore, synergyScore} = aStar.rateComp(filteredComp, rawTraitData, tierList);
      return {totalScore, tierScore, synergyScore};
    }

    // Get all tier list entries
    async getAllTierListEntries() {
      return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tier_list natural join playable_characters';
        this.db.query(sql, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res.rows);
          }
        });
      });
    }

    // Insert a tier list entry
    async insertTierListEntry(tierName, pokemonId) {
      // In one transaction, delete the entry containing the pokemon_id, then insert the new entry
      return new Promise((resolve, reject) => {
        this.db.query('BEGIN TRANSACTION');
        this.db.query('DELETE FROM tier_list WHERE pokemon_id = $1', [pokemonId], (err) => {
          if (err) {
            reject(err);
            return;
          }
          
          const sql = 'INSERT INTO tier_list (tier_name, pokemon_id) VALUES ($1, $2)';
          this.db.query(sql, [tierName, pokemonId], (err) => {
            if (err) { 
              reject(err);
            } else {
              this.db.query('COMMIT', (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            }
          });
        });
      });
    }

    // Get all verified users
    async getAllVerifiedUsers() {
      return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM verified_users';
        this.db.query(sql, (err, res) => {
          if (err) {
            console.error('Could not fetch verified users.');
            reject(err);
          } else {
            resolve(res.rows);
          }
        });
      });
    }

    // Create a tier list object
    async formatTierList() {
      // Get the tier list data
      const tierListData = await new Promise((resolve, reject) => {
        this.db.query('SELECT * FROM tier_list', (err, res) => {
          if (err) {
            console.error('Database error:', err);
            reject(err);
          } else {
            resolve(res.rows);
          }
        });
      });
      
      // Format the tier list data
      // Should be an object with tier names "S" through "F" as keys, and an array of pokemon ids as values
      const tierList = {};
      tierListData.forEach(row => {
        const tierName = row.tier_name;
        const pokemonId = row.pokemon_id;
        if (!tierList[tierName]) {
          tierList[tierName] = [];
        }
        tierList[tierName].push(pokemonId);
      });

      return tierList;
    }
}

module.exports = Teams;