class Stats {
  
  /**
     * Constructor for stats class
     * @param {*} db Pass DB object into class
     */
  constructor(db) {
    this.db = db;
  }

  getDraftStats(event, region, team, player, date, beforeAfter){
    
  }

  // Get overall battle stats
  async getOverallBattleStats() {
    return await new Promise((resolve, reject) => {
      try {
        let sql = `SELECT pokemon_id, pokemon_name, AVG(kills) as mean_kills, AVG(assists) as mean_assists, AVG(damage_dealt) as mean_dealt, AVG(damage_taken) as mean_taken, AVG(damage_healed) as mean_healed, AVG(points_scored) as mean_scored, SUM((position_played = 'TopCarry')::int) AS num_times_top, SUM((position_played = 'EXPShareTop')::int) AS num_times_exp_share_top, SUM((position_played = 'JungleCarry')::int) AS num_times_jungle, SUM((position_played = 'BottomCarry')::int) AS num_times_bot, SUM((position_played = 'EXPShareBot')::int) AS num_times_exp_share_bot
                      FROM pokemon_performance NATURAL JOIN playable_characters
                      GROUP BY pokemon_id, pokemon_name`;
        this.db.query(sql, (err, res) => {
          if (err) {
            console.error("SQL Error in overall battle stats:", err.message);
            // Resolve with empty array instead of rejecting to avoid failing the entire function
            reject(err);
          } else {
            resolve(res.rows);
          }
        })
      } catch (error) {
        console.error("Error getting battle stats ", error);
        reject(error);
      }
    });
  }

  async getIndividualBattleStats(minKills = 0, minAssists = 0, minDealt = 0, minTaken = 0, minHealed = 0, minScored = 0, lane, pokemon, move1, move2){
    // Need to get the comps / matches that link to this minimum pokemon_performance
    return await new Promise((resolve, reject) => {
      try {
        let sql = `
        --++ Find Comps That Match the Minimum Criteria ++--
        WITH matching_comp_ids AS (
          SELECT pp.comp_id
          FROM pokemon_performance pp
          JOIN picks p ON pp.comp_id = p.comp_id
          WHERE pp.kills >= $1
          AND pp.assists >= $2
          AND pp.damage_dealt >= $3
          AND pp.damage_taken >= $4
          AND pp.damage_healed >= $5
          AND pp.points_scored >= $6
          AND (pp.position_played = $7 OR $7 = 'any')
          AND pp.pokemon_id = $8
          AND ( $9::int IS NULL OR $9::int = p.move_1_id OR $9::int = p.move_2_id )
          AND ( $10::int IS NULL OR $10::int = p.move_1_id OR $10::int = p.move_2_id )
        )
        --++ Get Full Matches Based On Comp IDs ++--
        SELECT json_agg(
        json_build_object(
          'match_id', m.match_id,
          'match_winner_text', CASE WHEN c1.did_win THEN t1.team_name ELSE t2.team_name END,
          'team1_id', t1.team_id,
          'team1_name', t1.team_name,
          'team1_region', t1.team_region,
          'team2_id', t2.team_id,
          'team2_name', t2.team_name,
          'team2_region', t2.team_region,
          'team1_picks', (
            SELECT json_agg(
              json_build_object(
                'pokemon_id', p.pokemon_id,
                'pokemon_name', pc.pokemon_name,
                'pick_position', p.pick_position,
                'player_id', p.player_id,
                'player_name', pp.player_name,
                'player_other_names', pp.other_names,
                'position_played', p.position_played,
                'move_1_id', p.move_1_id,
                'move_1_name', pm1.move_name,
                'move_2_id', p.move_2_id,
                'move_2_name', pm2.move_name,
                'kills', ppe.kills,
                'assists', ppe.assists,
                'dealt', ppe.damage_dealt,
                'taken', ppe.damage_taken,
                'healed', ppe.damage_healed,
                'scored', ppe.points_scored
              )
            ORDER BY p.pick_position
          )
          FROM picks p
          JOIN playable_characters pc ON p.pokemon_id = pc.pokemon_id
          JOIN professional_players pp ON p.player_id = pp.player_id
          JOIN pokemon_moves pm1 ON p.move_1_id = pm1.move_id
          JOIN pokemon_moves pm2 ON p.move_2_id = pm2.move_id
          LEFT JOIN pokemon_performance ppe ON ppe.comp_id = p.comp_id AND ppe.pokemon_id = p.pokemon_id
          WHERE p.comp_id = c1.comp_id
        ),
        'team1_bans', (
          SELECT json_agg(
            json_build_object(
              'pokemon_id', b.pokemon_id,
              'pokemon_name', pc.pokemon_name,
              'ban_position', b.ban_position
            )
          ORDER BY b.ban_position
          )
          FROM bans b
          JOIN playable_characters pc ON b.pokemon_id = pc.pokemon_id
          WHERE b.comp_id = c1.comp_id
        ),
        'team2_picks', (
            SELECT json_agg(
              json_build_object(
                'pokemon_id', p.pokemon_id,
                'pokemon_name', pc.pokemon_name,
                'pick_position', p.pick_position,
                'player_id', p.player_id,
                'player_name', pp.player_name,
                'player_other_names', pp.other_names,
                'position_played', p.position_played,
                'move_1_id', p.move_1_id,
                'move_1_name', pm1.move_name,
                'move_2_id', p.move_2_id,
                'move_2_name', pm2.move_name,
                'kills', ppe.kills,
                'assists', ppe.assists,
                'dealt', ppe.damage_dealt,
                'taken', ppe.damage_taken,
                'healed', ppe.damage_healed,
                'scored', ppe.points_scored
              )
              ORDER BY p.pick_position
            )
            FROM picks p
            JOIN playable_characters pc ON p.pokemon_id = pc.pokemon_id
            JOIN professional_players pp ON p.player_id = pp.player_id
            JOIN pokemon_moves pm1 ON p.move_1_id = pm1.move_id
            JOIN pokemon_moves pm2 ON p.move_2_id = pm2.move_id
            LEFT JOIN pokemon_performance ppe ON ppe.comp_id = p.comp_id AND ppe.pokemon_id = p.pokemon_id
            WHERE p.comp_id = c2.comp_id
            ),
            'team2_bans', (
              SELECT json_agg(
                json_build_object(
                  'pokemon_id', b.pokemon_id,
                  'pokemon_name', pc.pokemon_name,
                  'ban_position', b.ban_position
                )
                ORDER BY b.ban_position
              )
              FROM bans b
              JOIN playable_characters pc ON b.pokemon_id = pc.pokemon_id
              WHERE b.comp_id = c2.comp_id
          )
        ) ORDER BY m.match_id
      ) as matches
      FROM matches m
      JOIN comps c1 ON c1.comp_id = m.comp_1_id
      JOIN comps c2 ON c2.comp_id = m.comp_2_id
      JOIN professional_teams t1 ON t1.team_id = c1.team_id
      JOIN professional_teams t2 ON t2.team_id = c2.team_id
      WHERE c1.comp_id IN (SELECT comp_id FROM matching_comp_ids)
      OR c2.comp_id IN (SELECT comp_id FROM matching_comp_ids)
      `;
      const params = [
        minKills, minAssists, minDealt, minTaken,
        minHealed, minScored, lane, pokemon,
        move1, move2
      ];
        this.db.query(sql, params, (err, res) => {
          if (err) {
            console.error("SQL Error in individual battle stats:", err.message);
            reject(err);
          } else {
            resolve(res.rows);
          }
        })
      } catch (error) {
        console.error("Error getting individual battle stats ", error);
        reject(error);
      }
    })
  }
  
}
    
module.exports = Stats;