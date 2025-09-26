class Stats {
  
  /**
     * Constructor for stats class
     * @param {*} db Pass DB object into class
     */
  constructor(db) {
    this.db = db;
  }

  async getDraftStats(event, region, team, player, dateLower, dateUpper) {
    return await new Promise((resolve, reject) => {
      try {
        const sql = `
          --++ Make A Base Table With All Comps Minus Picks And Bans (Because Those Are Many To One Relationships) ++--
          WITH all_comps AS (
            SELECT e.event_id, e.event_date, m.match_id, c.comp_id, c.did_win, t.team_id, t.team_region
            FROM comps c
            LEFT JOIN matches m ON c.comp_id IN (m.comp_1_id, m.comp_2_id)
            LEFT JOIN professional_teams t ON c.team_id = t.team_id
            LEFT JOIN professional_sets ps ON m.set_id = ps.set_id
            LEFT JOIN events e ON ps.event_id = e.event_id
            WHERE ($1::int IS NULL OR e.event_id = $1)
              AND ($2::text IS NULL OR t.team_region = $2)
              AND ($3::int IS NULL OR t.team_id = $3)
              AND ($5::date IS NULL OR e.event_date >= $5)
              AND ($6::date IS NULL OR e.event_date <= $6)
          ),
          --++ Make A Table With All Picks Minus Bans (Because Joining Both Picks And Bans Will Multiply The Rows) ++--
          picks_aggregate AS (
            SELECT ac.comp_id, p.pokemon_id AS pick_pokemon_id, p.move_1_id, p.move_2_id, ac.did_win, p.pick_position
            FROM all_comps ac
            LEFT JOIN picks p ON p.comp_id = ac.comp_id
            WHERE ($4::int IS NULL OR p.player_id = $4)
          ),
          --++ Make A Table With All Bans Minus Picks (Because Joining Both Picks And Bans Will Multiply The Rows) ++--
          bans_aggregate AS (
            SELECT ac.comp_id, b.pokemon_id AS ban_pokemon_id, b.ban_position
            FROM all_comps ac
            LEFT JOIN bans b ON b.comp_id = ac.comp_id
            ---- Filter Bans By Player By Making Sure The Player Was On The Team That Banned The Pokemon ----
            WHERE EXISTS (
              SELECT 1
              FROM picks p
              WHERE p.comp_id = ac.comp_id AND ($4::int IS NULL OR p.player_id = $4)
            )
          ),
          --++ Make A Table With The Total Number Of Matches (Can't Do COUNT(*) Because Our Base Is Of Comps, Not Matches) ++--
          total_matches AS (
            SELECT COUNT(DISTINCT ac.match_id) AS total_matches
            FROM all_comps ac
            ---- Filter Total Matches By Player By Making Sure The Player was Present In The Match ----
            WHERE EXISTS (
              SELECT 1
              FROM picks p
              WHERE p.comp_id = ac.comp_id AND ($4::int IS NULL OR p.player_id = $4)
            )
          ),
          --++ Make A Table With The Total Number Of Picks And Wins For Each Pokemon ++--
          pick_counts AS (
            SELECT pick_pokemon_id, COUNT(*) AS total_picks, SUM(CASE WHEN did_win THEN 1 ELSE 0 END) AS total_pick_wins
            FROM picks_aggregate
            GROUP BY pick_pokemon_id
          ),
          --++ Make A Table With The Total Number Of Bans For Each Pokemon ++--
          ban_counts AS (
            SELECT ban_pokemon_id, COUNT(*) AS total_bans
            FROM bans_aggregate
            GROUP BY ban_pokemon_id
          ),
          --++ Make A Table With The Total Number Of Picks For Each Position For Each Pokemon ++--
          position_counts AS (
            SELECT pick_pokemon_id, SUM(CASE WHEN pick_position = '1' THEN 1 ELSE 0 END) AS round_1_picks, SUM(CASE WHEN (pick_position = '2' OR pick_position = '3') THEN 1 ELSE 0 END) AS round_2_picks, SUM(CASE WHEN (pick_position = '4' OR pick_position = '5') THEN 1 ELSE 0 END) AS round_3_picks, SUM(CASE WHEN (pick_position = '6' OR pick_position = '7') THEN 1 ELSE 0 END) AS round_4_picks, SUM(CASE WHEN (pick_position = '8' OR pick_position = '9') THEN 1 ELSE 0 END) AS round_5_picks, SUM(CASE WHEN (pick_position = '10') THEN 1 ELSE 0 END) AS round_6_picks
            FROM picks_aggregate
            GROUP BY pick_pokemon_id
          ),
          --++ Make A Table With The Usage And Wins For Each Moveset For Each Pokemon ++--
          moveset_counts AS (
          SELECT
            pick_pokemon_id,
            json_agg(
              json_build_object(
                'move_1_id', move_1_id,
                'move_2_id', move_2_id,
                'move_1_name', move_1_name,
                'move_2_name', move_2_name,
                'moveset_count', moveset_count,
                'moveset_wins', moveset_wins
              )
            ) AS movesets
            FROM (
              SELECT
                pick_pokemon_id,
                move_1_id,
                pm1.move_name as move_1_name,
                move_2_id,
                pm2.move_name as move_2_name,
                COUNT(*) AS moveset_count,
                SUM(CASE WHEN did_win THEN 1 ELSE 0 END) AS moveset_wins
              FROM picks_aggregate
              LEFT JOIN pokemon_moves pm1 ON pm1.move_id = move_1_id
              LEFT JOIN pokemon_moves pm2 ON pm2.move_id = move_2_id
              GROUP BY pick_pokemon_id, move_1_id, move_2_id, move_1_name, move_2_name
            ) sub
            GROUP BY pick_pokemon_id
          )
          --++ Select The Final Results ++--
          SELECT 
            pchar.pokemon_id::INT,
            pchar.pokemon_name,
            tm.total_matches::INT,
            pc.total_picks::INT,
            pc.total_pick_wins::INT,
            bc.total_bans::INT,
            posc.round_1_picks::INT,
            posc.round_2_picks::INT,
            posc.round_3_picks::INT,
            posc.round_4_picks::INT,
            posc.round_5_picks::INT,
            posc.round_6_picks::INT,
            mc.movesets
          FROM playable_characters pchar
          LEFT JOIN pick_counts pc ON pchar.pokemon_id = pc.pick_pokemon_id
          LEFT JOIN ban_counts bc ON pchar.pokemon_id = bc.ban_pokemon_id
          LEFT JOIN position_counts posc ON pchar.pokemon_id = posc.pick_pokemon_id
          LEFT JOIN moveset_counts mc ON pchar.pokemon_id = mc.pick_pokemon_id
          CROSS JOIN total_matches tm
        `;
  
        const params = [event, region, team, player, dateLower, dateUpper];
  
        this.db.query(sql, params, (err, res) => {
          if (err) {
            console.error("SQL Error in draft stats:", err.message);
            reject(err);
          } else {
            resolve(res.rows);
          }
        });
      } catch (error) {
        console.error("Error getting draft stats", error);
        reject(error);
      }
    });
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