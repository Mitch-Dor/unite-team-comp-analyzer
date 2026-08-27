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

    async insertTierListEntry(tierName, pokemonId) {
        // In one transaction, delete the entry containing the pokemon_id, then insert the new entry
        return new Promise((resolve, reject) => {
          this.db.query('BEGIN TRANSACTION');
          this.db.query('DELETE FROM tier_list WHERE pokemon_id = $1', [pokemonId], (err) => {
            if (err) {
              reject(err);
              return;
            }
            
            const sql = 'INSERT INTO tier_list (tier_name, pokemon_id) VALUES ($1, $2)';
            this.db.query(sql, [tierName, pokemonId], (err) => {
              if (err) { 
                reject(err);
              } else {
                this.db.query('COMMIT', (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                });
              }
            });
          });
        });
    }

    async formatTierList() {
        // Get the tier list data
        const tierListData = await this.getAllTierListEntries();
        
        // Format the tier list data
        // Should be an object with tier names "S" through "F" as keys, and an array of pokemon ids as values
        const tierList = {};
        tierListData.forEach(row => {
            const tierName = row.tier_name;
            const pokemonId = row.pokemon_id;
            if (!tierList[tierName]) {
                tierList[tierName] = [];
            }
            tierList[tierName].push(pokemonId);
        });
  
        return tierList;
    }

    //// INSIGHTS ////

    // Update a single character trait
    async updateInsights(pokemonId, data) {
        const sql = `UPDATE pokemon_insights SET text = $1, match_title = $2, match_link = $3, good_teammates = $4 WHERE pokemon_id = $5`;
      
        return new Promise((resolve, reject) => {
          this.db.query(sql, [data.text, data.match_title, data.match_link, data.good_teammates, pokemonId], (err, res) => {
            if (err) {
              console.error("SQL Error:", err.message);
              reject(err);
            } else {
              resolve({ changes: res.rowCount, message: `Updated successfully` });
            }
          });
        });
      }

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

    // Update a single character trait
    async updateCharacterTrait(pokemonId, column, value) {
        // whitelist of valid column names to prevent SQL injection
        const validColumns = new Set([
          'mobility', 'range', 'bulk', 'damage', 'damage_consistency', 'damage_area', 'cc',
          ' play_style', 'classification', 'special_attributes', 'lvl_1', 'lvl_2', 'lvl_3',
          'lvl_4', 'lvl_5', 'lvl_6', 'lvl_7', 'lvl_8', 'lvl_9', 'lvl_10', 'lvl_11', 'lvl_12', 
          'lvl_13', 'lvl_14', 'lvl_15'
        ]);
      
        if (!validColumns.has(column)) {
          throw new Error(`Invalid column name: ${column}`);
        }
      
        const sql = `UPDATE pokemon_traits SET ${column} = $1 WHERE pokemon_id = $2`;
      
        return new Promise((resolve, reject) => {
          this.db.query(sql, [value, pokemonId], (err, res) => {
            if (err) {
              console.error("SQL Error:", err.message);
              reject(err);
            } else {
              resolve({ changes: res.rowCount, message: `Updated ${column} successfully` });
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

}
    
module.exports = Pokemon;