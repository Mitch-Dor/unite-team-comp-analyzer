// When it is the AI's turn, it will run its A* function to determine what Pokemon to pick.
// The Pokemon will have 2 scores: a counter pick score and a synergies score.
// Synergies are determined by known comps while counterpicks are hard-coded more or less.
// IDEA: Analyze that number of times each pokemon loses/wins to a certain other pokemon and use that to try and draw good counters
// Maybe could use these numbers only if there is sufficient data


export function a_star_search(yourTeam, enemyTeam) {
    
}

function getTeamTraits(givenTeam) {
    // do a for each loop on givenTeam to get the pokemon and then get each of their traits
    let teamTraits = [];
    givenTeam.forEach( function(individualPokemon) {
        let pokemonTraits = getCharacterTraits(individualPokemon);
        pokemonTraits.forEach( function(trait) {
            teamTraits.push(trait);
        });
    });
    return teamTraits;
}

function getKnownComps(){
    // Basically do a select all on the known comps table
}

function compareClosenessOfComps(){
    // Go through each comp in known comps and do compareTwoComps and return the one with greatest 
}

function compareTwoComps(){

}