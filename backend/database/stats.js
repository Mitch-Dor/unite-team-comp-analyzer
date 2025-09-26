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
        let sql = `SELECT * FROM pokemon_performance
        WHERE kills >= ${minKills}
        AND assists >= ${minAssists}
        AND damage_dealt >= ${minDealt}
        AND damage_taken >= ${minTaken}
        AND damage_healed >= ${minHealed}
        AND points_scored >= ${minScored}
        AND position_played = '${lane}'
        AND pokemon_id = ${pokemon}
        AND (move_1_id = ${move1} OR move_2_id = ${move1}) AND (move_1_id = ${move2} OR move_2_id = ${move2})`;
        this.db.query(sql, (err, res) => {
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