class Pokemon {
    /**
       * Constructor for pokemon class
       * @param {*} db Pass DB object into class
       */
    constructor(db) {
      this.db = db;
    }

    //// CHARACTER INFORMATION ////

    // Characters and their corresponding moves
    async getAllCharactersAndMoves() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM playable_characters natural join pokemon_moves ORDER BY pokedex_number';
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

    // All information needed for draft pages (ids, names, classes, lanes, release date, pokedex number)
    async getAllCharacterDraftInformation(){
        return new Promise((resolve, reject) => {
            this.db.query('SELECT pokemon_id, pokemon_name, pokemon_class, can_exp_share, can_top_carry, can_jungle_carry, can_bottom_carry, best_lane, release_date, pokedex_number FROM playable_characters NATURAL JOIN pokemon_draft_information ORDER BY pokedex_number', (err, res) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            });
        });
    } 

    //// TIER LIST ////

    async getAllTierListEntries() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM tier_list natural join playable_characters ORDER BY pokedex_number';
            this.db.query(sql, (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res.rows);
            }
          });
        });
    }

    //// INSIGHTS ////

    // All Character Traits For All Pokemon
    async getAllCharacterTraits(){
        return new Promise((resolve, reject) => {
            this.db.query('select * from pokemon_traits natural join playable_characters natural join pokemon_insights ORDER BY pokedex_number', (err, res) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            });
        });
    }

      //// DIRECT TABLE FETCHING (ADMIN)

      async getTableDraftInformation(){
        return new Promise((resolve, reject) => {
            this.db.query('select * from pokemon_draft_information ORDER BY pokemon_id', (err, res) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            });
        });
    }

    async getTableInsights(){
        return new Promise((resolve, reject) => {
            this.db.query('select * from pokemon_insights ORDER BY pokemon_id', (err, res) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            });
        });
    }

    async getTableTraits(){
        return new Promise((resolve, reject) => {
            this.db.query('select * from pokemon_traits ORDER BY pokemon_id', (err, res) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            });
        });
    }

    async getIDNameMapping(){
        return new Promise((resolve, reject) => {
            this.db.query('select pokemon_id, pokemon_name from playable_characters ORDER BY pokemon_id', (err, res) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            });
        });
    }

    // Update a row on pokemon_traits table
    async updateTraitsRow(row) {
        const sql = `UPDATE pokemon_traits SET bulk = $1, range = $2, mobility = $3, cc = $4, damage = $5, damage_area = $6, damage_consistency = $7, play_style = $8, classification = $9, special_attributes = $10 WHERE pokemon_id = $11`;
      
        return new Promise((resolve, reject) => {
          this.db.query(sql, [row.bulk, row.range, row.mobility, row.cc, row.damage, row.damage_area, row.damage_consistency, row.play_style, row.classification, row.special_attributes, row.pokemon_id], (err, res) => {
            if (err) {
              console.error("SQL Error:", err.message);
              reject(err);
            } else {
              resolve({ changes: res.rowCount, message: `Updated successfully` });
            }
          });
        });
    }

    // Update strength_level column on pokemon_traits table
    async updateTraitsStrengthLevel(column) {
        const sql = `UPDATE pokemon_traits SET level_strength = $1 WHERE pokemon_id = $2`;
      
        return new Promise((resolve, reject) => {
          this.db.query(sql, [column.level_strength, column.pokemon_id], (err, res) => {
            if (err) {
              console.error("SQL Error:", err.message);
              reject(err);
            } else {
              resolve({ changes: res.rowCount, message: `Updated successfully` });
            }
          });
        });
    }

    // Update a row on pokemon_insights table
    async updateInsightsRow(row) {
        const sql = `UPDATE pokemon_insights SET text = $1, match_title = $2, match_link = $3, good_teammates = $4 WHERE pokemon_id = $5`;
      
        return new Promise((resolve, reject) => {
          this.db.query(sql, [row.text, row.match_title, row.match_link, row.good_teammates, row.pokemon_id], (err, res) => {
            if (err) {
              console.error("SQL Error:", err.message);
              reject(err);
            } else {
              resolve({ changes: res.rowCount, message: `Updated successfully` });
            }
          });
        });
    }

    // Update a row on pokemon_draft_information table
    async updateDraftInfoRow(row) {
        const sql = `UPDATE pokemon_draft_information SET can_exp_share = $1, can_top_carry = $2, can_jungle_carry = $3, can_bottom_carry = $4, best_lane = $5 WHERE pokemon_id = $6`;
      
        return new Promise((resolve, reject) => {
          this.db.query(sql, [row.can_exp_share, row.can_top_carry, row.can_jungle_carry, row.can_bottom_carry, row.best_lane, row.pokemon_id], (err, res) => {
            if (err) {
              console.error("SQL Error:", err.message);
              reject(err);
            } else {
              resolve({ changes: res.rowCount, message: `Updated successfully` });
            }
          });
        });
    }

    // Update a row on tier_list table
    async updateTierListRow(row) {
        const sql = `UPDATE tier_list SET tier_name = $1 WHERE pokemon_id = $2`;
      
        return new Promise((resolve, reject) => {
          this.db.query(sql, [row.tier_name, row.pokemon_id], (err, res) => {
            if (err) {
              console.error("SQL Error:", err.message);
              reject(err);
            } else {
              resolve({ changes: res.rowCount, message: `Updated successfully` });
            }
          });
        });
    }

    // Update entire tier_list table
    async updateTierListTable(table) {
        const sql = `
        INSERT INTO tier_list (pokemon_id, tier_name)
        VALUES ($1, $2)
        ON CONFLICT (pokemon_id) DO UPDATE SET tier_name = EXCLUDED.tier_name
        `;

        const all_rows = Object.values(table).flat();

        const results = await Promise.allSettled(
        all_rows.map(row =>
            new Promise((resolve, reject) => {
            this.db.query(sql, [row.pokemon_id, row.tier], (err, res) => {
                if (err) {
                console.error("SQL Error:", err.message);
                reject(err);
                } else {
                resolve({ pokemon_id: row.pokemon_id, changes: res.rowCount });
                }
            });
            })
        )
        );

        const failures = results
        .map((r, i) => ({ result: r, pokemon_id: all_rows[i].pokemon_id }))
        .filter(({ result }) => result.status === 'rejected');

        return {
        message: failures.length === 0
            ? `Updated successfully (${results.length} rows)`
            : `Updated with ${failures.length} failure(s)`,
        total: results.length,
        succeeded: results.length - failures.length,
        failed: failures.map(f => f.pokemon_id),
        };
    }

    // Insert a row into pokemon_traits table
    async insertTraitsRow(row) {
        const sql = `
        INSERT INTO pokemon_traits
            (pokemon_id, bulk, range, mobility, cc, damage, damage_area, damage_consistency, play_style, classification, special_attributes, level_strength)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `;

        return new Promise((resolve, reject) => {
            this.db.query(sql, [row.pokemon_id, row.bulk, row.range, row.mobility, row.cc, row.damage, row.damage_area, row.damage_consistency, row.play_style, row.classification, row.special_attributes, row.level_strength], (err, res) => {
                if (err) {
                    console.error("SQL Error:", err.message);
                    reject(err);
                } else {
                    resolve({ changes: res.rowCount, message: `Inserted successfully` });
                }
            });
        });
    }

    // Insert a row into pokemon_insights table
    async insertInsightsRow(row) {
        const sql = `
        INSERT INTO pokemon_insights 
            (pokemon_id, text, match_title, match_link, good_teammates)
        VALUES ($1, $2, $3, $4, $5)
        `;
      
        return new Promise((resolve, reject) => {
          this.db.query(sql, [row.pokemon_id, row.text, row.match_title, row.match_link, row.good_teammates], (err, res) => {
            if (err) {
              console.error("SQL Error:", err.message);
              reject(err);
            } else {
              resolve({ changes: res.rowCount, message: `Inserted successfully` });
            }
          });
        });
    }

    // Insert a row into pokemon_draft_information table
    async insertDraftInfoRow(row) {
        const sql = `
        INSERT INTO pokemon_draft_information
            (pokemon_id, can_exp_share, can_top_carry, can_jungle_carry, can_bottom_carry, best_lane)
        VALUES ($1, $2, $3, $4, $5, $6)
        `;

        return new Promise((resolve, reject) => {
            this.db.query(sql, [row.pokemon_id, row.can_exp_share, row.can_top_carry, row.can_jungle_carry, row.can_bottom_carry, row.best_lane], (err, res) => {
                if (err) {
                    console.error("SQL Error:", err.message);
                    reject(err);
                } else {
                    resolve({ changes: res.rowCount, message: `Inserted successfully` });
                }
            });
        });
    }

    // Insert a row into tier_list table
    async insertTierListRow(row) {
        const sql = `
        INSERT INTO tier_list (pokemon_id, tier_name)
        VALUES ($1, $2)
        `;

        return new Promise((resolve, reject) => {
            this.db.query(sql, [row.pokemon_id, row.tier_name], (err, res) => {
                if (err) {
                    console.error("SQL Error:", err.message);
                    reject(err);
                } else {
                    resolve({ changes: res.rowCount, message: `Inserted successfully` });
                }
            });
        });
    }

    // Insert a row into playable_characters table
    async insertCharacterRow(row) {
        const sql = `
        INSERT INTO playable_characters (pokemon_name, pokemon_class, pokedex_number, release_date)
        VALUES ($1, $2, $3, $4)
        RETURNING pokemon_id
        `;

        return new Promise((resolve, reject) => {
            this.db.query(sql, [row.pokemon_name, row.pokemon_class, row.pokedex_number, row.release_date], (err, res) => {
                if (err) {
                    console.error("SQL Error:", err.message);
                    reject(err);
                } else {
                    resolve({ changes: res.rowCount, pokemon_id: res.rows[0]?.pokemon_id, message: `Inserted successfully` });
                }
            });
        });
    }

    // Insert a row into pokemon_moves table
    async insertMoveRow(row) {
        const sql = `
        INSERT INTO pokemon_moves (move_name, pokemon_id, move_position)
        VALUES ($1, $2, $3)
        RETURNING move_id
        `;

        return new Promise((resolve, reject) => {
            this.db.query(sql, [row.move_name, row.pokemon_id, row.move_position], (err, res) => {
                if (err) {
                    console.error("SQL Error:", err.message);
                    reject(err);
                } else {
                    resolve({ changes: res.rowCount, move_id: res.rows[0]?.move_id, message: `Inserted successfully` });
                }
            });
        });
    }

}
    
module.exports = Pokemon;