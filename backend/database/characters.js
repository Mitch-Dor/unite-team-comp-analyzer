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
        this.db.query('SELECT pokemon_id, pokemon_name, pokemon_class, can_exp_share, can_top_lane_carry, can_jungle_carry, can_bottom_lane_carry FROM playable_characters NATURAL JOIN pokemon_attributes', (err, res) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(res.rows);
          }
        });
      });
    }    

    // pokemon_name, early_game, mid_game, late_game, mobility, range, bulk, damage, damage_type, damage_affect, cc, play_style, classification, other_attr, can_exp_share, can_top_lane_carry, can_jungle_carry, can_bottom_lane_carry, best_lane, assumed_move_1, assumed_move_2
    async getIndividualCharacterTraits(name){
      return new Promise((resolve, reject) => {
        this.db.query('select * from playable_attributes where pokemon_name = $1', [name], (err, res) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(res.rows);
          }
        });
      });
    }

    // pokemon_name, early_game, mid_game, late_game, mobility, range, bulk, damage, damage_type, damage_affect, cc, play_style, classification, other_attr, can_exp_share, can_top_lane_carry, can_jungle_carry, can_bottom_lane_carry, best_lane, assumed_move_1, assumed_move_2
    async getAllCharacterAttributes(){
      return new Promise((resolve, reject) => {
        this.db.query('select * from pokemon_attributes natural join playable_characters', (err, res) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(res.rows);
          }
        });
      });
    }

    // Update traits for a character
    async updateCharacterAttributes(character, traits) {
      return new Promise((resolve, reject) => {
        const sql = `UPDATE pokemon_attributes SET 
                    early_game = $1, 
                    mid_game = $2, 
                    late_game = $3, 
                    mobility = $4, 
                    range = $5, 
                    bulk = $6, 
                    damage = $7, 
                    damage_type = $8, 
                    damage_affect = $9, 
                    cc = $10, 
                    play_style = $11, 
                    classification = $12, 
                    other_attr = $13, 
                    can_exp_share = $14, 
                    can_top_lane_carry = $15, 
                    can_jungle_carry = $16, 
                    can_bottom_lane_carry = $17, 
                    best_lane = $18, 
                    assumed_move_1 = $19, 
                    assumed_move_2 = $20 
                    WHERE pokemon_id = $21`;
        
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
        
        this.db.query(sql, params, function(err, res) {
          if (err) {
            console.error("SQL Error:", err.message);
            reject(err);
          } else {
            resolve({ changes: res.changes, message: 'Character attributes updated successfully' });
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
              COUNT(DISTINCT CASE WHEN ((pm.team_1_id = $${selectParams.length + 1} AND pt1.team_region = $${selectParams.length + 2}) AND 
                                       ((pc1.pokemon_1 = pc.pokemon_id AND pm.team_1_player_1 = $${selectParams.length + 3}) OR 
                                        (pc1.pokemon_2 = pc.pokemon_id AND pm.team_1_player_2 = $${selectParams.length + 4}) OR 
                                        (pc1.pokemon_3 = pc.pokemon_id AND pm.team_1_player_3 = $${selectParams.length + 5}) OR 
                                        (pc1.pokemon_4 = pc.pokemon_id AND pm.team_1_player_4 = $${selectParams.length + 6}) OR 
                                        (pc1.pokemon_5 = pc.pokemon_id AND pm.team_1_player_5 = $${selectParams.length + 7})))) OR
                                      ((pm.team_2_id = $${selectParams.length + 8} AND pt2.team_region = $${selectParams.length + 9}) AND
                                       ((pc2.pokemon_1 = pc.pokemon_id AND pm.team_2_player_1 = $${selectParams.length + 10}) OR 
                                        (pc2.pokemon_2 = pc.pokemon_id AND pm.team_2_player_2 = $${selectParams.length + 11}) OR 
                                        (pc2.pokemon_3 = pc.pokemon_id AND pm.team_2_player_3 = $${selectParams.length + 12}) OR 
                                        (pc2.pokemon_4 = pc.pokemon_id AND pm.team_2_player_4 = $${selectParams.length + 13}) OR 
                                        (pc2.pokemon_5 = pc.pokemon_id AND pm.team_2_player_5 = $${selectParams.length + 14}))))
                                       THEN pm.match_id ELSE NULL END) as picks,
              COUNT(DISTINCT CASE WHEN ((pm.team_1_id = $${selectParams.length + 15} AND pt1.team_region = $${selectParams.length + 16} AND pc1.did_win = 1) AND 
                                       ((pc1.pokemon_1 = pc.pokemon_id AND pm.team_1_player_1 = $${selectParams.length + 17}) OR 
                                        (pc1.pokemon_2 = pc.pokemon_id AND pm.team_1_player_2 = $${selectParams.length + 18}) OR 
                                        (pc1.pokemon_3 = pc.pokemon_id AND pm.team_1_player_3 = $${selectParams.length + 19}) OR 
                                        (pc1.pokemon_4 = pc.pokemon_id AND pm.team_1_player_4 = $${selectParams.length + 20}) OR 
                                        (pc1.pokemon_5 = pc.pokemon_id AND pm.team_1_player_5 = $${selectParams.length + 21})))) OR
                                      ((pm.team_2_id = $${selectParams.length + 22} AND pt2.team_region = $${selectParams.length + 23} AND pc2.did_win = 1) AND
                                       ((pc2.pokemon_1 = pc.pokemon_id AND pm.team_2_player_1 = $${selectParams.length + 24}) OR 
                                        (pc2.pokemon_2 = pc.pokemon_id AND pm.team_2_player_2 = $${selectParams.length + 25}) OR 
                                        (pc2.pokemon_3 = pc.pokemon_id AND pm.team_2_player_3 = $${selectParams.length + 26}) OR 
                                        (pc2.pokemon_4 = pc.pokemon_id AND pm.team_2_player_4 = $${selectParams.length + 27}) OR 
                                        (pc2.pokemon_5 = pc.pokemon_id AND pm.team_2_player_5 = $${selectParams.length + 28}))))
                                       THEN pm.match_id ELSE NULL END) as wins,
              SUM(CASE WHEN ((pm.team_1_ban_1 = pc.pokemon_id OR pm.team_1_ban_2 = pc.pokemon_id) AND pt1.team_id = $${selectParams.length + 29} AND pt1.team_region = $${selectParams.length + 30} AND (pm.team_1_player_1 = $${selectParams.length + 31} OR pm.team_1_player_2 = $${selectParams.length + 32} OR pm.team_1_player_3 = $${selectParams.length + 33} OR pm.team_1_player_4 = $${selectParams.length + 34} OR pm.team_1_player_5 = $${selectParams.length + 35})) OR
                            ((pm.team_2_ban_1 = pc.pokemon_id OR pm.team_2_ban_2 = pc.pokemon_id) AND pt2.team_id = $${selectParams.length + 36} AND pt2.team_region = $${selectParams.length + 37} AND (pm.team_2_player_1 = $${selectParams.length + 38} OR pm.team_2_player_2 = $${selectParams.length + 39} OR pm.team_2_player_3 = $${selectParams.length + 40} OR pm.team_2_player_4 = $${selectParams.length + 41} OR pm.team_2_player_5 = $${selectParams.length + 42}))
                       THEN 1 ELSE 0 END) as bans,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = $${selectParams.length + 43} AND pt1.team_region = $${selectParams.length + 44} AND pm.team_1_player_1 = $${selectParams.length + 45}) OR
                                       (pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = $${selectParams.length + 46} AND pt2.team_region = $${selectParams.length + 47} AND pm.team_2_player_1 = $${selectParams.length + 48}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_1,
              COUNT(DISTINCT CASE WHEN ((pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = $${selectParams.length + 49} AND pt2.team_region = $${selectParams.length + 50} AND pm.team_2_player_1 = $${selectParams.length + 51}) OR
                                       (pc2.pokemon_2 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = $${selectParams.length + 52} AND pt2.team_region = $${selectParams.length + 53} AND pm.team_2_player_2 = $${selectParams.length + 54}) OR
                                       (pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = $${selectParams.length + 55} AND pt1.team_region = $${selectParams.length + 56} AND pm.team_1_player_1 = $${selectParams.length + 57}) OR
                                       (pc1.pokemon_2 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = $${selectParams.length + 58} AND pt1.team_region = $${selectParams.length + 59} AND pm.team_1_player_2 = $${selectParams.length + 60}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_2,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_2 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = $${selectParams.length + 61} AND pt1.team_region = $${selectParams.length + 62} AND pm.team_1_player_2 = $${selectParams.length + 63}) OR
                                       (pc1.pokemon_3 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = $${selectParams.length + 64} AND pt1.team_region = $${selectParams.length + 65} AND pm.team_1_player_3 = $${selectParams.length + 66}) OR
                                       (pc2.pokemon_2 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = $${selectParams.length + 67} AND pt2.team_region = $${selectParams.length + 68} AND pm.team_2_player_2 = $${selectParams.length + 69}) OR
                                       (pc2.pokemon_3 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = $${selectParams.length + 70} AND pt2.team_region = $${selectParams.length + 71} AND pm.team_2_player_3 = $${selectParams.length + 72}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_3,
              COUNT(DISTINCT CASE WHEN ((pc2.pokemon_3 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = $${selectParams.length + 73} AND pt2.team_region = $${selectParams.length + 74} AND pm.team_2_player_3 = $${selectParams.length + 75}) OR
                                       (pc2.pokemon_4 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = $${selectParams.length + 76} AND pt2.team_region = $${selectParams.length + 77} AND pm.team_2_player_4 = $${selectParams.length + 78}) OR
                                       (pc1.pokemon_3 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = $${selectParams.length + 79} AND pt1.team_region = $${selectParams.length + 80} AND pm.team_1_player_3 = $${selectParams.length + 81}) OR
                                       (pc1.pokemon_4 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = $${selectParams.length + 82} AND pt1.team_region = $${selectParams.length + 83} AND pm.team_1_player_4 = $${selectParams.length + 84}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_4,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_4 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = $${selectParams.length + 85} AND pt1.team_region = $${selectParams.length + 86} AND pm.team_1_player_4 = $${selectParams.length + 87}) OR
                                       (pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = $${selectParams.length + 88} AND pt1.team_region = $${selectParams.length + 89} AND pm.team_1_player_5 = $${selectParams.length + 90}) OR
                                       (pc2.pokemon_4 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = $${selectParams.length + 91} AND pt2.team_region = $${selectParams.length + 92} AND pm.team_2_player_4 = $${selectParams.length + 93}) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = $${selectParams.length + 94} AND pt2.team_region = $${selectParams.length + 95} AND pm.team_2_player_5 = $${selectParams.length + 96}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_5,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = $${selectParams.length + 97} AND pt1.team_region = $${selectParams.length + 98} AND pm.team_1_player_5 = $${selectParams.length + 99}) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = $${selectParams.length + 100} AND pt2.team_region = $${selectParams.length + 101} AND pm.team_2_player_5 = $${selectParams.length + 102}))
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
              COUNT(DISTINCT CASE WHEN ((pm.team_1_id = $${selectParams.length + 1} AND pt1.team_region = $${selectParams.length + 2} AND (pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id)) OR
                                      (pm.team_2_id = $${selectParams.length + 3} AND pt2.team_region = $${selectParams.length + 4} AND (pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id)))
                                       THEN pm.match_id ELSE NULL END) as picks,
              COUNT(DISTINCT CASE WHEN ((pm.team_1_id = $${selectParams.length + 5} AND pt1.team_region = $${selectParams.length + 6} AND pc1.did_win = 1 AND (pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id)) OR
                                      (pm.team_2_id = $${selectParams.length + 7} AND pt2.team_region = $${selectParams.length + 8} AND pc2.did_win = 1 AND (pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id)))
                                       THEN pm.match_id ELSE NULL END) as wins,
              SUM(CASE WHEN (((pm.team_1_ban_1 = pc.pokemon_id OR pm.team_1_ban_2 = pc.pokemon_id) AND pt1.team_id = $${selectParams.length + 9} AND pt1.team_region = $${selectParams.length + 10}) OR
                            ((pm.team_2_ban_1 = pc.pokemon_id OR pm.team_2_ban_2 = pc.pokemon_id) AND pt2.team_id = $${selectParams.length + 11} AND pt2.team_region = $${selectParams.length + 12}))
                       THEN 1 ELSE 0 END) as bans,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = $${selectParams.length + 13} AND pt1.team_region = $${selectParams.length + 14}) OR
                                       (pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = $${selectParams.length + 15} AND pt2.team_region = $${selectParams.length + 16}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_1,
              COUNT(DISTINCT CASE WHEN (((pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id) AND pc2.first_pick = 0 AND pm.team_2_id = $${selectParams.length + 17} AND pt2.team_region = $${selectParams.length + 18}) OR
                                       ((pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id) AND pc1.first_pick = 0 AND pm.team_1_id = $${selectParams.length + 19} AND pt1.team_region = $${selectParams.length + 20}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_2,
              COUNT(DISTINCT CASE WHEN (((pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id) AND pc1.first_pick = 1 AND pm.team_1_id = $${selectParams.length + 21} AND pt1.team_region = $${selectParams.length + 22}) OR
                                       ((pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id) AND pc2.first_pick = 1 AND pm.team_2_id = $${selectParams.length + 23} AND pt2.team_region = $${selectParams.length + 24}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_3,
              COUNT(DISTINCT CASE WHEN (((pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id) AND pc2.first_pick = 0 AND pm.team_2_id = $${selectParams.length + 25} AND pt2.team_region = $${selectParams.length + 26}) OR
                                       ((pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id) AND pc1.first_pick = 0 AND pm.team_1_id = $${selectParams.length + 27} AND pt1.team_region = $${selectParams.length + 28}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_4,
              COUNT(DISTINCT CASE WHEN (((pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id) AND pc1.first_pick = 1 AND pm.team_1_id = $${selectParams.length + 29} AND pt1.team_region = $${selectParams.length + 30}) OR
                                       ((pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id) AND pc2.first_pick = 1 AND pm.team_2_id = $${selectParams.length + 31} AND pt2.team_region = $${selectParams.length + 32}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_5,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = $${selectParams.length + 33} AND pt1.team_region = $${selectParams.length + 34}) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = $${selectParams.length + 35} AND pt2.team_region = $${selectParams.length + 36}))
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
              COUNT(DISTINCT CASE WHEN (pm.team_1_id = $${selectParams.length + 1} AND 
                                       ((pc1.pokemon_1 = pc.pokemon_id AND pm.team_1_player_1 = $${selectParams.length + 2}) OR 
                                        (pc1.pokemon_2 = pc.pokemon_id AND pm.team_1_player_2 = $${selectParams.length + 3}) OR 
                                        (pc1.pokemon_3 = pc.pokemon_id AND pm.team_1_player_3 = $${selectParams.length + 4}) OR 
                                        (pc1.pokemon_4 = pc.pokemon_id AND pm.team_1_player_4 = $${selectParams.length + 5}) OR 
                                        (pc1.pokemon_5 = pc.pokemon_id AND pm.team_1_player_5 = $${selectParams.length + 6}))) OR
                                       (pm.team_2_id = $${selectParams.length + 7} AND 
                                       ((pc2.pokemon_1 = pc.pokemon_id AND pm.team_2_player_1 = $${selectParams.length + 8}) OR 
                                        (pc2.pokemon_2 = pc.pokemon_id AND pm.team_2_player_2 = $${selectParams.length + 9}) OR 
                                        (pc2.pokemon_3 = pc.pokemon_id AND pm.team_2_player_3 = $${selectParams.length + 10}) OR 
                                        (pc2.pokemon_4 = pc.pokemon_id AND pm.team_2_player_4 = $${selectParams.length + 11}) OR 
                                        (pc2.pokemon_5 = pc.pokemon_id AND pm.team_2_player_5 = $${selectParams.length + 12})))
                                       THEN pm.match_id ELSE NULL END) as picks,
              COUNT(DISTINCT CASE WHEN ((pm.team_1_id = $${selectParams.length + 13} AND pc1.did_win = 1) AND 
                                       ((pc1.pokemon_1 = pc.pokemon_id AND pm.team_1_player_1 = $${selectParams.length + 14}) OR 
                                        (pc1.pokemon_2 = pc.pokemon_id AND pm.team_1_player_2 = $${selectParams.length + 15}) OR 
                                        (pc1.pokemon_3 = pc.pokemon_id AND pm.team_1_player_3 = $${selectParams.length + 16}) OR 
                                        (pc1.pokemon_4 = pc.pokemon_id AND pm.team_1_player_4 = $${selectParams.length + 17}) OR 
                                        (pc1.pokemon_5 = pc.pokemon_id AND pm.team_1_player_5 = $${selectParams.length + 18}))) OR
                                      ((pm.team_2_id = $${selectParams.length + 19} AND pc2.did_win = 1) AND
                                       ((pc2.pokemon_1 = pc.pokemon_id AND pm.team_2_player_1 = $${selectParams.length + 20}) OR 
                                        (pc2.pokemon_2 = pc.pokemon_id AND pm.team_2_player_2 = $${selectParams.length + 21}) OR 
                                        (pc2.pokemon_3 = pc.pokemon_id AND pm.team_2_player_3 = $${selectParams.length + 22}) OR 
                                        (pc2.pokemon_4 = pc.pokemon_id AND pm.team_2_player_4 = $${selectParams.length + 23}) OR 
                                        (pc2.pokemon_5 = pc.pokemon_id AND pm.team_2_player_5 = $${selectParams.length + 24})))
                                       THEN pm.match_id ELSE NULL END) as wins,
              SUM(CASE WHEN ((pm.team_1_ban_1 = pc.pokemon_id OR pm.team_1_ban_2 = pc.pokemon_id) AND pt1.team_id = $${selectParams.length + 25} AND (pm.team_1_player_1 = $${selectParams.length + 26} OR pm.team_1_player_2 = $${selectParams.length + 27} OR pm.team_1_player_3 = $${selectParams.length + 28} OR pm.team_1_player_4 = $${selectParams.length + 29} OR pm.team_1_player_5 = $${selectParams.length + 30})) OR
                            ((pm.team_2_ban_1 = pc.pokemon_id OR pm.team_2_ban_2 = pc.pokemon_id) AND pt2.team_id = $${selectParams.length + 31} AND (pm.team_2_player_1 = $${selectParams.length + 32} OR pm.team_2_player_2 = $${selectParams.length + 33} OR pm.team_2_player_3 = $${selectParams.length + 34} OR pm.team_2_player_4 = $${selectParams.length + 35} OR pm.team_2_player_5 = $${selectParams.length + 36}))
                       THEN 1 ELSE 0 END) as bans,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = $${selectParams.length + 37} AND pm.team_1_player_1 = $${selectParams.length + 38}) OR
                                       (pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = $${selectParams.length + 39} AND pm.team_2_player_1 = $${selectParams.length + 40}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_1,
              COUNT(DISTINCT CASE WHEN ((pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = $${selectParams.length + 41} AND pm.team_2_player_1 = $${selectParams.length + 42}) OR
                                       (pc2.pokemon_2 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = $${selectParams.length + 43} AND pm.team_2_player_2 = $${selectParams.length + 44}) OR
                                       (pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = $${selectParams.length + 45} AND pm.team_1_player_1 = $${selectParams.length + 46}) OR
                                       (pc1.pokemon_2 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = $${selectParams.length + 47} AND pm.team_1_player_2 = $${selectParams.length + 48}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_2,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_2 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = $${selectParams.length + 49} AND pm.team_1_player_2 = $${selectParams.length + 50}) OR
                                       (pc1.pokemon_3 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = $${selectParams.length + 51} AND pm.team_1_player_3 = $${selectParams.length + 52}) OR
                                       (pc2.pokemon_2 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = $${selectParams.length + 53} AND pm.team_2_player_2 = $${selectParams.length + 54}) OR
                                       (pc2.pokemon_3 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = $${selectParams.length + 55} AND pm.team_2_player_3 = $${selectParams.length + 56}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_3,
              COUNT(DISTINCT CASE WHEN ((pc2.pokemon_3 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = $${selectParams.length + 57} AND pm.team_2_player_3 = $${selectParams.length + 58}) OR
                                       (pc2.pokemon_4 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = $${selectParams.length + 59} AND pm.team_2_player_4 = $${selectParams.length + 60}) OR
                                       (pc1.pokemon_3 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = $${selectParams.length + 61} AND pm.team_1_player_3 = $${selectParams.length + 62}) OR
                                       (pc1.pokemon_4 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = $${selectParams.length + 63} AND pm.team_1_player_4 = $${selectParams.length + 64}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_4,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_4 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = $${selectParams.length + 65} AND pm.team_1_player_4 = $${selectParams.length + 66}) OR
                                       (pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = $${selectParams.length + 67} AND pm.team_1_player_5 = $${selectParams.length + 68}) OR
                                       (pc2.pokemon_4 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = $${selectParams.length + 69} AND pm.team_2_player_4 = $${selectParams.length + 70}) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = $${selectParams.length + 71} AND pm.team_2_player_5 = $${selectParams.length + 72}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_5,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = $${selectParams.length + 73} AND pm.team_1_player_5 = $${selectParams.length + 74}) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = $${selectParams.length + 75} AND pm.team_2_player_5 = $${selectParams.length + 76}))
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
              COUNT(DISTINCT CASE WHEN (pt1.team_region = $${selectParams.length + 1} AND 
                                       ((pc1.pokemon_1 = pc.pokemon_id AND pm.team_1_player_1 = $${selectParams.length + 2}) OR 
                                        (pc1.pokemon_2 = pc.pokemon_id AND pm.team_1_player_2 = $${selectParams.length + 3}) OR 
                                        (pc1.pokemon_3 = pc.pokemon_id AND pm.team_1_player_3 = $${selectParams.length + 4}) OR 
                                        (pc1.pokemon_4 = pc.pokemon_id AND pm.team_1_player_4 = $${selectParams.length + 5}) OR 
                                        (pc1.pokemon_5 = pc.pokemon_id AND pm.team_1_player_5 = $${selectParams.length + 6}))) OR
                                       (pt2.team_region = $${selectParams.length + 7} AND
                                       ((pc2.pokemon_1 = pc.pokemon_id AND pm.team_2_player_1 = $${selectParams.length + 8}) OR 
                                        (pc2.pokemon_2 = pc.pokemon_id AND pm.team_2_player_2 = $${selectParams.length + 9}) OR 
                                        (pc2.pokemon_3 = pc.pokemon_id AND pm.team_2_player_3 = $${selectParams.length + 10}) OR 
                                        (pc2.pokemon_4 = pc.pokemon_id AND pm.team_2_player_4 = $${selectParams.length + 11}) OR 
                                        (pc2.pokemon_5 = pc.pokemon_id AND pm.team_2_player_5 = $${selectParams.length + 12})))
                                       THEN pm.match_id ELSE NULL END) as picks,
              COUNT(DISTINCT CASE WHEN (pt1.team_region = $${selectParams.length + 13} AND pc1.did_win = 1 AND
                                       ((pc1.pokemon_1 = pc.pokemon_id AND pm.team_1_player_1 = $${selectParams.length + 14}) OR 
                                        (pc1.pokemon_2 = pc.pokemon_id AND pm.team_1_player_2 = $${selectParams.length + 15}) OR 
                                        (pc1.pokemon_3 = pc.pokemon_id AND pm.team_1_player_3 = $${selectParams.length + 16}) OR 
                                        (pc1.pokemon_4 = pc.pokemon_id AND pm.team_1_player_4 = $${selectParams.length + 17}) OR 
                                        (pc1.pokemon_5 = pc.pokemon_id AND pm.team_1_player_5 = $${selectParams.length + 18}))) OR
                                       (pt2.team_region = $${selectParams.length + 19} AND pc2.did_win = 1 AND
                                       ((pc2.pokemon_1 = pc.pokemon_id AND pm.team_2_player_1 = $${selectParams.length + 20}) OR 
                                        (pc2.pokemon_2 = pc.pokemon_id AND pm.team_2_player_2 = $${selectParams.length + 21}) OR 
                                        (pc2.pokemon_3 = pc.pokemon_id AND pm.team_2_player_3 = $${selectParams.length + 22}) OR 
                                        (pc2.pokemon_4 = pc.pokemon_id AND pm.team_2_player_4 = $${selectParams.length + 23}) OR 
                                        (pc2.pokemon_5 = pc.pokemon_id AND pm.team_2_player_5 = $${selectParams.length + 24})))
                                       THEN pm.match_id ELSE NULL END) as wins,
              SUM(CASE WHEN ((pm.team_1_ban_1 = pc.pokemon_id OR pm.team_1_ban_2 = pc.pokemon_id) AND pt1.team_region = $${selectParams.length + 25} AND (pm.team_1_player_1 = $${selectParams.length + 26} OR pm.team_1_player_2 = $${selectParams.length + 27} OR pm.team_1_player_3 = $${selectParams.length + 28} OR pm.team_1_player_4 = $${selectParams.length + 29} OR pm.team_1_player_5 = $${selectParams.length + 30})) OR
                            ((pm.team_2_ban_1 = pc.pokemon_id OR pm.team_2_ban_2 = pc.pokemon_id) AND pt2.team_region = $${selectParams.length + 31} AND (pm.team_2_player_1 = $${selectParams.length + 32} OR pm.team_2_player_2 = $${selectParams.length + 33} OR pm.team_2_player_3 = $${selectParams.length + 34} OR pm.team_2_player_4 = $${selectParams.length + 35} OR pm.team_2_player_5 = $${selectParams.length + 36}))
                       THEN 1 ELSE 0 END) as bans,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 1 AND pt1.team_region = $${selectParams.length + 37} AND pm.team_1_player_1 = $${selectParams.length + 38}) OR
                                       (pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 1 AND pt2.team_region = $${selectParams.length + 39} AND pm.team_2_player_1 = $${selectParams.length + 40}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_1,
              COUNT(DISTINCT CASE WHEN ((pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 0 AND pt2.team_region = $${selectParams.length + 41} AND pm.team_2_player_1 = $${selectParams.length + 42}) OR
                                       (pc2.pokemon_2 = pc.pokemon_id AND pc2.first_pick = 0 AND pt2.team_region = $${selectParams.length + 43} AND pm.team_2_player_2 = $${selectParams.length + 44}) OR
                                       (pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 0 AND pt1.team_region = $${selectParams.length + 45} AND pm.team_1_player_1 = $${selectParams.length + 46}) OR
                                       (pc1.pokemon_2 = pc.pokemon_id AND pc1.first_pick = 0 AND pt1.team_region = $${selectParams.length + 47} AND pm.team_1_player_2 = $${selectParams.length + 48}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_2,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_2 = pc.pokemon_id AND pc1.first_pick = 1 AND pt1.team_region = $${selectParams.length + 49} AND pm.team_1_player_2 = $${selectParams.length + 50}) OR
                                       (pc1.pokemon_3 = pc.pokemon_id AND pc1.first_pick = 1 AND pt1.team_region = $${selectParams.length + 51} AND pm.team_1_player_3 = $${selectParams.length + 52}) OR
                                       (pc2.pokemon_2 = pc.pokemon_id AND pc2.first_pick = 1 AND pt2.team_region = $${selectParams.length + 53} AND pm.team_2_player_2 = $${selectParams.length + 54}) OR
                                       (pc2.pokemon_3 = pc.pokemon_id AND pc2.first_pick = 1 AND pt2.team_region = $${selectParams.length + 55} AND pm.team_2_player_3 = $${selectParams.length + 56}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_3,
              COUNT(DISTINCT CASE WHEN ((pc2.pokemon_3 = pc.pokemon_id AND pc2.first_pick = 0 AND pt2.team_region = $${selectParams.length + 57} AND pm.team_2_player_3 = $${selectParams.length + 58}) OR
                                       (pc2.pokemon_4 = pc.pokemon_id AND pc2.first_pick = 0 AND pt2.team_region = $${selectParams.length + 59} AND pm.team_2_player_4 = $${selectParams.length + 60}) OR
                                       (pc1.pokemon_3 = pc.pokemon_id AND pc1.first_pick = 0 AND pt1.team_region = $${selectParams.length + 61} AND pm.team_1_player_3 = $${selectParams.length + 62}) OR
                                       (pc1.pokemon_4 = pc.pokemon_id AND pc1.first_pick = 0 AND pt1.team_region = $${selectParams.length + 63} AND pm.team_1_player_4 = $${selectParams.length + 64}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_4,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_4 = pc.pokemon_id AND pc1.first_pick = 1 AND pt1.team_region = $${selectParams.length + 65} AND pm.team_1_player_4 = $${selectParams.length + 66}) OR
                                       (pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 1 AND pt1.team_region = $${selectParams.length + 67} AND pm.team_1_player_5 = $${selectParams.length + 68}) OR
                                       (pc2.pokemon_4 = pc.pokemon_id AND pc2.first_pick = 1 AND pt2.team_region = $${selectParams.length + 69} AND pm.team_2_player_4 = $${selectParams.length + 70}) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 1 AND pt2.team_region = $${selectParams.length + 71} AND pm.team_2_player_5 = $${selectParams.length + 72}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_5,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 0 AND pt1.team_region = $${selectParams.length + 73} AND pm.team_1_player_5 = $${selectParams.length + 74}) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 0 AND pt2.team_region = $${selectParams.length + 75} AND pm.team_2_player_5 = $${selectParams.length + 76}))
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
              COUNT(DISTINCT CASE WHEN ((pm.team_1_id = $${selectParams.length + 1} AND (pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id)) OR
                                      (pm.team_2_id = $${selectParams.length + 2} AND (pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id)))
                                       THEN pm.match_id ELSE NULL END) as picks,
              COUNT(DISTINCT CASE WHEN ((pm.team_1_id = $${selectParams.length + 3} AND pc1.did_win = 1 AND (pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id)) OR
                                      (pm.team_2_id = $${selectParams.length + 4} AND pc2.did_win = 1 AND (pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id)))
                                       THEN pm.match_id ELSE NULL END) as wins,
              SUM(CASE WHEN (((pm.team_1_ban_1 = pc.pokemon_id OR pm.team_1_ban_2 = pc.pokemon_id) AND pt1.team_id = $${selectParams.length + 5}) OR
                            ((pm.team_2_ban_1 = pc.pokemon_id OR pm.team_2_ban_2 = pc.pokemon_id) AND pt2.team_id = $${selectParams.length + 6}))
                       THEN 1 ELSE 0 END) as bans,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_id = $${selectParams.length + 7}) OR
                                       (pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_id = $${selectParams.length + 8}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_1,
              COUNT(DISTINCT CASE WHEN (((pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id) AND pc2.first_pick = 0 AND pm.team_2_id = $${selectParams.length + 9}) OR
                                       ((pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id) AND pc1.first_pick = 0 AND pm.team_1_id = $${selectParams.length + 10}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_2,
              COUNT(DISTINCT CASE WHEN (((pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id) AND pc1.first_pick = 1 AND pm.team_1_id = $${selectParams.length + 11}) OR
                                       ((pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id) AND pc2.first_pick = 1 AND pm.team_2_id = $${selectParams.length + 12}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_3,
              COUNT(DISTINCT CASE WHEN (((pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id) AND pc2.first_pick = 0 AND pm.team_2_id = $${selectParams.length + 13}) OR
                                       ((pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id) AND pc1.first_pick = 0 AND pm.team_1_id = $${selectParams.length + 14}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_4,
              COUNT(DISTINCT CASE WHEN (((pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id) AND pc1.first_pick = 1 AND pm.team_1_id = $${selectParams.length + 15}) OR
                                       ((pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id) AND pc2.first_pick = 1 AND pm.team_2_id = $${selectParams.length + 16}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_5,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_id = $${selectParams.length + 17}) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_id = $${selectParams.length + 18}))
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
              COUNT(DISTINCT CASE WHEN ((pt1.team_region = $${selectParams.length + 1} AND (pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id)) OR
                                      (pt2.team_region = $${selectParams.length + 2} AND (pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id)))
                                       THEN pm.match_id ELSE NULL END) as picks,
              COUNT(DISTINCT CASE WHEN ((pt1.team_region = $${selectParams.length + 3} AND pc1.did_win = 1 AND (pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id)) OR
                                      (pt2.team_region = $${selectParams.length + 4} AND pc2.did_win = 1 AND (pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id)))
                                       THEN pm.match_id ELSE NULL END) as wins,
              SUM(CASE WHEN (((pm.team_1_ban_1 = pc.pokemon_id OR pm.team_1_ban_2 = pc.pokemon_id) AND pt1.team_region = $${selectParams.length + 5}) OR
                            ((pm.team_2_ban_1 = pc.pokemon_id OR pm.team_2_ban_2 = pc.pokemon_id) AND pt2.team_region = $${selectParams.length + 6}))
                       THEN 1 ELSE 0 END) as bans,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 1 AND pt1.team_region = $${selectParams.length + 7}) OR
                                       (pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 1 AND pt2.team_region = $${selectParams.length + 8}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_1,
              COUNT(DISTINCT CASE WHEN (((pc2.pokemon_1 = pc.pokemon_id OR pc2.pokemon_2 = pc.pokemon_id) AND pc2.first_pick = 0 AND pt2.team_region = $${selectParams.length + 9}) OR
                                       ((pc1.pokemon_1 = pc.pokemon_id OR pc1.pokemon_2 = pc.pokemon_id) AND pc1.first_pick = 0 AND pt1.team_region = $${selectParams.length + 10}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_2,
              COUNT(DISTINCT CASE WHEN (((pc1.pokemon_2 = pc.pokemon_id OR pc1.pokemon_3 = pc.pokemon_id) AND pc1.first_pick = 1 AND pt1.team_region = $${selectParams.length + 11}) OR
                                       ((pc2.pokemon_2 = pc.pokemon_id OR pc2.pokemon_3 = pc.pokemon_id) AND pc2.first_pick = 1 AND pt2.team_region = $${selectParams.length + 12}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_3,
              COUNT(DISTINCT CASE WHEN (((pc2.pokemon_3 = pc.pokemon_id OR pc2.pokemon_4 = pc.pokemon_id) AND pc2.first_pick = 0 AND pt2.team_region = $${selectParams.length + 13}) OR
                                       ((pc1.pokemon_3 = pc.pokemon_id OR pc1.pokemon_4 = pc.pokemon_id) AND pc1.first_pick = 0 AND pt1.team_region = $${selectParams.length + 14}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_4,
              COUNT(DISTINCT CASE WHEN (((pc1.pokemon_4 = pc.pokemon_id OR pc1.pokemon_5 = pc.pokemon_id) AND pc1.first_pick = 1 AND pt1.team_region = $${selectParams.length + 15}) OR
                                       ((pc2.pokemon_4 = pc.pokemon_id OR pc2.pokemon_5 = pc.pokemon_id) AND pc2.first_pick = 1 AND pt2.team_region = $${selectParams.length + 16}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_5,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 0 AND pt1.team_region = $${selectParams.length + 17}) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 0 AND pt2.team_region = $${selectParams.length + 18}))
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
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_1 = pc.pokemon_id AND pm.team_1_player_1 = $${selectParams.length + 1}) OR 
                                        (pc1.pokemon_2 = pc.pokemon_id AND pm.team_1_player_2 = $${selectParams.length + 2}) OR 
                                        (pc1.pokemon_3 = pc.pokemon_id AND pm.team_1_player_3 = $${selectParams.length + 3}) OR 
                                        (pc1.pokemon_4 = pc.pokemon_id AND pm.team_1_player_4 = $${selectParams.length + 4}) OR 
                                        (pc1.pokemon_5 = pc.pokemon_id AND pm.team_1_player_5 = $${selectParams.length + 5}) OR
                                        (pc2.pokemon_1 = pc.pokemon_id AND pm.team_2_player_1 = $${selectParams.length + 6}) OR 
                                        (pc2.pokemon_2 = pc.pokemon_id AND pm.team_2_player_2 = $${selectParams.length + 7}) OR 
                                        (pc2.pokemon_3 = pc.pokemon_id AND pm.team_2_player_3 = $${selectParams.length + 8}) OR 
                                        (pc2.pokemon_4 = pc.pokemon_id AND pm.team_2_player_4 = $${selectParams.length + 9}) OR 
                                        (pc2.pokemon_5 = pc.pokemon_id AND pm.team_2_player_5 = $${selectParams.length + 10}))
                                       THEN pm.match_id ELSE NULL END) as picks,
              COUNT(DISTINCT CASE WHEN (pc1.did_win = 1 AND
                                       ((pc1.pokemon_1 = pc.pokemon_id AND pm.team_1_player_1 = $${selectParams.length + 11}) OR 
                                        (pc1.pokemon_2 = pc.pokemon_id AND pm.team_1_player_2 = $${selectParams.length + 12}) OR 
                                        (pc1.pokemon_3 = pc.pokemon_id AND pm.team_1_player_3 = $${selectParams.length + 13}) OR 
                                        (pc1.pokemon_4 = pc.pokemon_id AND pm.team_1_player_4 = $${selectParams.length + 14}) OR 
                                        (pc1.pokemon_5 = pc.pokemon_id AND pm.team_1_player_5 = $${selectParams.length + 15}))) OR
                                       (pc2.did_win = 1 AND
                                       ((pc2.pokemon_1 = pc.pokemon_id AND pm.team_2_player_1 = $${selectParams.length + 16}) OR 
                                        (pc2.pokemon_2 = pc.pokemon_id AND pm.team_2_player_2 = $${selectParams.length + 17}) OR 
                                        (pc2.pokemon_3 = pc.pokemon_id AND pm.team_2_player_3 = $${selectParams.length + 18}) OR 
                                        (pc2.pokemon_4 = pc.pokemon_id AND pm.team_2_player_4 = $${selectParams.length + 19}) OR 
                                        (pc2.pokemon_5 = pc.pokemon_id AND pm.team_2_player_5 = $${selectParams.length + 20})))
                                       THEN pm.match_id ELSE NULL END) as wins,
              SUM(CASE WHEN ((pm.team_1_ban_1 = pc.pokemon_id OR pm.team_1_ban_2 = pc.pokemon_id) AND (pm.team_1_player_1 = $${selectParams.length + 21} OR pm.team_1_player_2 = $${selectParams.length + 22} OR pm.team_1_player_3 = $${selectParams.length + 23} OR pm.team_1_player_4 = $${selectParams.length + 24} OR pm.team_1_player_5 = $${selectParams.length + 25})) OR
                            ((pm.team_2_ban_1 = pc.pokemon_id OR pm.team_2_ban_2 = pc.pokemon_id) AND (pm.team_2_player_1 = $${selectParams.length + 26} OR pm.team_2_player_2 = $${selectParams.length + 27} OR pm.team_2_player_3 = $${selectParams.length + 28} OR pm.team_2_player_4 = $${selectParams.length + 29} OR pm.team_2_player_5 = $${selectParams.length + 30}))
                       THEN 1 ELSE 0 END) as bans,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_player_1 = $${selectParams.length + 27}) OR
                                       (pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_player_1 = $${selectParams.length + 28}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_1,
              COUNT(DISTINCT CASE WHEN ((pc2.pokemon_1 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_player_1 = $${selectParams.length + 29}) OR
                                       (pc2.pokemon_2 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_player_2 = $${selectParams.length + 30}) OR
                                       (pc1.pokemon_1 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_player_1 = $${selectParams.length + 31}) OR
                                       (pc1.pokemon_2 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_player_2 = $${selectParams.length + 32}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_2,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_2 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_player_2 = $${selectParams.length + 33}) OR
                                       (pc1.pokemon_3 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_player_3 = $${selectParams.length + 34}) OR
                                       (pc2.pokemon_2 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_player_2 = $${selectParams.length + 35}) OR
                                       (pc2.pokemon_3 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_player_3 = $${selectParams.length + 36}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_3,
              COUNT(DISTINCT CASE WHEN ((pc2.pokemon_3 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_player_3 = $${selectParams.length + 37}) OR
                                       (pc2.pokemon_4 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_player_4 = $${selectParams.length + 38}) OR
                                       (pc1.pokemon_3 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_player_3 = $${selectParams.length + 39}) OR
                                       (pc1.pokemon_4 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_player_4 = $${selectParams.length + 40}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_4,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_4 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_player_4 = $${selectParams.length + 41}) OR
                                       (pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 1 AND pm.team_1_player_5 = $${selectParams.length + 42}) OR
                                       (pc2.pokemon_4 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_player_4 = $${selectParams.length + 43}) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 1 AND pm.team_2_player_5 = $${selectParams.length + 44}))
                                      THEN pm.match_id ELSE NULL END) as pick_round_5,
              COUNT(DISTINCT CASE WHEN ((pc1.pokemon_5 = pc.pokemon_id AND pc1.first_pick = 0 AND pm.team_1_player_5 = $${selectParams.length + 45}) OR
                                       (pc2.pokemon_5 = pc.pokemon_id AND pc2.first_pick = 0 AND pm.team_2_player_5 = $${selectParams.length + 46}))
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

          // Where clause
          let whereSQL = `
            WHERE 1=1
          `;

          let whereParams = [];
          // Easy Filters:
          // Event
          if (event) {
            whereSQL += ` AND e.event_id = $${selectParams.length + whereParams.length + 1}`;
            whereParams.push(event);
          }
          // Date
          if (date && beforeAfter) {
            if (beforeAfter === 'before') {
              whereSQL += ` AND e.event_date <= $${selectParams.length + whereParams.length + 1}`;
            } else if (beforeAfter === 'after') {
              whereSQL += ` AND e.event_date >= $${selectParams.length + whereParams.length + 1}`;
            }
            whereParams.push(date);
          }

          // Complex Filters (Basically limits the matches to a specific side or player)

          // Team
          // If team_1_id is equal to team then I want to only get information for team_1's picks and bans
          // If team_2_id is equal to team then I want to only get information for team_2's picks and bans
          if (team) {
            whereSQL += ` AND (pm.team_1_id = $${selectParams.length + whereParams.length + 1} OR pm.team_2_id = $${selectParams.length + whereParams.length + 2})`;
            whereParams.push(team, team);
          }
          
          // Region
          // If region is equal to team_1_region then I want to only get information for team_1's picks and bans
          // If region is equal to team_2_region then I want to only get information for team_2's picks and bans
          if (region) {
            whereSQL += ` AND (pt1.team_region = $${selectParams.length + whereParams.length + 1} OR pt2.team_region = $${selectParams.length + whereParams.length + 2})`;
            whereParams.push(region, region);
          }

          // Player
          // If player_1 is equal to player then I want to only get information for player_1's picks and bans
          // If player_2 is equal to player then I want to only get information for player_2's picks and bans
          if (player) {
            whereSQL += ` AND (pm.team_1_player_1 = $${selectParams.length + whereParams.length + 1} OR pm.team_1_player_2 = $${selectParams.length + whereParams.length + 2} OR pm.team_1_player_3 = $${selectParams.length + whereParams.length + 3} OR pm.team_1_player_4 = $${selectParams.length + whereParams.length + 4} OR pm.team_1_player_5 = $${selectParams.length + whereParams.length + 5} OR pm.team_2_player_1 = $${selectParams.length + whereParams.length + 6} OR pm.team_2_player_2 = $${selectParams.length + whereParams.length + 7} OR pm.team_2_player_3 = $${selectParams.length + whereParams.length + 8} OR pm.team_2_player_4 = $${selectParams.length + whereParams.length + 9} OR pm.team_2_player_5 = $${selectParams.length + whereParams.length + 10})`;
            whereParams.push(player, player, player, player, player, player, player, player, player, player);
          }

          // Build and execute the final query
          const query = `
            ${selectSQL}
            ${fromSQL}
            ${whereSQL}
            GROUP BY pc.pokemon_id, pc.pokemon_name
          `;
          
          this.db.query(query, [...selectParams, ...whereParams], (err, res) => {
            if (err) {
              console.error("SQL Error:", err.message);
              reject(err);
            } else {
              resolve(res.rows);
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
                (((pm.team_1_id = $${selectParams.length + 1} AND pt1.team_region = $${selectParams.length + 2}) AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id AND pm.team_1_player_1 = $${selectParams.length + 3}) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id AND pm.team_1_player_2 = $${selectParams.length + 4}) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id AND pm.team_1_player_3 = $${selectParams.length + 5}) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id AND pm.team_1_player_4 = $${selectParams.length + 6}) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id AND pm.team_1_player_5 = $${selectParams.length + 7}))) OR
                 ((pm.team_2_id = $${selectParams.length + 8} AND pt2.team_region = $${selectParams.length + 9}) AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id AND pm.team_2_player_1 = $${selectParams.length + 10}) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id AND pm.team_2_player_2 = $${selectParams.length + 11}) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id AND pm.team_2_player_3 = $${selectParams.length + 12}) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id AND pm.team_2_player_4 = $${selectParams.length + 13}) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id AND pm.team_2_player_5 = $${selectParams.length + 14}))))
              THEN pm.match_id ELSE NULL END) as requested_usages,
              COUNT(DISTINCT CASE WHEN 
                (((pm.team_1_id = $${selectParams.length + 15} AND pt1.team_region = $${selectParams.length + 16} AND pc1.did_win = 1) AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id AND pm.team_1_player_1 = $${selectParams.length + 17}) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id AND pm.team_1_player_2 = $${selectParams.length + 18}) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id AND pm.team_1_player_3 = $${selectParams.length + 19}) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id AND pm.team_1_player_4 = $${selectParams.length + 20}) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id AND pm.team_1_player_5 = $${selectParams.length + 21}))) OR
                 ((pm.team_2_id = $${selectParams.length + 22} AND pt2.team_region = $${selectParams.length + 23} AND pc2.did_win = 1) AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id AND pm.team_2_player_1 = $${selectParams.length + 24}) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id AND pm.team_2_player_2 = $${selectParams.length + 25}) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id AND pm.team_2_player_3 = $${selectParams.length + 26}) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id AND pm.team_2_player_4 = $${selectParams.length + 27}) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id AND pm.team_2_player_5 = $${selectParams.length + 28}))))
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
                (((pm.team_1_id = $${selectParams.length + 1} AND pt1.team_region = $${selectParams.length + 2}) AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id))) OR
                 ((pm.team_2_id = $${selectParams.length + 3} AND pt2.team_region = $${selectParams.length + 4}) AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id))))
              THEN pm.match_id ELSE NULL END) as requested_usages,
              COUNT(DISTINCT CASE WHEN 
                (((pm.team_1_id = $${selectParams.length + 5} AND pt1.team_region = $${selectParams.length + 6} AND pc1.did_win = 1) AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id))) OR
                 ((pm.team_2_id = $${selectParams.length + 7} AND pt2.team_region = $${selectParams.length + 8} AND pc2.did_win = 1) AND
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
                ((pm.team_1_id = $${selectParams.length + 1} AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id AND pm.team_1_player_1 = $${selectParams.length + 2}) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id AND pm.team_1_player_2 = $${selectParams.length + 3}) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id AND pm.team_1_player_3 = $${selectParams.length + 4}) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id AND pm.team_1_player_4 = $${selectParams.length + 5}) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id AND pm.team_1_player_5 = $${selectParams.length + 6}))) OR
                (pm.team_2_id = $${selectParams.length + 7} AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id AND pm.team_2_player_1 = $${selectParams.length + 8}) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id AND pm.team_2_player_2 = $${selectParams.length + 9}) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id AND pm.team_2_player_3 = $${selectParams.length + 10}) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id AND pm.team_2_player_4 = $${selectParams.length + 11}) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id AND pm.team_2_player_5 = $${selectParams.length + 12}))))
              THEN pm.match_id ELSE NULL END) as requested_usages,
              COUNT(DISTINCT CASE WHEN 
                (((pm.team_1_id = $${selectParams.length + 13} AND pc1.did_win = 1) AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id AND pm.team_1_player_1 = $${selectParams.length + 14}) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id AND pm.team_1_player_2 = $${selectParams.length + 15}) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id AND pm.team_1_player_3 = $${selectParams.length + 16}) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id AND pm.team_1_player_4 = $${selectParams.length + 17}) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id AND pm.team_1_player_5 = $${selectParams.length + 18})))) OR
                 ((pm.team_2_id = $${selectParams.length + 19} AND pc2.did_win = 1) AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id AND pm.team_2_player_1 = $${selectParams.length + 20}) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id AND pm.team_2_player_2 = $${selectParams.length + 21}) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id AND pm.team_2_player_3 = $${selectParams.length + 22}) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id AND pm.team_2_player_4 = $${selectParams.length + 23}) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id AND pm.team_2_player_5 = $${selectParams.length + 24}))))
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
                ((pt1.team_region = $${selectParams.length + 1} AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id AND pm.team_1_player_1 = $${selectParams.length + 2}) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id AND pm.team_1_player_2 = $${selectParams.length + 3}) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id AND pm.team_1_player_3 = $${selectParams.length + 4}) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id AND pm.team_1_player_4 = $${selectParams.length + 5}) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id AND pm.team_1_player_5 = $${selectParams.length + 6})))) OR
                 (pt2.team_region = $${selectParams.length + 7} AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id AND pm.team_2_player_1 = $${selectParams.length + 8}) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id AND pm.team_2_player_2 = $${selectParams.length + 9}) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id AND pm.team_2_player_3 = $${selectParams.length + 10}) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id AND pm.team_2_player_4 = $${selectParams.length + 11}) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id AND pm.team_2_player_5 = $${selectParams.length + 12}))))
              THEN pm.match_id ELSE NULL END) as requested_usages,
              COUNT(DISTINCT CASE WHEN 
                (((pt1.team_region = $${selectParams.length + 13} AND pc1.did_win = 1) AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id AND pm.team_1_player_1 = $${selectParams.length + 14}) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id AND pm.team_1_player_2 = $${selectParams.length + 15}) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id AND pm.team_1_player_3 = $${selectParams.length + 16}) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id AND pm.team_1_player_4 = $${selectParams.length + 17}) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id AND pm.team_1_player_5 = $${selectParams.length + 18})))) OR
                 ((pt2.team_region = $${selectParams.length + 19} AND pc2.did_win = 1) AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id AND pm.team_2_player_1 = $${selectParams.length + 20}) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id AND pm.team_2_player_2 = $${selectParams.length + 21}) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id AND pm.team_2_player_3 = $${selectParams.length + 22}) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id AND pm.team_2_player_4 = $${selectParams.length + 23}) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id AND pm.team_2_player_5 = $${selectParams.length + 24}))))
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
                ((pm.team_1_id = $${selectParams.length + 1} AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id))) OR
                 (pm.team_2_id = $${selectParams.length + 2} AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id))))
              THEN pm.match_id ELSE NULL END) as requested_usages,
              COUNT(DISTINCT CASE WHEN 
                (((pm.team_1_id = $${selectParams.length + 3} AND pc1.did_win = 1) AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id))) OR
                 ((pm.team_2_id = $${selectParams.length + 4} AND pc2.did_win = 1) AND
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
                ((pt1.team_region = $${selectParams.length + 1} AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id))) OR
                 (pt2.team_region = $${selectParams.length + 2} AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id))))
              THEN pm.match_id ELSE NULL END) as requested_usages,
              COUNT(DISTINCT CASE WHEN 
                (((pt1.team_region = $${selectParams.length + 3} AND pc1.did_win = 1) AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id))) OR
                 ((pt2.team_region = $${selectParams.length + 4} AND pc2.did_win = 1) AND
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
                (((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id AND pm.team_1_player_1 = $${selectParams.length + 1}) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id AND pm.team_1_player_2 = $${selectParams.length + 2}) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id AND pm.team_1_player_3 = $${selectParams.length + 3}) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id AND pm.team_1_player_4 = $${selectParams.length + 4}) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id AND pm.team_1_player_5 = $${selectParams.length + 5})) OR
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id AND pm.team_2_player_1 = $${selectParams.length + 6}) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id AND pm.team_2_player_2 = $${selectParams.length + 7}) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id AND pm.team_2_player_3 = $${selectParams.length + 8}) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id AND pm.team_2_player_4 = $${selectParams.length + 9}) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id AND pm.team_2_player_5 = $${selectParams.length + 10})))
              THEN pm.match_id ELSE NULL END) as requested_usages,
              COUNT(DISTINCT CASE WHEN 
                ((pc1.did_win = 1 AND
                  ((pc1.pokemon_1 = pc.pokemon_id AND pc1.pokemon_1_move_1 = pm1.move_id AND pc1.pokemon_1_move_2 = pm2.move_id AND pm.team_1_player_1 = $${selectParams.length + 11}) OR
                   (pc1.pokemon_2 = pc.pokemon_id AND pc1.pokemon_2_move_1 = pm1.move_id AND pc1.pokemon_2_move_2 = pm2.move_id AND pm.team_1_player_2 = $${selectParams.length + 12}) OR
                   (pc1.pokemon_3 = pc.pokemon_id AND pc1.pokemon_3_move_1 = pm1.move_id AND pc1.pokemon_3_move_2 = pm2.move_id AND pm.team_1_player_3 = $${selectParams.length + 13}) OR
                   (pc1.pokemon_4 = pc.pokemon_id AND pc1.pokemon_4_move_1 = pm1.move_id AND pc1.pokemon_4_move_2 = pm2.move_id AND pm.team_1_player_4 = $${selectParams.length + 14}) OR
                   (pc1.pokemon_5 = pc.pokemon_id AND pc1.pokemon_5_move_1 = pm1.move_id AND pc1.pokemon_5_move_2 = pm2.move_id AND pm.team_1_player_5 = $${selectParams.length + 15}))) OR
                 (pc2.did_win = 1 AND
                  ((pc2.pokemon_1 = pc.pokemon_id AND pc2.pokemon_1_move_1 = pm1.move_id AND pc2.pokemon_1_move_2 = pm2.move_id AND pm.team_2_player_1 = $${selectParams.length + 16}) OR
                   (pc2.pokemon_2 = pc.pokemon_id AND pc2.pokemon_2_move_1 = pm1.move_id AND pc2.pokemon_2_move_2 = pm2.move_id AND pm.team_2_player_2 = $${selectParams.length + 17}) OR
                   (pc2.pokemon_3 = pc.pokemon_id AND pc2.pokemon_3_move_1 = pm1.move_id AND pc2.pokemon_3_move_2 = pm2.move_id AND pm.team_2_player_3 = $${selectParams.length + 18}) OR
                   (pc2.pokemon_4 = pc.pokemon_id AND pc2.pokemon_4_move_1 = pm1.move_id AND pc2.pokemon_4_move_2 = pm2.move_id AND pm.team_2_player_4 = $${selectParams.length + 19}) OR
                   (pc2.pokemon_5 = pc.pokemon_id AND pc2.pokemon_5_move_1 = pm1.move_id AND pc2.pokemon_5_move_2 = pm2.move_id AND pm.team_2_player_5 = $${selectParams.length + 20}))))
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

          // Where clause
          let whereSQL = `
            WHERE 1=1
            AND pm1.move_id < pm2.move_id
          `;

          let whereParams = [];
          // Easy Filters:
          // Event
          if (event) {
            whereSQL += ` AND e.event_id = $${selectParams.length + whereParams.length + 1}`;
            whereParams.push(event);
          }
          // Date
          if (date && beforeAfter) {
            if (beforeAfter === 'before') {
              whereSQL += ` AND e.event_date <= $${selectParams.length + whereParams.length + 1}`;
            } else if (beforeAfter === 'after') {
              whereSQL += ` AND e.event_date >= $${selectParams.length + whereParams.length + 1}`;
            }
            whereParams.push(date);
          }

          // Complex Filters (Basically limits the matches to a specific side or player)

          // Team
          // If team_1_id is equal to team then I want to only get information for team_1's picks and bans
          // If team_2_id is equal to team then I want to only get information for team_2's picks and bans
          if (team) {
            whereSQL += ` AND (pm.team_1_id = $${selectParams.length + whereParams.length + 1} OR pm.team_2_id = $${selectParams.length + whereParams.length + 2})`;
            whereParams.push(team, team);
          }
          
          // Region
          // If region is equal to team_1_region then I want to only get information for team_1's picks and bans
          // If region is equal to team_2_region then I want to only get information for team_2's picks and bans
          if (region) {
            whereSQL += ` AND (pt1.team_region = $${selectParams.length + whereParams.length + 1} OR pt2.team_region = $${selectParams.length + whereParams.length + 2})`;
            whereParams.push(region, region);
          }

          // Player
          // If player_1 is equal to player then I want to only get information for player_1's picks and bans
          // If player_2 is equal to player then I want to only get information for player_2's picks and bans
          if (player) {
            whereSQL += ` AND (pm.team_1_player_1 = $${selectParams.length + whereParams.length + 1} OR pm.team_1_player_2 = $${selectParams.length + whereParams.length + 2} OR pm.team_1_player_3 = $${selectParams.length + whereParams.length + 3} OR pm.team_1_player_4 = $${selectParams.length + whereParams.length + 4} OR pm.team_1_player_5 = $${selectParams.length + whereParams.length + 5} OR pm.team_2_player_1 = $${selectParams.length + whereParams.length + 6} OR pm.team_2_player_2 = $${selectParams.length + whereParams.length + 7} OR pm.team_2_player_3 = $${selectParams.length + whereParams.length + 8} OR pm.team_2_player_4 = $${selectParams.length + whereParams.length + 9} OR pm.team_2_player_5 = $${selectParams.length + whereParams.length + 10})`;
            whereParams.push(player, player, player, player, player, player, player, player, player, player);
          }

          // Build and execute the final query
          const query = `
            ${selectSQL}
            ${fromSQL}
            ${whereSQL}
            GROUP BY pc.pokemon_id, pc.pokemon_name, pm1.move_name, pm2.move_name
            HAVING COUNT(DISTINCT CASE WHEN 
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
              THEN pm.match_id ELSE NULL END) > 0
            ORDER BY pc.pokemon_name, COUNT(DISTINCT CASE WHEN 
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
              THEN pm.match_id ELSE NULL END) DESC
          `;
          
          this.db.query(query, [...selectParams, ...whereParams], (err, res) => {
            if (err) {
              console.error("SQL Error in moveStats:", err.message);
              // Resolve with empty array instead of rejecting to avoid failing the entire function
              reject();
            } else {
              resolve(res.rows);
            }
          });
        } catch (error) {
          console.error("Function error in moveStats:", error.message);
          // Resolve with empty array instead of rejecting
          reject();
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