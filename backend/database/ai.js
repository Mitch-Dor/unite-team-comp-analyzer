// Operations that use the Draft AI
const aStar = require('./a_star/a_star');

class AI {
  /**
     * Constructor for ai class
     * @param {*} db Pass DB object into class
     */
  constructor(db) {
    this.db = db;
  }

  async runAStarAlgorithm(targetTeam, opposingTeam, bans, attributes, tierList){
    try {
      const aStarSolution = aStar.a_star_search(targetTeam, opposingTeam, bans, attributes, tierList);
      
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

  // Rate a comp using the heuristics used in A*
  async rateComp(comp, attributes, tierList) {
      // Remove nulls from comp
      const filteredComp = comp.filter(pokemon => pokemon !== null);

      const {totalScore, tierScore, synergyScore} = aStar.rateComp(filteredComp, attributes, tierList);
      return {totalScore, tierScore, synergyScore};
  }
    
}
    
module.exports = AI;