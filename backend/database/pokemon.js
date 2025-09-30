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
            this.db.query('SELECT pokemon_id, pokemon_name, pokemon_class, can_exp_share, can_top_lane_carry, can_jungle_carry, can_bottom_lane_carry, release_date, pokedex_number FROM playable_characters NATURAL JOIN pokemon_attributes ORDER BY pokedex_number', (err, res) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            });
        });
    } 

    // Character Attributes By Name
    async getIndividualCharacterAttributes(name){
        return new Promise((resolve, reject) => {
            this.db.query('select * from pokemon_attributes where pokemon_name = $1', [name], (err, res) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            });
        });
    }

    // All Character Attributes For All Pokemon
    async getAllCharacterAttributes(){
        return new Promise((resolve, reject) => {
            this.db.query('select * from pokemon_attributes natural join playable_characters ORDER BY pokedex_number', (err, res) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            });
        });
    }

    // Update a single character attribute
    async updateCharacterAttribute(pokemonId, column, value) {
        // whitelist of valid column names to prevent SQL injection
        const validColumns = new Set([
          "early_game", "mid_game", "late_game", "mobility", "range", "bulk",
          "damage", "damage_type", "damage_affect", "cc", "play_style",
          "classification", "other_attr", "can_exp_share", "can_top_lane_carry",
          "can_jungle_carry", "can_bottom_lane_carry", "best_lane",
          "assumed_move_1", "assumed_move_2", "early_spike", "ult_level", "key_spike",
          "laning_phase", "8_50_to_7_30", "7_30_to_6_30", "6_30_to_4", "4_to_end"
        ]);
      
        if (!validColumns.has(column)) {
          throw new Error(`Invalid column name: ${column}`);
        }
      
        const sql = `UPDATE pokemon_attributes SET ${column} = $1 WHERE pokemon_id = $2`;
      
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

    async getAllInsights() {
        return new Promise((resolve, reject) => {
          this.db.query('select * from pokemon_insights', (err, res) => {
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