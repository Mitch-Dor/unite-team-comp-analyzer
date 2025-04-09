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
        this.db.all('select pokemon_name, pokemon_class, can_exp_share, can_top_lane_carry, can_jungle_carry, can_bottom_lane_carry from playable_characters natural join pokemon_attributes', (err, rows) => {
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
}

module.exports = Characters;