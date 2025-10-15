// Retrieves data relating to comps, sets, or anything else that uses comp inforrmation (separate because comps are quite complex)

class Comps {
    /**
       * Constructor for comps class
       * @param {*} db Pass DB object into class
       */
    constructor(db) {
      this.db = db;
    }

    // Get all data for display in Comps page
    async getAllSets() {
      return new Promise((resolve, reject) => {
        const sql = `
        ---- Compute Set Winner And Score Based On Match Winners ----
        ---- Temporary Table 'match_winners' To Store Result ----
        WITH match_winners AS (
            SELECT
                m.match_id,
                m.set_id,
                m.vod_url,
                -- Comp1 and Team1
                c1.comp_id AS comp_1_id,
                t1.team_id AS team1_id,
                t1.team_name AS team1_name,
                t1.team_region AS team1_region,
                SUM(CASE WHEN c1.did_win THEN 1 ELSE 0 END) AS team1_score,
                
                -- Comp2 and Team2
                c2.comp_id AS comp_2_id,
                t2.team_id AS team2_id,
                t2.team_name AS team2_name,
                t2.team_region AS team2_region,
                SUM(CASE WHEN c2.did_win THEN 1 ELSE 0 END) AS team2_score,
                
                -- Winner logic
                CASE
                    WHEN SUM(CASE WHEN c1.did_win THEN 1 ELSE 0 END) > SUM(CASE WHEN c2.did_win THEN 1 ELSE 0 END)
                        THEN t1.team_id
                    WHEN SUM(CASE WHEN c2.did_win THEN 1 ELSE 0 END) > SUM(CASE WHEN c1.did_win THEN 1 ELSE 0 END)
                        THEN t2.team_id
                    ELSE NULL
                END AS match_winner,
                
                CASE
                    WHEN SUM(CASE WHEN c1.did_win THEN 1 ELSE 0 END) > SUM(CASE WHEN c2.did_win THEN 1 ELSE 0 END)
                        THEN t1.team_name
                    WHEN SUM(CASE WHEN c2.did_win THEN 1 ELSE 0 END) > SUM(CASE WHEN c1.did_win THEN 1 ELSE 0 END)
                        THEN t2.team_name
                    ELSE NULL
                END AS match_winner_text

            FROM pro_matches m
            JOIN pro_comps c1 ON c1.comp_id = m.comp_1_id
            JOIN pro_comps c2 ON c2.comp_id = m.comp_2_id
            JOIN pro_teams t1 ON t1.team_id = c1.team_id
            JOIN pro_teams t2 ON t2.team_id = c2.team_id
            
            GROUP BY m.match_id, m.set_id, c1.comp_id, t1.team_id, t1.team_name, t1.team_region,
                    c2.comp_id, t2.team_id, t2.team_name, t2.team_region
        )
        ---- End 'match_winners' Temporary Table ----

        ----++ Main Select Query ++----
        SELECT
            ---- Select All Set and Event Data (event_date, event_name, event_id, set_id, set_descriptor)
            s.*, e.*,
            --++ Matches Array ++--
            (
                ---- Create The Matches Array ----
                SELECT json_agg(
                    ---- Create The Match Object ----
                    json_build_object(
                        'match_id', mw.match_id,
                        'match_url', mw.vod_url,
                        'team1_id', mw.team1_id,
                        'team1_name', pt2.team_name,
                        'team1_region', pt2.team_region,
                        'team2_id', mw.team2_id,
                        'team2_name', pt3.team_name,
                        'team2_region', pt3.team_region,
                        'match_winner_id', mw.match_winner,
                        'match_winner_text', pt1.team_name,
                        'team1_picks', (
                            ---- Create The Comp 1 Picks Array ----
                            SELECT json_agg(
                                ---- Create The Pick Object ----
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
                            FROM pro_picks p
                            JOIN playable_characters pc ON p.pokemon_id = pc.pokemon_id
                            JOIN pro_players pp ON p.player_id = pp.player_id
                            JOIN pokemon_moves pm1 ON p.move_1_id = pm1.move_id
                            JOIN pokemon_moves pm2 ON p.move_2_id = pm2.move_id
                            LEFT JOIN pro_performance ppe ON ppe.comp_id = p.comp_id AND ppe.pokemon_id = p.pokemon_id
                            WHERE p.comp_id = mw.comp_1_id
                        ),
                        'team1_bans', (
                            ---- Create The Comp 1 Bans Array ----
                            SELECT json_agg(
                                ---- Create The Ban Object ----
                                json_build_object(
                                    'pokemon_id', b.pokemon_id,
                                    'pokemon_name', pc.pokemon_name,
                                    'ban_position', b.ban_position
                                ) 
                                ORDER BY b.ban_position
                            )
                            FROM pro_bans b
                            JOIN playable_characters pc ON b.pokemon_id = pc.pokemon_id
                            WHERE b.comp_id = mw.comp_1_id
                        ),
                        'team2_picks', (
                            ---- Create The Comp 2 Picks Array ----
                            SELECT json_agg(
                                ---- Create The Pick Object ----
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
                            FROM pro_picks p
                            JOIN playable_characters pc ON p.pokemon_id = pc.pokemon_id
                            JOIN pro_players pp ON p.player_id = pp.player_id
                            JOIN pokemon_moves pm1 ON p.move_1_id = pm1.move_id
                            JOIN pokemon_moves pm2 ON p.move_2_id = pm2.move_id
                            LEFT JOIN pro_performance ppe ON ppe.comp_id = p.comp_id AND ppe.pokemon_id = p.pokemon_id
                            WHERE p.comp_id = mw.comp_2_id
                        ),
                        'team2_bans', (
                            ---- Create The Comp 2 Bans Array ----
                            SELECT json_agg(
                                ---- Create The Ban Object ----
                                json_build_object(
                                    'pokemon_id', b.pokemon_id,
                                    'pokemon_name', pc.pokemon_name,
                                    'ban_position', b.ban_position
                                ) 
                                ORDER BY b.ban_position
                            )
                            FROM pro_bans b
                            JOIN playable_characters pc ON b.pokemon_id = pc.pokemon_id
                            WHERE b.comp_id = mw.comp_2_id
                        )
                    ) ORDER BY mw.match_id
                )
                FROM match_winners mw
                JOIN pro_teams pt1 ON pt1.team_id = mw.match_winner
                JOIN pro_teams pt2 ON pt2.team_id = mw.team1_id
                JOIN pro_teams pt3 ON pt3.team_id = mw.team2_id 
                WHERE mw.set_id = s.set_id
            ) AS matches,
            --++ End Matches Array ++--

            --++ Set Scores Array ++--
            (
                ---- Create The Set Scores Array ----
                SELECT json_agg(
                    ---- Create The Set Score Object ----
                    json_build_object(
                        'team_id', teams.team_id,
                        'team_name', teams.team_name,
                        'wins', COALESCE(wins_sub.wins, 0)
                    )
                )
                FROM (
                    ---- Get Both Teams From This Set ----
                    SELECT mw.team1_id AS team_id, pt1.team_name
                    FROM match_winners mw
                    JOIN pro_teams pt1 ON pt1.team_id = mw.team1_id
                    WHERE mw.set_id = s.set_id
                    UNION
                    SELECT mw.team2_id AS team_id, pt2.team_name
                    FROM match_winners mw
                    JOIN pro_teams pt2 ON pt2.team_id = mw.team2_id
                    WHERE mw.set_id = s.set_id
                ) teams
                ---- Left Join Number Of Wins So That Even A Team With 0 Wins Is Displayed ----
                LEFT JOIN (
                    -- Count how many times each team won
                    SELECT mw.match_winner AS team_id, COUNT(*) AS wins
                    FROM match_winners mw
                    WHERE mw.set_id = s.set_id
                    GROUP BY mw.match_winner
                ) wins_sub
                ON teams.team_id = wins_sub.team_id
            ) AS set_score,
            --++ End Set Scores Array ++--

            --++ Set Winner Object ++--
            (
                SELECT json_build_object (
                    'team_id', team_id,
                    'team_name', team_name
                )
                
                FROM (
                    SELECT mw.match_winner AS team_id, mw.match_winner_text AS team_name, COUNT(*) AS wins
                    FROM match_winners mw
                    WHERE mw.set_id = s.set_id
                    GROUP BY mw.match_winner, mw.match_winner_text
                    ORDER BY COUNT(*) DESC
                    LIMIT 1
                ) AS set_winner_sub
            ) AS set_winner
            --++ End Set Winner Object ++--

        FROM pro_sets s
        JOIN pro_events e ON s.event_id = e.event_id
        ORDER BY s.set_id ASC
        ----++ End Main Select Query ++----
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

    async insertSet(setData, nullMatches, nullStats) {
        const client = await this.db.connect();
        try {
            await client.query('BEGIN'); // start transaction
            
            // Insert Set
            const setId = await new Promise((resolve, reject) => {
                const sql = `
                INSERT INTO pro_sets (event_id, set_descriptor) VALUES ($1, $2) RETURNING set_id
                `;
                client.query(sql, [setData.event_id, setData.set_descriptor], (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res.rows[0].set_id);
                    }
                });
            });

            // Insert Comps
            const matchComps = [];
            for (let i = 0; i < 5; i++) {
                if (nullMatches.includes(i)) {
                    continue;
                }
                // Team 1 Comp
                const comp1Promise = await new Promise((resolve, reject) => {
                    const sql = `
                    INSERT INTO pro_comps (did_win, first_pick, team_id) VALUES ($1, $2, $3) RETURNING comp_id
                    `;
                    client.query(sql, [setData.matches[i].match_winner_id === setData.matches[i].team1_id, setData.matches[i].firstPick === 1, setData.matches[i].team1_id], (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res.rows[0].comp_id);
                        }
                    });
                });
                // Team 2 Comp
                const comp2Promise = await new Promise((resolve, reject) => {
                    const sql = `
                    INSERT INTO pro_comps (did_win, first_pick, team_id) VALUES ($1, $2, $3) RETURNING comp_id
                    `;
                    client.query(sql, [setData.matches[i].match_winner_id === setData.matches[i].team2_id, setData.matches[i].firstPick === 2, setData.matches[i].team2_id], (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res.rows[0].comp_id);
                        }
                    });
                });
                
                
                matchComps.push({ comp1: comp1Promise, comp2: comp2Promise });
            }

            // Insert Matches
            const matchIds = [];
            for (let i = 0; i < 5; i++) {
                if (nullMatches.includes(i)) {
                    continue;
                }
                const matchPromise = await new Promise((resolve, reject) => {
                    const sql = `
                    INSERT INTO pro_matches (set_id, comp_1_id, comp_2_id, vod_url) VALUES ($1, $2, $3, $4) RETURNING match_id
                    `;
                    client.query(sql, [setId, matchComps[i].comp1, matchComps[i].comp2, setData.matches[i].match_vod_url], (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res.rows[0].match_id);
                        }
                    });
                });
                matchIds.push(matchPromise);
            }

            // Insert Picks / Bans / Stats
            for (let i = 0; i < 5; i++) {
                if (nullMatches.includes(i)) {
                    continue;
                }
                // Team 1 Picks
                for (let j = 0; j < 5; j++) {
                    const sql = `
                        INSERT INTO pro_picks (comp_id, pokemon_id, pick_position, player_id, position_played, move_1_id, move_2_id) VALUES ($1, $2, $3, $4, $5, $6, $7)
                    `;
                    new Promise((resolve, reject) => {
                        client.query(sql, [matchComps[i].comp1, setData.matches[i].team1_picks[j].pokemon_id, setData.matches[i].team1_picks[j].pick_position, setData.matches[i].team1_picks[j].player_id, setData.matches[i].team1_picks[j].position_played, setData.matches[i].team1_picks[j].move_1_id, setData.matches[i].team1_picks[j].move_2_id], (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    });
                }
                // Team 2 Picks
                for (let j = 0; j < 5; j++) {
                    const sql = `
                        INSERT INTO pro_picks (comp_id, pokemon_id, pick_position, player_id, position_played, move_1_id, move_2_id) VALUES ($1, $2, $3, $4, $5, $6, $7)
                    `;
                    new Promise((resolve, reject) => {
                        client.query(sql, [matchComps[i].comp2, setData.matches[i].team2_picks[j].pokemon_id, setData.matches[i].team2_picks[j].pick_position, setData.matches[i].team2_picks[j].player_id, setData.matches[i].team2_picks[j].position_played, setData.matches[i].team2_picks[j].move_1_id, setData.matches[i].team2_picks[j].move_2_id], (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        }); 
                    });
                }
                // Team 1 Bans
                for (let j = 0; j < 3; j++) {
                    const sql = `
                        INSERT INTO pro_bans (comp_id, pokemon_id, ban_position) VALUES ($1, $2, $3)
                    `;
                    new Promise((resolve, reject) => {
                        client.query(sql, [matchComps[i].comp1, setData.matches[i].team1_bans[j].pokemon_id, setData.matches[i].team1_bans[j].ban_position], (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    });
                }
                // Team 2 Bans
                for (let j = 0; j < 3; j++) {
                    const sql = `
                        INSERT INTO pro_bans (comp_id, pokemon_id, ban_position) VALUES ($1, $2, $3)
                    `;
                    new Promise((resolve, reject) => {
                        client.query(sql, [matchComps[i].comp2, setData.matches[i].team2_bans[j].pokemon_id, setData.matches[i].team2_bans[j].ban_position], (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    });
                }
                // Team 1 Stats
                for (let j = 0; j < 5; j++) {
                    if (nullStats.some(ns => ns.match === i && ns.pick === j && ns.team === 1)) {
                        continue;
                    }
                    const sql = `
                        INSERT INTO pro_performance (comp_id, pokemon_id, kills, assists, damage_dealt, damage_taken, damage_healed, points_scored) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    `;
                    new Promise((resolve, reject) => {
                        client.query(sql, [matchComps[i].comp1, setData.matches[i].team1_picks[j].pokemon_id, setData.matches[i].team1_picks[j].kills, setData.matches[i].team1_picks[j].assists, setData.matches[i].team1_picks[j].dealt, setData.matches[i].team1_picks[j].taken, setData.matches[i].team1_picks[j].healed, setData.matches[i].team1_picks[j].scored], (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    });
                }
                // Team 2 Stats
                for (let j = 0; j < 5; j++) {
                    if (nullStats.some(ns => ns.match === i && ns.pick === j && ns.team === 2)) {
                        continue;
                    }
                    const sql = `
                        INSERT INTO pro_performance (comp_id, pokemon_id, kills, assists, damage_dealt, damage_taken, damage_healed, points_scored) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    `;
                    new Promise((resolve, reject) => {
                        client.query(sql, [matchComps[i].comp2, setData.matches[i].team2_picks[j].pokemon_id, setData.matches[i].team2_picks[j].kills, setData.matches[i].team2_picks[j].assists, setData.matches[i].team2_picks[j].dealt, setData.matches[i].team2_picks[j].taken, setData.matches[i].team2_picks[j].healed, setData.matches[i].team2_picks[j].scored], (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    });
                }
            }
        
            await client.query('COMMIT'); // commit only if all succeeded
            
            return {set_id: setId, match_ids: matchIds};

        } catch (error) {
            await client.query('ROLLBACK'); // rollback automatically on any error
            throw error;
        } finally {
            client.release();
        }
    }

}

module.exports = Comps;