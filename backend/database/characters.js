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

    // ID, Name, Class, img link
    async getAllCharacterDisplayInformation(){
      return new Promise((resolve, reject) => {
        this.db.all('select pokemon_name, pokemon_class from playable_characters', (err, rows) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }    

}

module.exports = Characters;