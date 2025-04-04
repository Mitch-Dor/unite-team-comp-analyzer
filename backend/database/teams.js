const aStar = require('./a_star/a_star');

class Teams {
    /**
       * Constructor for teams class
       * @param {*} db Pass DB object into class
       */
    constructor(db) {
      this.db = db;
    }

     // ID, Name, Class, img link
     async runAStarAlgorithm(targetTeam, opposingTeam, bans){
      try {
        // Properly wait for the database result by wrapping it in a Promise
        const rawTraitData = await new Promise((resolve, reject) => {
          this.db.all('select * from pokemon_attributes natural join playable_characters', (err, rows) => {
            if (err) {
              console.error('Database error:', err);
              reject(err);
            } else {
              console.log('Retrieved trait data:', rows.length, 'records');
              resolve(rows);
            }
          });
        });
        
        const aStarSolution = aStar.a_star_search(targetTeam, opposingTeam, bans, rawTraitData);
        
        // Transform the solution to a simplified format
        if (aStarSolution && aStarSolution.picks) {
          const simplifiedSolution = aStarSolution.picks.map(pokemon => ({
            pokemon_name: pokemon.name,
            pokemon_class: pokemon.attributes.class
          }));
          
          return simplifiedSolution;
        }
        
        return []; // Return empty array if no solution was found
      } catch (error) {
        console.error('Error in runAStarAlgorithm:', error);
        throw error;
      }
    }    

}

module.exports = Teams;