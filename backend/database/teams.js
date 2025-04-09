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
        
        const aStarSolution = aStar.a_star_search(targetTeam, opposingTeam, bans, rawTraitData);
        
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

}

module.exports = Teams;