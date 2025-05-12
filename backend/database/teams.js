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
          this.db.all('select * from pokemon_attributes natural join playable_characters', (err, rows) => {
            if (err) {
              console.error('Database error:', err);
              reject(err);
            } else {
              console.log('Retrieved trait data:', rows.length, 'records');
              resolve(rows);
            }
          });
        });

        // Get the tier list data
        const tierListData = await new Promise((resolve, reject) => {
          this.db.all('SELECT * FROM tier_list', (err, rows) => {
            if (err) {
              console.error('Database error:', err);
              reject(err);
            } else {
              resolve(rows);
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
          
          -- Team 1 Players
          pp1_1.player_name AS team1_player1,
          pp1_2.player_name AS team1_player2,
          pp1_3.player_name AS team1_player3,
          pp1_4.player_name AS team1_player4,
          pp1_5.player_name AS team1_player5,
          
          -- Team 2 Players
          pp2_1.player_name AS team2_player1,
          pp2_2.player_name AS team2_player2,
          pp2_3.player_name AS team2_player3,
          pp2_4.player_name AS team2_player4,
          pp2_5.player_name AS team2_player5,
          
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
        
        ORDER BY pm.match_id
        `;
        
        this.db.all(sql, (err, rows) => {
          if (err) {
            console.error("SQL Error:", err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }

    // Get all events
    async getAllEvents() {
      return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM events';
        this.db.all(sql, (err, rows) => { 
          if (err) {
            console.error("SQL Error:", err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
    
    // Get all teams
    async getAllTeams() {
      return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM professional_teams';
        this.db.all(sql, (err, rows) => {
          if (err) {
            console.error("SQL Error:", err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }

    // Get all players
    async getAllPlayers() {
      return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM professional_players';
        this.db.all(sql, (err, rows) => {
          if (err) {
            console.error("SQL Error:", err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
    
    // Get all characters and moves
    async getAllCharactersAndMoves() {
      return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM playable_characters natural join pokemon_moves';
        this.db.all(sql, (err, rows) => {
          if (err) {
            console.error("SQL Error:", err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }

    // Insert an event
    async insertEvent(name, date, vodUrl) {
      return new Promise((resolve, reject) => { 
        const sql = 'INSERT INTO events (event_name, event_date, vod_url) VALUES (?, ?, ?)';
        this.db.run(sql, [name, date, vodUrl], function(err) {
          if (err) {
            reject(err);
          } else {
            // this.lastID contains the ID of the last inserted row
            resolve({ id: this.lastID });
          }
        });
      });
    }

    // Insert a team
    async insertTeam(name, region) {
      return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO professional_teams (team_name, team_region) VALUES (?, ?)';  
        this.db.run(sql, [name, region], function(err) {
          if (err) {
            reject(err);
          } else {
            // this.lastID contains the ID of the last inserted row
            resolve({ id: this.lastID });
          }
        });
      });
    }

    // Insert a player
    async insertPlayer(name) {
      return new Promise((resolve, reject) => { 
        const sql = 'INSERT INTO professional_players (player_name) VALUES (?)';
        this.db.run(sql, [name], function(err) {
          if (err) {
            reject(err);
          } else {
            // this.lastID contains the ID of the last inserted row
            resolve({ id: this.lastID });
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
        let sql = 'INSERT INTO professional_sets (event_id, set_descriptor) VALUES (?, ?)';
        db.run(sql, [event_id, set_descriptor], function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          const set_id = this.lastID;
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
              sql = 'INSERT INTO professional_comps (pokemon_1, pokemon_2, pokemon_3, pokemon_4, pokemon_5, pokemon_1_move_1, pokemon_1_move_2, pokemon_2_move_1, pokemon_2_move_2, pokemon_3_move_1, pokemon_3_move_2, pokemon_4_move_1, pokemon_4_move_2, pokemon_5_move_1, pokemon_5_move_2, first_pick, did_win) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
              db.run(sql, [team1.pokemon[0], team1.pokemon[1], team1.pokemon[2], team1.pokemon[3], team1.pokemon[4], team1.pokemon_moves[0], team1.pokemon_moves[1], team1.pokemon_moves[2], team1.pokemon_moves[3], team1.pokemon_moves[4], team1.pokemon_moves[5], team1.pokemon_moves[6], team1.pokemon_moves[7], team1.pokemon_moves[8], team1.pokemon_moves[9], firstPick, didWin], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
              });
            });
            
            const team2Promise = new Promise((resolve, reject) => {
              const firstPick2 = team2.isFirstPick === true ? 1 : 0;
              const didWin2 = draft.winningTeam === 2 ? 1 : 0;
              sql = 'INSERT INTO professional_comps (pokemon_1, pokemon_2, pokemon_3, pokemon_4, pokemon_5, pokemon_1_move_1, pokemon_1_move_2, pokemon_2_move_1, pokemon_2_move_2, pokemon_3_move_1, pokemon_3_move_2, pokemon_4_move_1, pokemon_4_move_2, pokemon_5_move_1, pokemon_5_move_2, first_pick, did_win) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
              db.run(sql, [team2.pokemon[0], team2.pokemon[1], team2.pokemon[2], team2.pokemon[3], team2.pokemon[4], team2.pokemon_moves[0], team2.pokemon_moves[1], team2.pokemon_moves[2], team2.pokemon_moves[3], team2.pokemon_moves[4], team2.pokemon_moves[5], team2.pokemon_moves[6], team2.pokemon_moves[7], team2.pokemon_moves[8], team2.pokemon_moves[9], firstPick2, didWin2], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
              });
            });
            
            compPromises.push(Promise.all([team1Promise, team2Promise]));
          }
          
          // Wait for all comps to be inserted
          Promise.all(compPromises)
            .then(compIds => {
              // Now insert all matches
              const matchPromises = [];
              for (let i = 0; i < setMatches.matches.length; i++) {
                const [comp1ID, comp2ID] = compIds[i];
                const team1 = setMatches.matches[i].team1;
                const team2 = setMatches.matches[i].team2;
                
                const matchPromise = new Promise((resolve, reject) => {
                  sql = 'INSERT INTO professional_matches (set_id, team_1_comp_id, team_2_comp_id, team_1_ban_1, team_1_ban_2, team_2_ban_1, team_2_ban_2, team_1_player_1, team_1_player_2, team_1_player_3, team_1_player_4, team_1_player_5, team_2_player_1, team_2_player_2, team_2_player_3, team_2_player_4, team_2_player_5, team_1_id, team_2_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                  db.run(sql, [set_id, comp1ID, comp2ID, team1.bans[0], team1.bans[1], team2.bans[0], team2.bans[1], team1.players[0], team1.players[1], team1.players[2], team1.players[3], team1.players[4], team2.players[0], team2.players[1], team2.players[2], team2.players[3], team2.players[4], team1.team_id, team2.team_id], function(err) {
                    if (err) reject(err);
                    else resolve();
                  });
                });
                
                matchPromises.push(matchPromise);
              }
              
              // Wait for all matches to be inserted
              return Promise.all(matchPromises);
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
        this.db.all('select * from pokemon_attributes natural join playable_characters', (err, rows) => {
          if (err) {
            console.error('Database error:', err);
            reject(err);
          } else {
            console.log('Retrieved trait data:', rows.length, 'records');
            resolve(rows);
          }
        });
      });

      // Remove nulls from comp
      const filteredComp = comp.filter(pokemon => pokemon !== null);

      const {totalScore, tierScore, synergyScore} = aStar.rateComp(filteredComp, rawTraitData);
      return {totalScore, tierScore, synergyScore};
    }

    // Get all tier list entries
    async getAllTierListEntries() {
      return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tier_list natural join playable_characters';
        this.db.all(sql, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }

    // Insert a tier list entry
    async insertTierListEntry(tierName, pokemonId) {
      // In one transaction, delete the entry containing the pokemon_id, then insert the new entry
      return new Promise((resolve, reject) => {
        this.db.run('BEGIN TRANSACTION');
        this.db.all('DELETE FROM tier_list WHERE pokemon_id = ?', [pokemonId], (err) => {
          if (err) {
            reject(err);
            return;
          }
          
          const sql = 'INSERT INTO tier_list (tier_name, pokemon_id) VALUES (?, ?)';
          this.db.run(sql, [tierName, pokemonId], (err) => {
            if (err) { 
              reject(err);
            } else {
              this.db.run('COMMIT', (err) => {
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
        this.db.all(sql, (err, rows) => {
          resolve(rows);
        });
      });
    }
}

module.exports = Teams;