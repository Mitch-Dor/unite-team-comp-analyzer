class Characters {
    /**
       * Constructor for characters class
       * @param {*} db Pass DB object into class
       */
    constructor(db) {
      this.db = db;
    }

    // ID, Name, Class, img link
    async getAllCharacterDraftInformation(){
      return new Promise((resolve, reject) => {
        this.db.all('select pokemon_name, pokemon_class, can_exp_share, can_top_lane_carry, can_jungle_carry, can_bottom_lane_carry from playable_characters natural join pokemon_attributes', (err, rows) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }    

    // pokemon_name, early_game, mid_game, late_game, mobility, range, bulk, damage, damage_type, damage_affect, cc, play_style, classification, other_attr, can_exp_share, can_top_lane_carry, can_jungle_carry, can_bottom_lane_carry, best_lane, assumed_move_1, assumed_move_2
    async getIndividualCharacterTraits(name){
      return new Promise((resolve, reject) => {
        this.db.all('select * from playable_attributes where pokemon_name = ?', [name], (err, rows) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }

    // pokemon_name, early_game, mid_game, late_game, mobility, range, bulk, damage, damage_type, damage_affect, cc, play_style, classification, other_attr, can_exp_share, can_top_lane_carry, can_jungle_carry, can_bottom_lane_carry, best_lane, assumed_move_1, assumed_move_2
    async getAllCharacterAttributes(){
      return new Promise((resolve, reject) => {
        this.db.all('select * from pokemon_attributes natural join playable_characters', (err, rows) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }

    // Update traits for a character
    async updateCharacterAttributes(character, traits) {
      return new Promise((resolve, reject) => {
        const sql = `UPDATE pokemon_attributes SET 
                    early_game = ?, 
                    mid_game = ?, 
                    late_game = ?, 
                    mobility = ?, 
                    range = ?, 
                    bulk = ?, 
                    damage = ?, 
                    damage_type = ?, 
                    damage_affect = ?, 
                    cc = ?, 
                    play_style = ?, 
                    classification = ?, 
                    other_attr = ?, 
                    can_exp_share = ?, 
                    can_top_lane_carry = ?, 
                    can_jungle_carry = ?, 
                    can_bottom_lane_carry = ?, 
                    best_lane = ?, 
                    assumed_move_1 = ?, 
                    assumed_move_2 = ? 
                    WHERE pokemon_name = ?`;
        
        const params = [
          traits.early_game,
          traits.mid_game,
          traits.late_game,
          traits.mobility,
          traits.range,
          traits.bulk,
          traits.damage,
          traits.damage_type,
          traits.damage_affect,
          traits.cc,
          traits.play_style,
          traits.classification,
          traits.other_attr,
          traits.can_exp_share,
          traits.can_top_lane_carry,
          traits.can_jungle_carry,
          traits.can_bottom_lane_carry,
          traits.best_lane,
          traits.assumed_move_1,
          traits.assumed_move_2,
          character
        ];
        
        this.db.run(sql, params, function(err) {
          if (err) {
            console.error("SQL Error:", err.message);
            reject(err);
          } else {
            resolve({ changes: this.changes, message: 'Character attributes updated successfully' });
          }
        });
      });
    }

    // Get character stats
    async getCharacterStatsTest(queryContext) {
      return new Promise((resolve, reject) => {
        try {
          const { event, region, team, player, date, beforeAfter } = queryContext;

          // From clause
          // pm contains bans and players.
          // pc1 and pc2 contain picks, wins, and first pick
          // ps basically just links to the event
          // e contains the event name and date
          const fromSQL = `
            FROM 
              playable_characters pc
            LEFT JOIN
              professional_matches pm ON 1=1
            LEFT JOIN
              professional_teams pt1 ON pm.team_1_id = pt1.team_id
            LEFT JOIN
              professional_teams pt2 ON pm.team_2_id = pt2.team_id
            LEFT JOIN
              professional_comps pc1 ON pm.team_1_comp_id = pc1.comp_id
            LEFT JOIN
              professional_comps pc2 ON pm.team_2_comp_id = pc2.comp_id
            LEFT JOIN
              professional_sets ps ON pm.set_id = ps.set_id
            LEFT JOIN
              events e ON ps.event_id = e.event_id
          `;

          // Where clause
          let whereSQL = `
            WHERE 1=1
          `;

          let whereParams = [];
          // Easy Filters:
          // Event
          if (event) {
            whereSQL += ` AND e.event_id = ?`;
            whereParams.push(event);
          }
          // Date
          if (date && beforeAfter) {
            if (beforeAfter === 'before') {
              whereSQL += ` AND e.event_date <= ?`;
            } else if (beforeAfter === 'after') {
              whereSQL += ` AND e.event_date >= ?`;
            }
            whereParams.push(date);
          }

          // Complex Filters (Basically limits the matches to a specific side or player)

          // Team
          // If team_1_id is equal to team then I want to only get information for team_1's picks and bans
          // If team_2_id is equal to team then I want to only get information for team_2's picks and bans
          if (team) {
            whereSQL += ` AND (pm.team_1_id = ? OR pm.team_2_id = ?)`;
            whereParams.push(team, team);
          }
          
          // Region
          // If region is equal to team_1_region then I want to only get information for team_1's picks and bans
          // If region is equal to team_2_region then I want to only get information for team_2's picks and bans
          if (region) {
            whereSQL += ` AND (pt1.team_region = ? OR pt2.team_region = ?)`;
            whereParams.push(region, region);
          }

          // Player
          // If player_1 is equal to player then I want to only get information for player_1's picks and bans
          // If player_2 is equal to player then I want to only get information for player_2's picks and bans
          if (player) {
            whereSQL += ` AND (pm.team_1_player_1 = ? OR pm.team_1_player_2 = ? OR pm.team_1_player_3 = ? OR pm.team_1_player_4 = ? OR pm.team_1_player_5 = ? OR pm.team_2_player_1 = ? OR pm.team_2_player_2 = ? OR pm.team_2_player_3 = ? OR pm.team_2_player_4 = ? OR pm.team_2_player_5 = ?)`;
            whereParams.push(player, player, player, player, player, player, player, player, player, player);
          }

          // Select clause - base columns always included
          let selectSQL = `
            SELECT 
              pc.pokemon_id,
              pc.pokemon_name,
              COUNT(DISTINCT pm.match_id) as total_matches
          `;
          
          let selectParams = [];

          // Add team/region/player specific columns if all three are provided
          if (team && region && player) {
            selectSQL += `,
              COUNT(DISTINCT CASE WHEN ((pm.team_1_id = ? AND pt1.team_region = ?) AND 
                                       ((pc1.pokemon_1 = pc.pokemon_id AND pm.team_1_player_1 = ?) OR 
                                        (pc1.pokemon_2 = pc.pokemon_id AND pm.team_1_player_2 = ?) OR 
                                        (pc1.pokemon_3 = pc.pokemon_id AND pm.team_1_player_3 = ?) OR 
                                        (pc1.pokemon_4 = pc.pokemon_id AND pm.team_1_player_4 = ?) OR 
                                        (pc1.pokemon_5 = pc.pokemon_id AND pm.team_1_player_5 = ?))) OR
                                      ((pm.team_2_id = ? AND pt2.team_region = ?) AND
                                       ((pc2.pokemon_1 = pc.pokemon_id AND pm.team_2_player_1 = ?) OR 
                                        (pc2.pokemon_2 = pc.pokemon_id AND pm.team_2_player_2 = ?) OR 
                                        (pc2.pokemon_3 = pc.pokemon_id AND pm.team_2_player_3 = ?) OR 
                                        (pc2.pokemon_4 = pc.pokemon_id AND pm.team_2_player_4 = ?) OR 
                                        (pc2.pokemon_5 = pc.pokemon_id AND pm.team_2_player_5 = ?)))
                                       THEN pm.match_id ELSE NULL END) as picks,
              COUNT(DISTINCT CASE WHEN ((pm.team_1_id = ? AND pt1.team_region = ? AND pc1.did_win = 1) AND 
                                       ((pc1.pokemon_1 = pc.pokemon_id AND pm.team_1_player_1 = ?) OR 
                                        (pc1.pokemon_2 = pc.pokemon_id AND pm.team_1_player_2 = ?) OR 
                                        (pc1.pokemon_3 = pc.pokemon_id AND pm.team_1_player_3 = ?) OR 
                                        (pc1.pokemon_4 = pc.pokemon_id AND pm.team_1_player_4 = ?) OR 
                                        (pc1.pokemon_5 = pc.pokemon_id AND pm.team_1_player_5 = ?))) OR
                                      ((pm.team_2_id = ? AND pt2.team_region = ? AND pc2.did_win = 1) AND
                                       ((pc2.pokemon_1 = pc.pokemon_id AND pm.team_2_player_1 = ?) OR 
                                        (pc2.pokemon_2 = pc.pokemon_id AND pm.team_2_player_2 = ?) OR 
                                        (pc2.pokemon_3 = pc.pokemon_id AND pm.team_2_player_3 = ?) OR 
                                        (pc2.pokemon_4 = pc.pokemon_id AND pm.team_2_player_4 = ?) OR 
                                        (pc2.pokemon_5 = pc.pokemon_id AND pm.team_2_player_5 = ?)))
                                       THEN pm.match_id ELSE NULL END) as wins,
              SUM(CASE WHEN ((pm.team_1_ban_1 = pc.pokemon_id OR pm.team_1_ban_2 = pc.pokemon_id) AND pt1.team_id = ? AND pt1.team_region = ? AND (pm.team_1_player_1 = ? OR pm.team_1_player_2 = ? OR pm.team_1_player_3 = ? OR pm.team_1_player_4 = ? OR pm.team_1_player_5 = ?)) OR
                            ((pm.team_2_ban_1 = pc.pokemon_id OR pm.team_2_ban_2 = pc.pokemon_id) AND pt2.team_id = ? AND pt2.team_region = ? AND (pm.team_2_player_1 = ? OR pm.team_2_player_2 = ? OR pm.team_2_player_3 = ? OR pm.team_2_player_4 = ? OR pm.team_2_player_5 = ?))
                       THEN 1 ELSE 0 END) as bans,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = ? AND pt1.team_region = ? AND pm.team_1_player_1 = ?) OR
                                       (pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = ? AND pt2.team_region = ? AND pm.team_2_player_1 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_1,
              COUNT(DISTINCT CASE WHEN ((pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = ? AND pt2.team_region = ? AND pm.team_2_player_1 = ?) OR
                                       (pc2.pokemon_2 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = ? AND pt2.team_region = ? AND pm.team_2_player_2 = ?) OR
                                       (pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = ? AND pt1.team_region = ? AND pm.team_1_player_1 = ?) OR
                                       (pc1.pokemon_2 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = ? AND pt1.team_region = ? AND pm.team_1_player_2 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_2,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_2 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = ? AND pt1.team_region = ? AND pm.team_1_player_2 = ?) OR
                                       (pc1.pokemon_3 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = ? AND pt1.team_region = ? AND pm.team_1_player_3 = ?) OR
                                       (pc2.pokemon_2 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = ? AND pt2.team_region = ? AND pm.team_2_player_2 = ?) OR
                                       (pc2.pokemon_3 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = ? AND pt2.team_region = ? AND pm.team_2_player_3 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_3,
              COUNT(DISTINCT CASE WHEN ((pc2.pokemon_3 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = ? AND pt2.team_region = ? AND pm.team_2_player_3 = ?) OR
                                       (pc2.pokemon_4 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = ? AND pt2.team_region = ? AND pm.team_2_player_4 = ?) OR
                                       (pc1.pokemon_3 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = ? AND pt1.team_region = ? AND pm.team_1_player_3 = ?) OR
                                       (pc1.pokemon_4 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = ? AND pt1.team_region = ? AND pm.team_1_player_4 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_4,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_4 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = ? AND pt1.team_region = ? AND pm.team_1_player_4 = ?) OR
                                       (pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = ? AND pt1.team_region = ? AND pm.team_1_player_5 = ?) OR
                                       (pc2.pokemon_4 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = ? AND pt2.team_region = ? AND pm.team_2_player_4 = ?) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = ? AND pt2.team_region = ? AND pm.team_2_player_5 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_5,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = ? AND pt1.team_region = ? AND pm.team_1_player_5 = ?) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = ? AND pt2.team_region = ? AND pm.team_2_player_5 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_6
            `;  
            
            // Add all the parameters for the complex SELECT columns
            selectParams = [
              team, region, player, player, player, player, player, 
              team, region, player, player, player, player, player, 
              team, region, player, player, player, player, player, 
              team, region, player, player, player, player, player, 
              team, region, player, player, player, player, player, 
              team, region, player, player, player, player, player, 
              team, region, player,
              team, region, player,
              team, region, player,
              team, region, player,
              team, region, player,
              team, region, player,
              team, region, player,
              team, region, player,
              team, region, player,
              team, region, player,
              team, region, player,
              team, region, player,
              team, region, player,
              team, region, player,
              team, region, player,
              team, region, player,
              team, region, player,
              team, region, player,
              team, region, player,
              team, region, player
            ];
          }

          // Build and execute the final query
          const query = `
            ${selectSQL}
            ${fromSQL}
            ${whereSQL}
            GROUP BY pc.pokemon_id, pc.pokemon_name
          `;
          
          this.db.all(query, [...selectParams, ...whereParams], (err, rows) => {
            if (err) {
              console.error("SQL Error:", err.message);
              reject(err);
            } else {
              resolve(rows);
            }
          });
        } catch (error) {
          console.error("Function error:", error.message);
          reject(error);
        }
      });
    }

    // Get character stats
    async getCharacterStats(queryContext) {
      return new Promise((resolve, reject) => {
          const { event, region, team, player, date, beforeAfter } = queryContext;
          console.log(event, region, team, player, date, beforeAfter);
          
          // This approach is better - we'll use separate queries for bans and picks
          // and combine the results in JavaScript, which is more maintainable
          
          // First query - get ban statistics (much simpler)
          const banSQL = `
            SELECT 
              pc.pokemon_id,
              pc.pokemon_name,
              COUNT(DISTINCT pm.match_id) as total_matches,
              SUM(CASE WHEN pm.team_1_ban_1 = pc.pokemon_id OR pm.team_1_ban_2 = pc.pokemon_id OR
                          pm.team_2_ban_1 = pc.pokemon_id OR pm.team_2_ban_2 = pc.pokemon_id
                     THEN 1 ELSE 0 END) as bans
            FROM 
              playable_characters pc
            LEFT JOIN 
              professional_matches pm ON 
                pm.team_1_ban_1 = pc.pokemon_id OR pm.team_1_ban_2 = pc.pokemon_id OR
                pm.team_2_ban_1 = pc.pokemon_id OR pm.team_2_ban_2 = pc.pokemon_id
            LEFT JOIN 
              professional_sets ps ON pm.set_id = ps.set_id
            LEFT JOIN 
              events e ON ps.event_id = e.event_id
            LEFT JOIN 
              professional_teams pt1 ON pm.team_1_id = pt1.team_id
            LEFT JOIN 
              professional_teams pt2 ON pm.team_2_id = pt2.team_id
            WHERE 1=1
          `;
          
          // Second query - get pick statistics (focus on comp tables)
          const pickSQL = `
            SELECT 
              pc.pokemon_id,
              pc.pokemon_name,
              COUNT(DISTINCT CASE WHEN pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id OR 
                                     pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id OR 
                                     pc1.pokemon_5 = pc.pokemon_id OR
                                     pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id OR 
                                     pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id OR 
                                     pc2.pokemon_5 = pc.pokemon_id
                               THEN pm.match_id ELSE NULL END) as picks,
              COUNT(DISTINCT CASE WHEN (pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id OR 
                                         pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id OR 
                                         pc1.pokemon_5 = pc.pokemon_id) AND pc1.did_win = 1
                                 THEN pm.match_id ELSE NULL END) +
              COUNT(DISTINCT CASE WHEN (pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id OR 
                                         pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id OR 
                                         pc2.pokemon_5 = pc.pokemon_id) AND pc2.did_win = 1
                                 THEN pm.match_id ELSE NULL END) as wins,
              COUNT(DISTINCT CASE WHEN pc1.pokemon_1 = pc.pokemon_id 
                               THEN pm.match_id ELSE NULL END) as pick_round_1,
              COUNT(DISTINCT CASE WHEN pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id 
                               THEN pm.match_id ELSE NULL END) as pick_round_2,
              COUNT(DISTINCT CASE WHEN pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id 
                               THEN pm.match_id ELSE NULL END) as pick_round_3,
              COUNT(DISTINCT CASE WHEN pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id 
                               THEN pm.match_id ELSE NULL END) as pick_round_4,
              COUNT(DISTINCT CASE WHEN pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id 
                               THEN pm.match_id ELSE NULL END) as pick_round_5,
              COUNT(DISTINCT CASE WHEN pc2.pokemon_5 = pc.pokemon_id
                               THEN pm.match_id ELSE NULL END) as pick_round_6
            FROM 
              playable_characters pc
            LEFT JOIN 
              professional_matches pm ON 1=1
            LEFT JOIN 
              professional_comps pc1 ON pm.team_1_comp_id = pc1.comp_id
            LEFT JOIN 
              professional_comps pc2 ON pm.team_2_comp_id = pc2.comp_id
            LEFT JOIN 
              professional_sets ps ON pm.set_id = ps.set_id
            LEFT JOIN 
              events e ON ps.event_id = e.event_id
            LEFT JOIN 
              professional_teams pt1 ON pm.team_1_id = pt1.team_id
            LEFT JOIN 
              professional_teams pt2 ON pm.team_2_id = pt2.team_id
            WHERE (pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id OR 
                   pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id OR 
                   pc1.pokemon_5 = pc.pokemon_id OR
                   pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id OR 
                   pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id OR 
                   pc2.pokemon_5 = pc.pokemon_id)
          `;
          
          // Add common filtering conditions
          let banParams = [];
          let pickParams = [];
          
          // Event filter
          let additionalFilter = '';
          if (event) {
            additionalFilter += ` AND e.event_id = ?`;
            banParams.push(event);
            pickParams.push(event);
          }
          
          // Region filter
          if (region) {
            additionalFilter += ` AND (pt1.team_region = ? OR pt2.team_region = ?)`;
            banParams.push(region, region);
            pickParams.push(region, region);
          }
          
          // Team filter
          if (team) {
            additionalFilter += ` AND (pm.team_1_id = ? OR pm.team_2_id = ?)`;
            banParams.push(team, team);
            pickParams.push(team, team);
          }
          
          // Player filter for pick stats
          let playerPickFilter = '';
          let playerPickParams = [];
          
          // Player filter for ban stats - only count bans in matches where the player participated
          let playerBanFilter = '';
          let playerBanParams = [];
          
          if (player) {
            // For picking, we want to filter ONLY matches where this player is using this character
            playerPickFilter = ` AND (
              (pm.team_1_player_1 = ? AND pc1.pokemon_1 = pc.pokemon_id) OR
              (pm.team_1_player_2 = ? AND pc1.pokemon_2 = pc.pokemon_id) OR
              (pm.team_1_player_3 = ? AND pc1.pokemon_3 = pc.pokemon_id) OR
              (pm.team_1_player_4 = ? AND pc1.pokemon_4 = pc.pokemon_id) OR
              (pm.team_1_player_5 = ? AND pc1.pokemon_5 = pc.pokemon_id) OR
              (pm.team_2_player_1 = ? AND pc2.pokemon_1 = pc.pokemon_id) OR
              (pm.team_2_player_2 = ? AND pc2.pokemon_2 = pc.pokemon_id) OR
              (pm.team_2_player_3 = ? AND pc2.pokemon_3 = pc.pokemon_id) OR
              (pm.team_2_player_4 = ? AND pc2.pokemon_4 = pc.pokemon_id) OR
              (pm.team_2_player_5 = ? AND pc2.pokemon_5 = pc.pokemon_id)
            )`;
            playerPickParams = Array(10).fill(player);
            
            // For bans, we only want to count bans in matches where the player participated
            playerBanFilter = ` AND (
              pm.team_1_player_1 = ? OR pm.team_1_player_2 = ? OR pm.team_1_player_3 = ? OR 
              pm.team_1_player_4 = ? OR pm.team_1_player_5 = ? OR
              pm.team_2_player_1 = ? OR pm.team_2_player_2 = ? OR pm.team_2_player_3 = ? OR 
              pm.team_2_player_4 = ? OR pm.team_2_player_5 = ?
            )`;
            playerBanParams = Array(10).fill(player);
          }
          
          // Date filter
          if (date && beforeAfter) {
            if (beforeAfter === 'before') {
              additionalFilter += ` AND e.event_date <= ?`;
            } else if (beforeAfter === 'after') {
              additionalFilter += ` AND e.event_date >= ?`;
            }
            banParams.push(date);
            pickParams.push(date);
          }
          
          // If player filter is applied, we need a special condition for match counting
          let playerMatchParams = [];
          let playerMatchCondition = "";
          if (player) {
            playerMatchCondition = ` AND (
              pm.team_1_player_1 = ? OR pm.team_1_player_2 = ? OR pm.team_1_player_3 = ? OR 
              pm.team_1_player_4 = ? OR pm.team_1_player_5 = ? OR
              pm.team_2_player_1 = ? OR pm.team_2_player_2 = ? OR pm.team_2_player_3 = ? OR 
              pm.team_2_player_4 = ? OR pm.team_2_player_5 = ?
            )`;
            playerMatchParams = Array(10).fill(player);
          }
          
          // Append common filters to both queries
          const completeBanSQL = banSQL + additionalFilter + playerBanFilter + ` GROUP BY pc.pokemon_id, pc.pokemon_name`;
          const completePickSQL = pickSQL + additionalFilter + playerPickFilter + ` GROUP BY pc.pokemon_id, pc.pokemon_name`;
          
          // Execute both queries
          const banPromise = new Promise((resolve, reject) => {
            this.db.all(completeBanSQL, [...banParams, ...playerBanParams], (err, rows) => {
              if (err) {
                console.error("Ban Stats SQL Error:", err.message);
                reject(err);
              } else {
                resolve(rows);
              }
            });
          });
          
          const pickPromise = new Promise((resolve, reject) => {
            this.db.all(completePickSQL, [...pickParams, ...playerPickParams], (err, rows) => {
              if (err) {
                console.error("Pick Stats SQL Error:", err.message);
                reject(err);
              } else {
                resolve(rows);
              }
            });
          });
          
          // Get the total match count for proper rate calculations
          const matchCountSQL = `
            SELECT COUNT(DISTINCT pm.match_id) as filtered_match_count 
            FROM professional_matches pm
            LEFT JOIN professional_sets ps ON pm.set_id = ps.set_id
            LEFT JOIN events e ON ps.event_id = e.event_id
            LEFT JOIN professional_teams pt1 ON pm.team_1_id = pt1.team_id
            LEFT JOIN professional_teams pt2 ON pm.team_2_id = pt2.team_id
            WHERE 1=1 ${additionalFilter}
          `;
          
          // Final match count SQL with player condition if needed
          const finalMatchCountSQL = matchCountSQL + playerMatchCondition;
          const matchCountParams = [...banParams, ...playerMatchParams];
          
          const matchCountPromise = new Promise((resolve, reject) => {
            this.db.get(finalMatchCountSQL, matchCountParams, (err, countRow) => {
              if (err) {
                console.error("Match Count SQL Error:", err.message);
                reject(err);
              } else {
                resolve(countRow ? countRow.filtered_match_count : 0);
              }
            });
          });
          
          // Combine all the results
          Promise.all([banPromise, pickPromise, matchCountPromise])
            .then(([banStats, pickStats, filteredMatchCount]) => {
              // Create a map of pokemon_id to all their stats
              const statsMap = new Map();
              
              // Add ban stats to the map
              banStats.forEach(stat => {
                statsMap.set(stat.pokemon_id, {
                  pokemon_id: stat.pokemon_id,
                  pokemon_name: stat.pokemon_name,
                  total_matches: filteredMatchCount, // Use the filtered count for all entries
                  bans: stat.bans,
                  picks: 0,
                  wins: 0,
                  pick_round_1: 0,
                  pick_round_2: 0,
                  pick_round_3: 0,
                  pick_round_4: 0,
                  pick_round_5: 0,
                  pick_round_6: 0
                });
              });
              
              // Add pick stats to the map
              pickStats.forEach(stat => {
                const existingStat = statsMap.get(stat.pokemon_id);
                if (existingStat) {
                  existingStat.picks = stat.picks || 0;
                  existingStat.wins = stat.wins || 0;
                  existingStat.pick_round_1 = stat.pick_round_1 || 0;
                  existingStat.pick_round_2 = stat.pick_round_2 || 0;
                  existingStat.pick_round_3 = stat.pick_round_3 || 0;
                  existingStat.pick_round_4 = stat.pick_round_4 || 0;
                  existingStat.pick_round_5 = stat.pick_round_5 || 0;
                  existingStat.pick_round_6 = stat.pick_round_6 || 0;
                } else {
                  statsMap.set(stat.pokemon_id, {
                    pokemon_id: stat.pokemon_id,
                    pokemon_name: stat.pokemon_name,
                    total_matches: filteredMatchCount, // Use filtered count here too
                    bans: 0,
                    picks: stat.picks || 0,
                    wins: stat.wins || 0,
                    pick_round_1: stat.pick_round_1 || 0,
                    pick_round_2: stat.pick_round_2 || 0,
                    pick_round_3: stat.pick_round_3 || 0,
                    pick_round_4: stat.pick_round_4 || 0,
                    pick_round_5: stat.pick_round_5 || 0,
                    pick_round_6: stat.pick_round_6 || 0
                  });
                }
              });
              
              // Also add any character that doesn't have picks or bans
              // so they show up with 0% rates in the results
              this.db.all('SELECT pokemon_id, pokemon_name FROM playable_characters', async (err, allCharacters) => {
                if (err) {
                  console.error("Error fetching all characters:", err.message);
                  // Continue with what we have
                } else {
                  // Add any missing characters
                  allCharacters.forEach(char => {
                    if (!statsMap.has(char.pokemon_id)) {
                      statsMap.set(char.pokemon_id, {
                        pokemon_id: char.pokemon_id,
                        pokemon_name: char.pokemon_name,
                        total_matches: filteredMatchCount,
                        bans: 0,
                        picks: 0,
                        wins: 0,
                        pick_round_1: 0,
                        pick_round_2: 0,
                        pick_round_3: 0,
                        pick_round_4: 0,
                        pick_round_5: 0,
                        pick_round_6: 0
                      });
                    }
                  });
                }
                
                // Calculate rates for each character
                const results = Array.from(statsMap.values()).map(stat => {
                  // Use filtered match count as denominator
                  const banRate = filteredMatchCount > 0 ? stat.bans / filteredMatchCount : 0;
                  const pickRate = filteredMatchCount > 0 ? stat.picks / filteredMatchCount : 0;
                  const presence = filteredMatchCount > 0 ? (stat.bans + stat.picks) / filteredMatchCount : 0;
                  const winRate = stat.picks > 0 ? stat.wins / stat.picks : 0;
                  
                  return {
                    ...stat,
                    ban_rate: banRate,
                    pick_rate: pickRate,
                    presence: presence,
                    win_rate: winRate
                  };
                });

                // Get move combo stats for all characters
                const moveCombos = await this.getAllPokemonMoveComboStats({
                  event: event,
                  region: region,
                  team: team,
                  player: player,
                  date: date,
                  beforeAfter: beforeAfter
                });

                // Add the move combos to the results
                results.forEach(result => {
                  result.move_combos = moveCombos.filter(combo => combo.pokemon_name === result.pokemon_name);
                });
                resolve(results);
              });
            })
            .catch(error => {
              console.error("Error combining queries:", error);
              reject(error);
            });
      });
    }
}

module.exports = Characters;