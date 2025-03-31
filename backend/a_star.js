const MinHeap = require('./MinHeap');
const rawTraitData = require('./dataConversion/pokemonData');

// When it is the AI's turn, it will run its A* function to determine what Pokemon to pick.
// The Pokemon will have 2 scores: a counter pick score and a synergies score.
// Synergies are determined by known comps while counterpicks are hard-coded more or less.
// IDEA: Analyze that number of times each pokemon loses/wins to a certain other pokemon and use that to try and draw good counters
// Maybe could use these numbers only if there is sufficient data


function a_star_search(yourTeam, enemyTeam, bans, allPokemon) {
    // First, get a list of all remaining pokemon
    const remainingPokemon = allPokemon.filter(pokemon => 
        !yourTeam.includes(pokemon) && 
        !enemyTeam.includes(pokemon) && 
        !bans.includes(pokemon)
    );

    // Convert raw pokemon data to Pokemon objects if needed
    const pokemonObjects = remainingPokemon.map(p => 
        p instanceof Pokemon ? p : new Pokemon(p)
    );

    // Initialize open and closed sets
    let open = new MinHeap();
    let closed = new Set();

    // A class to represent a team state
    class TeamNode {
        constructor(picks = [], incurredCost = 0, heuristic = 0) {
            this.score = incurredCost + heuristic;
            this.picks = picks; // Array of Pokemon references
            this.incurredCost = incurredCost;
            this.heuristic = heuristic;
        }
        
        // Helper method to get team key
        getKey() {
            // Sort by pokemon id to ensure consistent representation
            return this.picks.map(p => p.id).sort().join('|');
        }
        
        // Helper to check if team already has this pokemon
        hasPokemon(pokemon) {
            return this.picks.some(p => p.id === pokemon.id);
        }
        
        // Create a new node with an additional pokemon
        addPokemon(pokemon, synScore, counScore) {
            // Create new picks array with the additional pokemon
            const newPicks = [...this.picks, pokemon];
            
            // Calculate new score based on previous score and new heuristics
            return new TeamNode(newPicks, this.incurredCost, synScore + counScore);
        }
    }

    // Convert existing teams to Pokemon objects
    const yourTeamObjects = yourTeam.map(name => 
        pokemonObjects.find(p => p.id === name) || new Pokemon({Name: name})
    );

    // Convert existing teams to Pokemon objects
    const enemyTeamObjects = enemyTeam.map(name => 
        pokemonObjects.find(p => p.id === name) || new Pokemon({Name: name})
    );

    // Initialize the search with whatever is currently in your team
    const startNode = new TeamNode(yourTeamObjects); // yourTeam is an array of pokemon names
    open.push(startNode);
    closed.add(startNode.getKey());

    // TODO: Could implement a cache for heuristic calculations

    // TODO: Possibly implement a MAX_ITERATIONS variable?

    /* 
        Each combination of mons starts with a score of 100.
        Good synergies / counters add less points from the score.
        Bad synergies / counters add more points from the score.
        Iterate until the object with the lowest score is one with 5 pokemon in its set.
    */
    
    while(!open.isEmpty()) {
        // Loop until the node with the lowest score is one with 5 pokemon.
        // Get the node with the lowest cost
        let currNode = open.pop();
        // Check if the node has a set of 5 pokemon
        if (currNode.picks.length === 5) {
            return currNode;
        }
        /* 
            If we added every possible pokemon to the set and added them to open, we would have n!/5!(n-5)! nodes (because 5 pokemon per team). 
            As of March 2025 there are already 50-60 pokemon in the game. Far too many to do this.
            Limit to top 4 pokemon based on heuristic score. 
            That way, if team is empty we only have 4^5 = 1024 nodes. 
        */ 
        let candidates = new MinHeap();
        // Go through every immediate candidate and computer heuristic (~50 candidates)
        for (const pokemon of pokemonObjects) {
            // Can't add a pokemon that is already in the team
            if (!currNode.hasPokemon(pokemon)){
                // Create the array with added pokemon
                const newTeam = [...currentNode.picks, pokemon];
                const teamKey = newTeam.map(p => p.id).sort().join('|'); // Create team key in same way TeamNode would
                if (!closed.has(teamKey)) { // Convert set to string for uniqueness
                    const score = heuristic(newTeam, enemyTeamObjects); // Heuristic needs to be on the teams list of Pokemon. Not a TeamNode object.
                    const candidate = new TeamNode(newTeam, currNode.score, score);
                    candidates.push(candidate);
                    // Not adding to closed because we know there will not be duplicates in pokemonObjects and I want to save memory
                }
            }
        }
        // Take the top 4 nodes from tempCollection and add them to open
        for (let i = 0; i < 4; i++){
            open.push(candidates.pop());
        }
        // As we go to the next iteration, all candidates are cleared.
    }
    return null; // Error
}

// Define a Pokemon class to store attributes more efficiently
class Pokemon {
    constructor(data) {
        this.name = data.Name;
        this.attributes = {
            earlyGame: data.EarlyGame,
            midGame: data.MidGame,
            lateGame: data.LateGame,
            mobility: data.Mobility,
            range: data.Range,
            bulk: data.Bulk,
            damage: data.Damage,
            damageType: data.DamageType,
            damageAffect: data.DamageAffect,
            cc: data.CC,
            playStyle: data.PlayStyle,
            classification: data.Classification
        };
        
        // Add a unique ID property for easier comparison
        this.id = data.Name; // Assuming Name is unique
    }
}

// Heuristic function that takes in a team and returns a score
function heuristic(yourTeam, enemyTeam){
    const synergyScore = heuristic_synergy_score(yourTeam);
    const counterScore = heuristic_counter_score(yourTeam, enemyTeam);
    return synergyScore + counterScore;
}

// Heuristic function that takes in a team and returns a score based on that team's synergy
function heuristic_synergy_score(yourTeam){
    // Hard-coded rules for now
    const attrCounts = countAttributes(yourTeam);
    console.log(attrCounts);
}

// Helper function that counts the number of times each attribute appears in a team
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

// Heuristic function that takes in a team and returns a score based on that team's counterpicks
function heuristic_counter_score(){
    // Hard-coded rules for now

}

// Helper function that takes in a team and returns a list of traits
// TODO: This will be useful later when traits are stored in database. Unused right now.
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