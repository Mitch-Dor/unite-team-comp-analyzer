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
        this.db.all('select pokemon_id, pokemon_name, pokemon_class, can_exp_share, can_top_lane_carry, can_jungle_carry, can_bottom_lane_carry from playable_characters natural join pokemon_attributes', (err, rows) => {
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
    async getCharacterStats(queryContext) {
      const pickBanStats = await new Promise((resolve, reject) => {
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
          } else if (team && region) {
            selectSQL += `,
              COUNT(DISTINCT CASE WHEN ((pm.team_1_id = ? AND pt1.team_region = ? AND (pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id)) OR
                                      (pm.team_2_id = ? AND pt2.team_region = ? AND (pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id)))
                                       THEN pm.match_id ELSE NULL END) as picks,
              COUNT(DISTINCT CASE WHEN ((pm.team_1_id = ? AND pt1.team_region = ? AND pc1.did_win = 1 AND (pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id)) OR
                                      (pm.team_2_id = ? AND pt2.team_region = ? AND pc2.did_win = 1 AND (pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id)))
                                       THEN pm.match_id ELSE NULL END) as wins,
              SUM(CASE WHEN (((pm.team_1_ban_1 = pc.pokemon_id OR pm.team_1_ban_2 = pc.pokemon_id) AND pt1.team_id = ? AND pt1.team_region = ?) OR
                            ((pm.team_2_ban_1 = pc.pokemon_id OR pm.team_2_ban_2 = pc.pokemon_id) AND pt2.team_id = ? AND pt2.team_region = ?))
                       THEN 1 ELSE 0 END) as bans,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = ? AND pt1.team_region = ?) OR
                                       (pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = ? AND pt2.team_region = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_1,
              COUNT(DISTINCT CASE WHEN (((pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id) AND pc2.first_pick = 0 AND pm.team_2_id = ? AND pt2.team_region = ?) OR
                                       ((pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id) AND pc1.first_pick = 0 AND pm.team_1_id = ? AND pt1.team_region = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_2,
              COUNT(DISTINCT CASE WHEN (((pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id) AND pc1.first_pick = 1 AND pm.team_1_id = ? AND pt1.team_region = ?) OR
                                       ((pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id) AND pc2.first_pick = 1 AND pm.team_2_id = ? AND pt2.team_region = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_3,
              COUNT(DISTINCT CASE WHEN (((pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id) AND pc2.first_pick = 0 AND pm.team_2_id = ? AND pt2.team_region = ?) OR
                                       ((pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id) AND pc1.first_pick = 0 AND pm.team_1_id = ? AND pt1.team_region = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_4,
              COUNT(DISTINCT CASE WHEN (((pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id) AND pc1.first_pick = 1 AND pm.team_1_id = ? AND pt1.team_region = ?) OR
                                       ((pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id) AND pc2.first_pick = 1 AND pm.team_2_id = ? AND pt2.team_region = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_5,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = ? AND pt1.team_region = ?) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = ? AND pt2.team_region = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_6
            `;  
            
            // Add all the parameters for the complex SELECT columns
            selectParams = [
              team, region, team, region, team, region, team, region, team, region, team, region,
              team, region, team, region, team, region, team, region, team, region, team, region,
              team, region, team, region, team, region, team, region, team, region, team, region
            ];
          } else if (team && player) {
            selectSQL += `,
              COUNT(DISTINCT CASE WHEN (pm.team_1_id = ? AND 
                                       ((pc1.pokemon_1 = pc.pokemon_id AND pm.team_1_player_1 = ?) OR 
                                        (pc1.pokemon_2 = pc.pokemon_id AND pm.team_1_player_2 = ?) OR 
                                        (pc1.pokemon_3 = pc.pokemon_id AND pm.team_1_player_3 = ?) OR 
                                        (pc1.pokemon_4 = pc.pokemon_id AND pm.team_1_player_4 = ?) OR 
                                        (pc1.pokemon_5 = pc.pokemon_id AND pm.team_1_player_5 = ?))) OR
                                       (pm.team_2_id = ? AND 
                                       ((pc2.pokemon_1 = pc.pokemon_id AND pm.team_2_player_1 = ?) OR 
                                        (pc2.pokemon_2 = pc.pokemon_id AND pm.team_2_player_2 = ?) OR 
                                        (pc2.pokemon_3 = pc.pokemon_id AND pm.team_2_player_3 = ?) OR 
                                        (pc2.pokemon_4 = pc.pokemon_id AND pm.team_2_player_4 = ?) OR 
                                        (pc2.pokemon_5 = pc.pokemon_id AND pm.team_2_player_5 = ?)))
                                       THEN pm.match_id ELSE NULL END) as picks,
              COUNT(DISTINCT CASE WHEN ((pm.team_1_id = ? AND pc1.did_win = 1) AND 
                                       ((pc1.pokemon_1 = pc.pokemon_id AND pm.team_1_player_1 = ?) OR 
                                        (pc1.pokemon_2 = pc.pokemon_id AND pm.team_1_player_2 = ?) OR 
                                        (pc1.pokemon_3 = pc.pokemon_id AND pm.team_1_player_3 = ?) OR 
                                        (pc1.pokemon_4 = pc.pokemon_id AND pm.team_1_player_4 = ?) OR 
                                        (pc1.pokemon_5 = pc.pokemon_id AND pm.team_1_player_5 = ?))) OR
                                      ((pm.team_2_id = ? AND pc2.did_win = 1) AND
                                       ((pc2.pokemon_1 = pc.pokemon_id AND pm.team_2_player_1 = ?) OR 
                                        (pc2.pokemon_2 = pc.pokemon_id AND pm.team_2_player_2 = ?) OR 
                                        (pc2.pokemon_3 = pc.pokemon_id AND pm.team_2_player_3 = ?) OR 
                                        (pc2.pokemon_4 = pc.pokemon_id AND pm.team_2_player_4 = ?) OR 
                                        (pc2.pokemon_5 = pc.pokemon_id AND pm.team_2_player_5 = ?)))
                                       THEN pm.match_id ELSE NULL END) as wins,
              SUM(CASE WHEN ((pm.team_1_ban_1 = pc.pokemon_id OR pm.team_1_ban_2 = pc.pokemon_id) AND pt1.team_id = ? AND (pm.team_1_player_1 = ? OR pm.team_1_player_2 = ? OR pm.team_1_player_3 = ? OR pm.team_1_player_4 = ? OR pm.team_1_player_5 = ?)) OR
                            ((pm.team_2_ban_1 = pc.pokemon_id OR pm.team_2_ban_2 = pc.pokemon_id) AND pt2.team_id = ? AND (pm.team_2_player_1 = ? OR pm.team_2_player_2 = ? OR pm.team_2_player_3 = ? OR pm.team_2_player_4 = ? OR pm.team_2_player_5 = ?))
                       THEN 1 ELSE 0 END) as bans,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = ? AND pm.team_1_player_1 = ?) OR
                                       (pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = ? AND pm.team_2_player_1 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_1,
              COUNT(DISTINCT CASE WHEN ((pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = ? AND pm.team_2_player_1 = ?) OR
                                       (pc2.pokemon_2 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = ? AND pm.team_2_player_2 = ?) OR
                                       (pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = ? AND pm.team_1_player_1 = ?) OR
                                       (pc1.pokemon_2 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = ? AND pm.team_1_player_2 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_2,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_2 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = ? AND pm.team_1_player_2 = ?) OR
                                       (pc1.pokemon_3 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = ? AND pm.team_1_player_3 = ?) OR
                                       (pc2.pokemon_2 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = ? AND pm.team_2_player_2 = ?) OR
                                       (pc2.pokemon_3 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = ? AND pm.team_2_player_3 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_3,
              COUNT(DISTINCT CASE WHEN ((pc2.pokemon_3 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = ? AND pm.team_2_player_3 = ?) OR
                                       (pc2.pokemon_4 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = ? AND pm.team_2_player_4 = ?) OR
                                       (pc1.pokemon_3 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = ? AND pm.team_1_player_3 = ?) OR
                                       (pc1.pokemon_4 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = ? AND pm.team_1_player_4 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_4,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_4 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = ? AND pm.team_1_player_4 = ?) OR
                                       (pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = ? AND pm.team_1_player_5 = ?) OR
                                       (pc2.pokemon_4 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = ? AND pm.team_2_player_4 = ?) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = ? AND pm.team_2_player_5 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_5,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = ? AND pm.team_1_player_5 = ?) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = ? AND pm.team_2_player_5 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_6
            `;  
            
            // Add all the parameters for the complex SELECT columns
            selectParams = [
              team, player, player, player, player, player, 
              team, player, player, player, player, player, 
              team, player, player, player, player, player, 
              team, player, player, player, player, player, 
              team, player, player, player, player, player, 
              team, player, player, player, player, player, 
              team, player, team, player, team, player, team, player, team, player,
              team, player, team, player, team, player, team, player, team, player,
              team, player, team, player, team, player, team, player, team, player,
              team, player, team, player, team, player, team, player, team, player
            ];
          } else if (region && player) {
            selectSQL += `,
              COUNT(DISTINCT CASE WHEN (pt1.team_region = ? AND 
                                       ((pc1.pokemon_1 = pc.pokemon_id AND pm.team_1_player_1 = ?) OR 
                                        (pc1.pokemon_2 = pc.pokemon_id AND pm.team_1_player_2 = ?) OR 
                                        (pc1.pokemon_3 = pc.pokemon_id AND pm.team_1_player_3 = ?) OR 
                                        (pc1.pokemon_4 = pc.pokemon_id AND pm.team_1_player_4 = ?) OR 
                                        (pc1.pokemon_5 = pc.pokemon_id AND pm.team_1_player_5 = ?))) OR
                                       (pt2.team_region = ? AND
                                       ((pc2.pokemon_1 = pc.pokemon_id AND pm.team_2_player_1 = ?) OR 
                                        (pc2.pokemon_2 = pc.pokemon_id AND pm.team_2_player_2 = ?) OR 
                                        (pc2.pokemon_3 = pc.pokemon_id AND pm.team_2_player_3 = ?) OR 
                                        (pc2.pokemon_4 = pc.pokemon_id AND pm.team_2_player_4 = ?) OR 
                                        (pc2.pokemon_5 = pc.pokemon_id AND pm.team_2_player_5 = ?)))
                                       THEN pm.match_id ELSE NULL END) as picks,
              COUNT(DISTINCT CASE WHEN (pt1.team_region = ? AND pc1.did_win = 1 AND
                                       ((pc1.pokemon_1 = pc.pokemon_id AND pm.team_1_player_1 = ?) OR 
                                        (pc1.pokemon_2 = pc.pokemon_id AND pm.team_1_player_2 = ?) OR 
                                        (pc1.pokemon_3 = pc.pokemon_id AND pm.team_1_player_3 = ?) OR 
                                        (pc1.pokemon_4 = pc.pokemon_id AND pm.team_1_player_4 = ?) OR 
                                        (pc1.pokemon_5 = pc.pokemon_id AND pm.team_1_player_5 = ?))) OR
                                       (pt2.team_region = ? AND pc2.did_win = 1 AND
                                       ((pc2.pokemon_1 = pc.pokemon_id AND pm.team_2_player_1 = ?) OR 
                                        (pc2.pokemon_2 = pc.pokemon_id AND pm.team_2_player_2 = ?) OR 
                                        (pc2.pokemon_3 = pc.pokemon_id AND pm.team_2_player_3 = ?) OR 
                                        (pc2.pokemon_4 = pc.pokemon_id AND pm.team_2_player_4 = ?) OR 
                                        (pc2.pokemon_5 = pc.pokemon_id AND pm.team_2_player_5 = ?)))
                                       THEN pm.match_id ELSE NULL END) as wins,
              SUM(CASE WHEN ((pm.team_1_ban_1 = pc.pokemon_id OR pm.team_1_ban_2 = pc.pokemon_id) AND pt1.team_region = ? AND (pm.team_1_player_1 = ? OR pm.team_1_player_2 = ? OR pm.team_1_player_3 = ? OR pm.team_1_player_4 = ? OR pm.team_1_player_5 = ?)) OR
                            ((pm.team_2_ban_1 = pc.pokemon_id OR pm.team_2_ban_2 = pc.pokemon_id) AND pt2.team_region = ? AND (pm.team_2_player_1 = ? OR pm.team_2_player_2 = ? OR pm.team_2_player_3 = ? OR pm.team_2_player_4 = ? OR pm.team_2_player_5 = ?))
                       THEN 1 ELSE 0 END) as bans,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 1 AND pt1.team_region = ? AND pm.team_1_player_1 = ?) OR
                                       (pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 1 AND pt2.team_region = ? AND pm.team_2_player_1 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_1,
              COUNT(DISTINCT CASE WHEN ((pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 0 AND pt2.team_region = ? AND pm.team_2_player_1 = ?) OR
                                       (pc2.pokemon_2 = pc.pokemon_id AND pc2.first_pick = 0 AND pt2.team_region = ? AND pm.team_2_player_2 = ?) OR
                                       (pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 0 AND pt1.team_region = ? AND pm.team_1_player_1 = ?) OR
                                       (pc1.pokemon_2 = pc.pokemon_id AND pc1.first_pick = 0 AND pt1.team_region = ? AND pm.team_1_player_2 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_2,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_2 = pc.pokemon_id AND pc1.first_pick = 1 AND pt1.team_region = ? AND pm.team_1_player_2 = ?) OR
                                       (pc1.pokemon_3 = pc.pokemon_id AND pc1.first_pick = 1 AND pt1.team_region = ? AND pm.team_1_player_3 = ?) OR
                                       (pc2.pokemon_2 = pc.pokemon_id AND pc2.first_pick = 1 AND pt2.team_region = ? AND pm.team_2_player_2 = ?) OR
                                       (pc2.pokemon_3 = pc.pokemon_id AND pc2.first_pick = 1 AND pt2.team_region = ? AND pm.team_2_player_3 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_3,
              COUNT(DISTINCT CASE WHEN ((pc2.pokemon_3 = pc.pokemon_id AND pc2.first_pick = 0 AND pt2.team_region = ? AND pm.team_2_player_3 = ?) OR
                                       (pc2.pokemon_4 = pc.pokemon_id AND pc2.first_pick = 0 AND pt2.team_region = ? AND pm.team_2_player_4 = ?) OR
                                       (pc1.pokemon_3 = pc.pokemon_id AND pc1.first_pick = 0 AND pt1.team_region = ? AND pm.team_1_player_3 = ?) OR
                                       (pc1.pokemon_4 = pc.pokemon_id AND pc1.first_pick = 0 AND pt1.team_region = ? AND pm.team_1_player_4 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_4,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_4 = pc.pokemon_id AND pc1.first_pick = 1 AND pt1.team_region = ? AND pm.team_1_player_4 = ?) OR
                                       (pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 1 AND pt1.team_region = ? AND pm.team_1_player_5 = ?) OR
                                       (pc2.pokemon_4 = pc.pokemon_id AND pc2.first_pick = 1 AND pt2.team_region = ? AND pm.team_2_player_4 = ?) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 1 AND pt2.team_region = ? AND pm.team_2_player_5 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_5,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 0 AND pt1.team_region = ? AND pm.team_1_player_5 = ?) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 0 AND pt2.team_region = ? AND pm.team_2_player_5 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_6
            `;  
            
            // Add all the parameters for the complex SELECT columns
            selectParams = [
              region, player, player, player, player, player, 
              region, player, player, player, player, player, 
              region, player, player, player, player, player, 
              region, player, player, player, player, player, 
              region, player, player, player, player, player, 
              region, player, player, player, player, player, 
              region, player, region, player, region, player, region, player, region, player,
              region, player, region, player, region, player, region, player, region, player,
              region, player, region, player, region, player, region, player, region, player,
              region, player, region, player, region, player, region, player, region, player
            ];
          } else if (team) {
            selectSQL += `,
              COUNT(DISTINCT CASE WHEN ((pm.team_1_id = ? AND (pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id)) OR
                                      (pm.team_2_id = ? AND (pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id)))
                                       THEN pm.match_id ELSE NULL END) as picks,
              COUNT(DISTINCT CASE WHEN ((pm.team_1_id = ? AND pc1.did_win = 1 AND (pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id)) OR
                                      (pm.team_2_id = ? AND pc2.did_win = 1 AND (pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id)))
                                       THEN pm.match_id ELSE NULL END) as wins,
              SUM(CASE WHEN (((pm.team_1_ban_1 = pc.pokemon_id OR pm.team_1_ban_2 = pc.pokemon_id) AND pt1.team_id = ?) OR
                            ((pm.team_2_ban_1 = pc.pokemon_id OR pm.team_2_ban_2 = pc.pokemon_id) AND pt2.team_id = ?))
                       THEN 1 ELSE 0 END) as bans,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = ?) OR
                                       (pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_1,
              COUNT(DISTINCT CASE WHEN (((pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id) AND pc2.first_pick = 0 AND pm.team_2_id = ?) OR
                                       ((pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id) AND pc1.first_pick = 0 AND pm.team_1_id = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_2,
              COUNT(DISTINCT CASE WHEN (((pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id) AND pc1.first_pick = 1 AND pm.team_1_id = ?) OR
                                       ((pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id) AND pc2.first_pick = 1 AND pm.team_2_id = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_3,
              COUNT(DISTINCT CASE WHEN (((pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id) AND pc2.first_pick = 0 AND pm.team_2_id = ?) OR
                                       ((pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id) AND pc1.first_pick = 0 AND pm.team_1_id = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_4,
              COUNT(DISTINCT CASE WHEN (((pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id) AND pc1.first_pick = 1 AND pm.team_1_id = ?) OR
                                       ((pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id) AND pc2.first_pick = 1 AND pm.team_2_id = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_5,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = ?) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_6
            `;  
            
            // Add all the parameters for the complex SELECT columns
            selectParams = [
              team, team, team, team, team, team,
              team, team, team, team, team, team,
              team, team, team, team, team, team
            ];
          } else if (region) {
            selectSQL += `,
              COUNT(DISTINCT CASE WHEN ((pt1.team_region = ? AND (pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id)) OR
                                      (pt2.team_region = ? AND (pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id)))
                                       THEN pm.match_id ELSE NULL END) as picks,
              COUNT(DISTINCT CASE WHEN ((pt1.team_region = ? AND pc1.did_win = 1 AND (pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id)) OR
                                      (pt2.team_region = ? AND pc2.did_win = 1 AND (pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id)))
                                       THEN pm.match_id ELSE NULL END) as wins,
              SUM(CASE WHEN (((pm.team_1_ban_1 = pc.pokemon_id OR pm.team_1_ban_2 = pc.pokemon_id) AND pt1.team_region = ?) OR
                            ((pm.team_2_ban_1 = pc.pokemon_id OR pm.team_2_ban_2 = pc.pokemon_id) AND pt2.team_region = ?))
                       THEN 1 ELSE 0 END) as bans,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 1 AND pt1.team_region = ?) OR
                                       (pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 1 AND pt2.team_region = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_1,
              COUNT(DISTINCT CASE WHEN (((pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id) AND pc2.first_pick = 0 AND pt2.team_region = ?) OR
                                       ((pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id) AND pc1.first_pick = 0 AND pt1.team_region = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_2,
              COUNT(DISTINCT CASE WHEN (((pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id) AND pc1.first_pick = 1 AND pt1.team_region = ?) OR
                                       ((pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id) AND pc2.first_pick = 1 AND pt2.team_region = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_3,
              COUNT(DISTINCT CASE WHEN (((pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id) AND pc2.first_pick = 0 AND pt2.team_region = ?) OR
                                       ((pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id) AND pc1.first_pick = 0 AND pt1.team_region = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_4,
              COUNT(DISTINCT CASE WHEN (((pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id) AND pc1.first_pick = 1 AND pt1.team_region = ?) OR
                                       ((pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id) AND pc2.first_pick = 1 AND pt2.team_region = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_5,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 0 AND pt1.team_region = ?) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 0 AND pt2.team_region = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_6
            `;  
            
            // Add all the parameters for the complex SELECT columns
            selectParams = [
              region, region, region, region, region, region,
              region, region, region, region, region, region,
              region, region, region, region, region, region
            ];
          } else if (player) {
            selectSQL += `,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_1 = pc.pokemon_id AND pm.team_1_player_1 = ?) OR 
                                        (pc1.pokemon_2 = pc.pokemon_id AND pm.team_1_player_2 = ?) OR 
                                        (pc1.pokemon_3 = pc.pokemon_id AND pm.team_1_player_3 = ?) OR 
                                        (pc1.pokemon_4 = pc.pokemon_id AND pm.team_1_player_4 = ?) OR 
                                        (pc1.pokemon_5 = pc.pokemon_id AND pm.team_1_player_5 = ?) OR
                                        (pc2.pokemon_1 = pc.pokemon_id AND pm.team_2_player_1 = ?) OR 
                                        (pc2.pokemon_2 = pc.pokemon_id AND pm.team_2_player_2 = ?) OR 
                                        (pc2.pokemon_3 = pc.pokemon_id AND pm.team_2_player_3 = ?) OR 
                                        (pc2.pokemon_4 = pc.pokemon_id AND pm.team_2_player_4 = ?) OR 
                                        (pc2.pokemon_5 = pc.pokemon_id AND pm.team_2_player_5 = ?))
                                       THEN pm.match_id ELSE NULL END) as picks,
              COUNT(DISTINCT CASE WHEN (pc1.did_win = 1 AND
                                       ((pc1.pokemon_1 = pc.pokemon_id AND pm.team_1_player_1 = ?) OR 
                                        (pc1.pokemon_2 = pc.pokemon_id AND pm.team_1_player_2 = ?) OR 
                                        (pc1.pokemon_3 = pc.pokemon_id AND pm.team_1_player_3 = ?) OR 
                                        (pc1.pokemon_4 = pc.pokemon_id AND pm.team_1_player_4 = ?) OR 
                                        (pc1.pokemon_5 = pc.pokemon_id AND pm.team_1_player_5 = ?))) OR
                                       (pc2.did_win = 1 AND
                                       ((pc2.pokemon_1 = pc.pokemon_id AND pm.team_2_player_1 = ?) OR 
                                        (pc2.pokemon_2 = pc.pokemon_id AND pm.team_2_player_2 = ?) OR 
                                        (pc2.pokemon_3 = pc.pokemon_id AND pm.team_2_player_3 = ?) OR 
                                        (pc2.pokemon_4 = pc.pokemon_id AND pm.team_2_player_4 = ?) OR 
                                        (pc2.pokemon_5 = pc.pokemon_id AND pm.team_2_player_5 = ?)))
                                       THEN pm.match_id ELSE NULL END) as wins,
              SUM(CASE WHEN ((pm.team_1_ban_1 = pc.pokemon_id OR pm.team_1_ban_2 = pc.pokemon_id) AND (pm.team_1_player_1 = ? OR pm.team_1_player_2 = ? OR pm.team_1_player_3 = ? OR pm.team_1_player_4 = ? OR pm.team_1_player_5 = ?)) OR
                            ((pm.team_2_ban_1 = pc.pokemon_id OR pm.team_2_ban_2 = pc.pokemon_id) AND (pm.team_2_player_1 = ? OR pm.team_2_player_2 = ? OR pm.team_2_player_3 = ? OR pm.team_2_player_4 = ? OR pm.team_2_player_5 = ?))
                       THEN 1 ELSE 0 END) as bans,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_player_1 = ?) OR
                                       (pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_player_1 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_1,
              COUNT(DISTINCT CASE WHEN ((pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_player_1 = ?) OR
                                       (pc2.pokemon_2 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_player_2 = ?) OR
                                       (pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_player_1 = ?) OR
                                       (pc1.pokemon_2 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_player_2 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_2,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_2 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_player_2 = ?) OR
                                       (pc1.pokemon_3 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_player_3 = ?) OR
                                       (pc2.pokemon_2 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_player_2 = ?) OR
                                       (pc2.pokemon_3 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_player_3 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_3,
              COUNT(DISTINCT CASE WHEN ((pc2.pokemon_3 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_player_3 = ?) OR
                                       (pc2.pokemon_4 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_player_4 = ?) OR
                                       (pc1.pokemon_3 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_player_3 = ?) OR
                                       (pc1.pokemon_4 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_player_4 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_4,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_4 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_player_4 = ?) OR
                                       (pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_player_5 = ?) OR
                                       (pc2.pokemon_4 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_player_4 = ?) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_player_5 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_5,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_player_5 = ?) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_player_5 = ?))
                                      THEN pm.match_id ELSE NULL END) as pick_round_6
            `;  
            
            // Add all the parameters for the complex SELECT columns
            selectParams = [
              player, player, player, player, player, 
              player, player, player, player, player, 
              player, player, player, player, player, 
              player, player, player, player, player, 
              player, player, player, player, player, 
              player, player, player, player, player, 
              player, player, player, player, player,
              player, player, player, player, player,
              player, player, player, player, player,
              player, player, player, player, player
            ];
          } else {
            // None of the complex filters are provided
            selectSQL += `,
              COUNT(DISTINCT CASE WHEN (pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id OR
                                      pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id)
                                      THEN pm.match_id ELSE NULL END) as picks,
              COUNT(DISTINCT CASE WHEN (pc1.did_win = 1 AND (pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id)) OR
                                      (pc2.did_win = 1 AND (pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id))
                                      THEN pm.match_id ELSE NULL END) as wins,
              SUM(CASE WHEN (pm.team_1_ban_1 = pc.pokemon_id OR pm.team_1_ban_2 = pc.pokemon_id OR pm.team_2_ban_1 = pc.pokemon_id OR pm.team_2_ban_2 = pc.pokemon_id)
                                      THEN 1 ELSE 0 END) as bans,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 1) OR
                                       (pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 1))
                                      THEN pm.match_id ELSE NULL END) as pick_round_1,
              COUNT(DISTINCT CASE WHEN (((pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id) AND pc2.first_pick = 0) OR
                                       ((pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id) AND pc1.first_pick = 0))
                                      THEN pm.match_id ELSE NULL END) as pick_round_2,
              COUNT(DISTINCT CASE WHEN (((pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id) AND pc1.first_pick = 1) OR
                                       ((pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id) AND pc2.first_pick = 1))
                                      THEN pm.match_id ELSE NULL END) as pick_round_3,
              COUNT(DISTINCT CASE WHEN (((pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id) AND pc2.first_pick = 0) OR
                                       ((pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id) AND pc1.first_pick = 0))
                                      THEN pm.match_id ELSE NULL END) as pick_round_4,
              COUNT(DISTINCT CASE WHEN (((pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id) AND pc1.first_pick = 1) OR
                                       ((pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id) AND pc2.first_pick = 1))
                                      THEN pm.match_id ELSE NULL END) as pick_round_5,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 0) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 0))
                                      THEN pm.match_id ELSE NULL END) as pick_round_6
            `;  
            
            // No params
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

      const moveStats = await new Promise((resolve, reject) => {
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
            LEFT JOIN
              pokemon_moves pm1 ON pm1.pokemon_id = pc.pokemon_id
            LEFT JOIN
              pokemon_moves pm2 ON pm2.pokemon_id = pc.pokemon_id
          `;

          // Where clause
          let whereSQL = `
            WHERE 1=1
            AND pm1.move_id < pm2.move_id
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
              pm1.move_name as move_1,
              pm2.move_name as move_2,
              COUNT(DISTINCT CASE WHEN 
                ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id) OR
                 (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id) OR
                 (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id) OR
                 (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id) OR
                 (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id) OR
                 (pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id) OR
                 (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id) OR
                 (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id) OR
                 (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id) OR
                 (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id))
              THEN pm.match_id ELSE NULL END) as usages,
              COUNT(DISTINCT CASE WHEN 
                (((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id) OR
                 (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id) OR
                 (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id) OR
                 (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id) OR
                 (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id)) AND
                 pc1.did_win = 1) OR
                (((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id) OR
                 (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id) OR
                 (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id) OR
                 (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id) OR
                 (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id)) AND
                 pc2.did_win = 1)
              THEN pm.match_id ELSE NULL END) as wins
          `;
          
          let selectParams = [];

          // Add team/region/player specific columns if all three are provided
          if (team && region && player) {
            selectSQL += `,
              COUNT(DISTINCT CASE WHEN 
                (((pm.team_1_id = ? AND pt1.team_region = ?) AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id AND pm.team_1_player_1 = ?) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id AND pm.team_1_player_2 = ?) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id AND pm.team_1_player_3 = ?) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id AND pm.team_1_player_4 = ?) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id AND pm.team_1_player_5 = ?))) OR
                 ((pm.team_2_id = ? AND pt2.team_region = ?) AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id AND pm.team_2_player_1 = ?) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id AND pm.team_2_player_2 = ?) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id AND pm.team_2_player_3 = ?) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id AND pm.team_2_player_4 = ?) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id AND pm.team_2_player_5 = ?))))
              THEN pm.match_id ELSE NULL END) as requested_usages,
              COUNT(DISTINCT CASE WHEN 
                (((pm.team_1_id = ? AND pt1.team_region = ? AND pc1.did_win = 1) AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id AND pm.team_1_player_1 = ?) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id AND pm.team_1_player_2 = ?) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id AND pm.team_1_player_3 = ?) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id AND pm.team_1_player_4 = ?) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id AND pm.team_1_player_5 = ?))) OR
                 ((pm.team_2_id = ? AND pt2.team_region = ? AND pc2.did_win = 1) AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id AND pm.team_2_player_1 = ?) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id AND pm.team_2_player_2 = ?) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id AND pm.team_2_player_3 = ?) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id AND pm.team_2_player_4 = ?) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id AND pm.team_2_player_5 = ?))))
              THEN pm.match_id ELSE NULL END) as requested_wins
            `;

            selectParams.push(
              team, region, player, player, player, player, player,
              team, region, player, player, player, player, player,
              team, region, player, player, player, player, player,
              team, region, player, player, player, player, player
            );
          } else if (team && region) {
            selectSQL += `,
              COUNT(DISTINCT CASE WHEN 
                (((pm.team_1_id = ? AND pt1.team_region = ?) AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id))) OR
                 ((pm.team_2_id = ? AND pt2.team_region = ?) AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id))))
              THEN pm.match_id ELSE NULL END) as requested_usages,
              COUNT(DISTINCT CASE WHEN 
                (((pm.team_1_id = ? AND pt1.team_region = ? AND pc1.did_win = 1) AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id))) OR
                 ((pm.team_2_id = ? AND pt2.team_region = ? AND pc2.did_win = 1) AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id))))
              THEN pm.match_id ELSE NULL END) as requested_wins
            `;

            selectParams.push(
              team, region,
              team, region,
              team, region,
              team, region
            );
          } else if (team && player) {
            selectSQL += `,
              COUNT(DISTINCT CASE WHEN 
                ((pm.team_1_id = ? AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id AND pm.team_1_player_1 = ?) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id AND pm.team_1_player_2 = ?) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id AND pm.team_1_player_3 = ?) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id AND pm.team_1_player_4 = ?) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id AND pm.team_1_player_5 = ?))) OR
                (pm.team_2_id = ? AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id AND pm.team_2_player_1 = ?) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id AND pm.team_2_player_2 = ?) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id AND pm.team_2_player_3 = ?) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id AND pm.team_2_player_4 = ?) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id AND pm.team_2_player_5 = ?))))
              THEN pm.match_id ELSE NULL END) as requested_usages,
              COUNT(DISTINCT CASE WHEN 
                (((pm.team_1_id = ? AND pc1.did_win = 1) AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id AND pm.team_1_player_1 = ?) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id AND pm.team_1_player_2 = ?) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id AND pm.team_1_player_3 = ?) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id AND pm.team_1_player_4 = ?) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id AND pm.team_1_player_5 = ?))) OR
                 ((pm.team_2_id = ? AND pc2.did_win = 1) AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id AND pm.team_2_player_1 = ?) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id AND pm.team_2_player_2 = ?) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id AND pm.team_2_player_3 = ?) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id AND pm.team_2_player_4 = ?) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id AND pm.team_2_player_5 = ?))))
              THEN pm.match_id ELSE NULL END) as requested_wins
            `;

            selectParams.push(
              team, player, player, player, player, player,
              team, player, player, player, player, player,
              team, player, player, player, player, player,
              team, player, player, player, player, player
            );
          } else if (region && player) {
            selectSQL += `,
              COUNT(DISTINCT CASE WHEN 
                ((pt1.team_region = ? AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id AND pm.team_1_player_1 = ?) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id AND pm.team_1_player_2 = ?) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id AND pm.team_1_player_3 = ?) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id AND pm.team_1_player_4 = ?) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id AND pm.team_1_player_5 = ?))) OR
                 (pt2.team_region = ? AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id AND pm.team_2_player_1 = ?) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id AND pm.team_2_player_2 = ?) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id AND pm.team_2_player_3 = ?) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id AND pm.team_2_player_4 = ?) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id AND pm.team_2_player_5 = ?))))
              THEN pm.match_id ELSE NULL END) as requested_usages,
              COUNT(DISTINCT CASE WHEN 
                (((pt1.team_region = ? AND pc1.did_win = 1) AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id AND pm.team_1_player_1 = ?) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id AND pm.team_1_player_2 = ?) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id AND pm.team_1_player_3 = ?) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id AND pm.team_1_player_4 = ?) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id AND pm.team_1_player_5 = ?))) OR
                 ((pt2.team_region = ? AND pc2.did_win = 1) AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id AND pm.team_2_player_1 = ?) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id AND pm.team_2_player_2 = ?) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id AND pm.team_2_player_3 = ?) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id AND pm.team_2_player_4 = ?) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id AND pm.team_2_player_5 = ?))))
              THEN pm.match_id ELSE NULL END) as requested_wins
            `;

            selectParams.push(
              region, player, player, player, player, player,
              region, player, player, player, player, player,
              region, player, player, player, player, player,
              region, player, player, player, player, player
            );
          } else if (team) {
            selectSQL += `,
              COUNT(DISTINCT CASE WHEN 
                ((pm.team_1_id = ? AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id))) OR
                 (pm.team_2_id = ? AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id))))
              THEN pm.match_id ELSE NULL END) as requested_usages,
              COUNT(DISTINCT CASE WHEN 
                (((pm.team_1_id = ? AND pc1.did_win = 1) AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id))) OR
                 ((pm.team_2_id = ? AND pc2.did_win = 1) AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id))))
              THEN pm.match_id ELSE NULL END) as requested_wins
            `;

            selectParams.push(
              team, team, team, team
            );
          } else if (region) {
            selectSQL += `,
              COUNT(DISTINCT CASE WHEN 
                ((pt1.team_region = ? AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id))) OR
                 (pt2.team_region = ? AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id))))
              THEN pm.match_id ELSE NULL END) as requested_usages,
              COUNT(DISTINCT CASE WHEN 
                (((pt1.team_region = ? AND pc1.did_win = 1) AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id))) OR
                 ((pt2.team_region = ? AND pc2.did_win = 1) AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id))))
              THEN pm.match_id ELSE NULL END) as requested_wins
            `;

            selectParams.push(
              region, region, region, region
            );
          } else if (player) {
            selectSQL += `,
              COUNT(DISTINCT CASE WHEN 
                (((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id AND pm.team_1_player_1 = ?) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id AND pm.team_1_player_2 = ?) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id AND pm.team_1_player_3 = ?) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id AND pm.team_1_player_4 = ?) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id AND pm.team_1_player_5 = ?)) OR
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id AND pm.team_2_player_1 = ?) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id AND pm.team_2_player_2 = ?) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id AND pm.team_2_player_3 = ?) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id AND pm.team_2_player_4 = ?) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id AND pm.team_2_player_5 = ?)))
              THEN pm.match_id ELSE NULL END) as requested_usages,
              COUNT(DISTINCT CASE WHEN 
                ((pc1.did_win = 1 AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id AND pm.team_1_player_1 = ?) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id AND pm.team_1_player_2 = ?) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id AND pm.team_1_player_3 = ?) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id AND pm.team_1_player_4 = ?) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id AND pm.team_1_player_5 = ?))) OR
                 (pc2.did_win = 1 AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id AND pm.team_2_player_1 = ?) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id AND pm.team_2_player_2 = ?) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id AND pm.team_2_player_3 = ?) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id AND pm.team_2_player_4 = ?) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id AND pm.team_2_player_5 = ?))))
              THEN pm.match_id ELSE NULL END) as requested_wins
            `;

            selectParams.push(
              player, player, player, player, player,
              player, player, player, player, player,
              player, player, player, player, player,
              player, player, player, player, player
            );
          } else {
            // None of the complex filters are provided
            // Same as the base SQL statement but with the names changed
            selectSQL = `
            SELECT 
              pc.pokemon_id,
              pc.pokemon_name,
              pm1.move_name as move_1,
              pm2.move_name as move_2,
              COUNT(DISTINCT CASE WHEN 
                ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id) OR
                 (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id) OR
                 (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id) OR
                 (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id) OR
                 (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id) OR
                 (pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id) OR
                 (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id) OR
                 (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id) OR
                 (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id) OR
                 (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id))
              THEN pm.match_id ELSE NULL END) as requested_usages,
              COUNT(DISTINCT CASE WHEN 
                (((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id) OR
                 (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id) OR
                 (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id) OR
                 (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id) OR
                 (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id)) AND
                 pc1.did_win = 1) OR
                (((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id) OR
                 (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id) OR
                 (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id) OR
                 (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id) OR
                 (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id)) AND
                 pc2.did_win = 1)
              THEN pm.match_id ELSE NULL END) as requested_wins
          `;
          }

          // Build and execute the final query
          const query = `
            ${selectSQL}
            ${fromSQL}
            ${whereSQL}
            GROUP BY pc.pokemon_id, pc.pokemon_name, pm1.move_name, pm2.move_name
            HAVING requested_usages > 0
            ORDER BY pc.pokemon_name, requested_usages DESC
          `;
          
          this.db.all(query, [...selectParams, ...whereParams], (err, rows) => {
            if (err) {
              console.error("SQL Error in moveStats:", err.message);
              // Resolve with empty array instead of rejecting to avoid failing the entire function
              resolve([]);
            } else {
              resolve(rows);
            }
          });
        } catch (error) {
          console.error("Function error in moveStats:", error.message);
          // Resolve with empty array instead of rejecting
          resolve([]);
        }
      });

      for (const row of pickBanStats) {
        // Find all rows where row.pokemon_id matches moveStats[x].pokemon_id and cumulate all of those objects
        const matchingRows = moveStats.filter(move => move.pokemon_id === row.pokemon_id);
        row.movesets = matchingRows;
        const doublePicks = row.picks * 1.0;
        const doubleBans = row.bans * 1.0;
        const doubleWins = row.wins * 1.0;
        const doubleTotalMatches = row.total_matches * 1.0;
        row.ban_rate = parseFloat(((doubleBans / doubleTotalMatches) * 100).toFixed(1));
        row.pick_rate = parseFloat(((doublePicks / doubleTotalMatches) * 100).toFixed(1));
        row.win_rate = parseFloat(((doubleWins / doublePicks) * 100).toFixed(1));
        row.presence = parseFloat((((doublePicks + doubleBans) / doubleTotalMatches) * 100).toFixed(1));
      }

      return pickBanStats;
    } 
}

module.exports = Characters;