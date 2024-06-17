class Characters {
    /**
       * Constructor for characters class
       * @param {*} db Pass DB object into class
       */
    constructor(db) {
      this.db = db;
    }

    // SQL FUNCTIONS GO HERE
    async getCharacterTraits(name){
        const traits = this.db.prepare(`select attribute from playable_characters natural join pokemon_attributes where pokemon_name like ?`).all(name);
        console.log(traits);
        return traits;
    }

}

exports.default = Characters;