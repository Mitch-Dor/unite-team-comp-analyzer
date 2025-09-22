const aStar = require('./a_star/a_star');

class Comps {
    /**
       * Constructor for comps class
       * @param {*} db Pass DB object into class
       */
    constructor(db) {
      this.db = db;
    }

    // Get all data from matches, comps, picks, and bans tables
    async getAllComps() {
      return new Promise((resolve, reject) => {
        const sql = `
        WITH match_winners AS (
    -- Step 1: Compute match winners and scores per match
    SELECT
        m.match_id,
        m.set_id,
        tr1.team_id AS team1_id,
        tr1.team_name AS team1_name,
        tr1.team_region AS team1_region,
        tr1.wins AS team1_score,
        tr2.team_id AS team2_id,
        tr2.team_name AS team2_name,
        tr2.team_region AS team2_region,
        tr2.wins AS team2_score,
        CASE
            WHEN tr1.wins > tr2.wins THEN tr1.team_id
            WHEN tr2.wins > tr1.wins THEN tr2.team_id
            ELSE NULL -- tie
        END AS match_winner,
        CASE
            WHEN tr1.wins > tr2.wins THEN tr1.team_name
            WHEN tr2.wins > tr1.wins THEN tr2.team_name
            ELSE NULL -- tie
        END AS match_winner_text,
        m.comp_1_id,
        m.comp_2_id
    FROM (
        SELECT m.match_id, c.team_id, pt.team_name, pt.team_region, SUM(CASE WHEN c.did_win THEN 1 ELSE 0 END) AS wins
        FROM matches m
        JOIN comps c ON c.comp_id IN (m.comp_1_id, m.comp_2_id)
        JOIN professional_teams pt ON c.team_id = pt.team_id
        GROUP BY m.match_id, c.team_id, pt.team_name, pt.team_region
    ) tr1
    JOIN (
        SELECT m.match_id, c.team_id, pt.team_name, pt.team_region, SUM(CASE WHEN c.did_win THEN 1 ELSE 0 END) AS wins
        FROM matches m
        JOIN comps c ON c.comp_id IN (m.comp_1_id, m.comp_2_id)
        JOIN professional_teams pt ON c.team_id = pt.team_id
        GROUP BY m.match_id, c.team_id, pt.team_name, pt.team_region
    ) tr2
      ON tr1.match_id = tr2.match_id AND tr1.team_id < tr2.team_id -- remove duplicate pairs and reversed pairing
    JOIN matches m ON m.match_id = tr1.match_id
)

SELECT
    s.*, e.*,
    -- Array of matches with picks and match winner
    (
        SELECT json_agg(
            json_build_object(
                'match_id', mw.match_id,
                'team1_id', mw.team1_id,
                'team1_name', pt2.team_name,
                'team1_region', pt2.team_region,
                'team2_id', mw.team2_id,
                'team2_name', pt3.team_name,
                'team2_region', pt3.team_region,
                'match_winner_id', mw.match_winner,
                'match_winner_text', pt1.team_name,
                'comp1_picks', (
                    SELECT json_agg(json_build_object(
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
                        'move_2_name', pm2.move_name
                    ) ORDER BY p.pick_position)
                    FROM picks p
                    JOIN playable_characters pc ON p.pokemon_id = pc.pokemon_id
                    JOIN professional_players pp ON p.player_id = pp.player_id
                    JOIN pokemon_moves pm1 ON p.move_1_id = pm1.move_id
                    JOIN pokemon_moves pm2 ON p.move_2_id = pm2.move_id
                    WHERE p.comp_id = mw.comp_1_id
                ),
                'comp1_bans', (
                    SELECT json_agg(json_build_object(
                        'pokemon_id', b.pokemon_id,
                        'pokemon_name', pc.pokemon_name,
                        'ban_position', b.ban_position
                    ) ORDER BY b.ban_position)
                    FROM bans b
                    JOIN playable_characters pc ON b.pokemon_id = pc.pokemon_id
                    WHERE b.comp_id = mw.comp_1_id
                ),
                'comp2_picks', (
                    SELECT json_agg(json_build_object(
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
                        'move_2_name', pm2.move_name
                    ) ORDER BY p.pick_position)
                    FROM picks p
                    JOIN playable_characters pc ON p.pokemon_id = pc.pokemon_id
                    JOIN professional_players pp ON p.player_id = pp.player_id
                    JOIN pokemon_moves pm1 ON p.move_1_id = pm1.move_id
                    JOIN pokemon_moves pm2 ON p.move_2_id = pm2.move_id
                    WHERE p.comp_id = mw.comp_2_id
                ),
                'comp2_bans', (
                    SELECT json_agg(json_build_object(
                        'pokemon_id', b.pokemon_id,
                        'pokemon_name', pc.pokemon_name,
                        'ban_position', b.ban_position
                    ) ORDER BY b.ban_position)
                    FROM bans b
                    JOIN playable_characters pc ON b.pokemon_id = pc.pokemon_id
                    WHERE b.comp_id = mw.comp_2_id
                )
            ) ORDER BY mw.match_id
        )
        FROM match_winners mw
        JOIN professional_teams pt1 ON pt1.team_id = mw.match_winner
        JOIN professional_teams pt2 ON pt2.team_id = mw.team1_id
        JOIN professional_teams pt3 ON pt3.team_id = mw.team2_id 
        WHERE mw.set_id = s.set_id
    ) AS matches,

    -- Compute set scores per team
    (
    SELECT json_agg(
        json_build_object(
            'team_id', sub.team_id,
            'team_name', sub.team_name,
            'wins', sub.wins
        )
    )
    FROM (
        SELECT
            mw.match_winner AS team_id,
            mw.match_winner_text AS team_name,
            COUNT(*) AS wins
        FROM match_winners mw
        WHERE mw.set_id = s.set_id
        GROUP BY mw.match_winner, mw.match_winner_text
    ) AS sub
) AS set_score,

    -- Overall set winner (team with most match wins)
    (
        SELECT 
            json_build_object (
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

FROM professional_sets s
JOIN events e ON s.event_id = e.event_id


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

}

module.exports = Comps;