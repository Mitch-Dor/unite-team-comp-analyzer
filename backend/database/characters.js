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
      
    }

    async getAllCharacterIdentifyInformation(){
      return new Promise((resolve, reject) => {
        this.db.all('select pokemon_id, pokemon_name from playable_characters', (err, rows) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            console.log(rows);
            resolve(rows);
          }
        });
      });
    }    

}

module.exports = Characters;