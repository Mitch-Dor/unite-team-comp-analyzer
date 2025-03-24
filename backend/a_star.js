const MinHeap = require('./MinHeap');
const rawTraitData = require('./dataConversion/pokemonData');

// When it is the AI's turn, it will run its A* function to determine what Pokemon to pick.
// The Pokemon will have 2 scores: a counter pick score and a synergies score.
// Synergies are determined by known comps while counterpicks are hard-coded more or less.
// IDEA: Analyze that number of times each pokemon loses/wins to a certain other pokemon and use that to try and draw good counters
// Maybe could use these numbers only if there is sufficient data


function a_star_search(yourTeam, enemyTeam, bans, allPokemon) {
    // First, get a list of all remaining pokemon
    remainingPokemon = allPokemon.filter(pokemon => !yourTeam.includes(pokemon));
    remainingPokemon = remainingPokemon.filter(pokemon => !enemyTeam.includes(pokemon));
    remainingPokemon = remainingPokemon.filter(pokemon => !bans.includes(pokemon));

}

function heuristic(yourTeam, enemyTeam, remainingPokemon){
    let open = new MinHeap(); // A set of sets
    let closed = new Set();
    class Node {
        constructor(draft, incurredCost=0, heuristic=0) {
            this.score = incurredCost+heuristic;
            this.draft = draft;
            this.incurredCost = incurredCost;
            this.heuristic = heuristic;
        }
    }
    let finalTeam = new Node(new Set());

    // Each combination of mons starts with a score of 100.
    // Good synergies / counters add less points from the score.
    // Bad synergies / counters add more points from the score.
    // Iterate until the object with the lowest score is one with 5 pokemon in its set.

    while(true) {
        // Loop until the node with the lowest score is one with 5 pokemon.
        if (!open.isEmpty()) {
            // Get the node with the lowest cost
            let currNode = open.pop();
            // Check if the node has a set of 5 pokemon
            if (currNode.draft.length === 5) {
                return currNode;
            }
            // Add every possible pokemon to this node with calculated costs
            let currSet = new Set(currNode.draft);
            remainingPokemon.forEach((pokemon) => {
                if (!currSet.has(pokemon)){
                    let nextSet = new Set(currSet);
                    nextSet.add(pokemon);
                    if (!closed.has(JSON.stringify([...nextSet]))) { // Convert set to string for uniqueness
                        closed.add(JSON.stringify([...nextSet]));
                        const synScore = heuristic_synergy_score(nextSet);
                        const counScore = heuristic_counter_score(nextSet, enemyTeam);
                        const aNode = new Node(nextSet, currNode.score, synScore+counScore);
                        open.push(aNode);
                    }
                }
            });
        } else {
            // Initialize a set of all of the current team's pokemon + one pokemon, for every currently available pokemon
            let teamSet = new Set();
            yourTeam.forEach((pokemon) => {
                teamSet.add(pokemon);
            });
            remainingPokemon.forEach((pokemon) => {
                if (!teamSet.has(pokemon)){
                    let nextSet = new Set(teamSet);
                    nextSet.add(pokemon);
                    const synScore = heuristic_synergy_score(nextSet);
                    const counScore = heuristic_counter_score(nextSet, enemyTeam);
                    const aNode = new Node(nextSet, 0, synScore+counScore);
                    open.push(aNode);
                }
            });
        }
    }
}

function heuristic_synergy_score(yourTeam){
    // Hard-coded rules for now
    const attrCounts = countAttributes(yourTeam);
    console.log(attrCounts);
}

function countAttributes(data) {
    const categories = {
        EarlyGame: {}, MidGame: {}, LateGame: {},
        Mobility: {}, Range: {}, Bulk: {}, Damage: {},
        DamageType: {}, DamageAffect: {}, CC: {},
        PlayStyle: {}, Classification: {}, OtherAttr: {}
    };
    
    data.forEach(entry => {
        Object.keys(categories).forEach(key => {
            if (Array.isArray(entry[key])) {
                entry[key].forEach(value => {
                    categories[key][value] = (categories[key][value] || 0) + 1;
                });
            } else if (entry[key]) {
                categories[key][entry[key]] = (categories[key][entry[key]] || 0) + 1;
            }
        });
    });

    return categories;
}


function heuristic_counter_score(){
    // Hard-coded rules for now

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

function getSynergies(){
    // Basically do a select all on the known comps table
}

function compareTwoComps(){

}

heuristic_synergy_score([rawTraitData[0], rawTraitData[2]]);