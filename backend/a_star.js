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

    // Convert string names in yourTeam to full Pokemon objects
    const yourTeamObjects = [];

    // Loop through all team member names
    for (const name of yourTeam) {
        // Find the matching Pokemon in the full data set
        const matchingPokemon = pokemonObjects.find(p => 
            p.name === name || p.id === name
        );
        
        if (matchingPokemon) {
            yourTeamObjects.push(matchingPokemon);
        } else {
            console.warn(`Pokemon "${name}" not found in available data`);
            // Create a basic Pokemon object with just the name
            yourTeamObjects.push(new Pokemon({Name: name}));
        }
    }

    // Convert string names in yourTeam to full Pokemon objects
    const enemyTeamObjects = [];

    // Loop through all team member names
    for (const name of enemyTeam) {
        // Find the matching Pokemon in the full data set
        const matchingPokemon = pokemonObjects.find(p => 
            p.name === name || p.id === name
        );
        
        if (matchingPokemon) {
            yourTeamObjects.push(matchingPokemon);
        } else {
            console.warn(`Pokemon "${name}" not found in available data`);
            // Create a basic Pokemon object with just the name
            yourTeamObjects.push(new Pokemon({Name: name}));
        }
    }

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
                const newTeam = [...currNode.picks, pokemon];
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
    const tierScore = heuristic_tier_score(yourTeam);
    const synergyScore = heuristic_synergy_score(yourTeam);
    const counterScore = heuristic_counter_score(yourTeam, enemyTeam);
    const totalScore = tierScore + synergyScore + counterScore;
    return totalScore;
}

// Heuristic function that takes in a team and returns a score based on the tier of the pokemon in the team
function heuristic_tier_score(providedTeam){
    // Hard-coded rules always
    // Larger score means WORSE tier
    const sTier = ["Absol", "Zeraora", "Inteleon", "Suicune", "Umbreon", "Snorlax", "Psyduck"];
    const aTier = ["Urshifu-SS", "Talonflame", "Leafeon", "Meowscarada", "Garchomp", "Pikachu",
                 "Zacian", "Mimikyu", "Hoopa", "Comfey", "Blissey", "Slowbro", "Mamoswine", "Metagross"];
    const bTier = ["Gengar", "Aegislash", "Dodrio", "Zoroark", "Blaziken", "Ceruledge", "Mew", "Scyther", "Espeon",
                    "Buzzwole", "MewtwoY", "Trevenant", "HoOh", "Greedent", "Wigglytuff", "Lucario", "Miraidon", "Gyarados", "Eldegoss"];
    const cTier = ["Galarian-Rapidash", "Charizard", "Cinderace", "Alolan-Ninetales", "Glaceon", "Urshifu-RS", 
                    "Venusaur", "Darkrai", "Goodra", "Sabeleye", "Blastoise", "Dragonite"];
    const dTier = ["Cramorant", "Sylveon", "Crustle", "Clefable", "MrMime", "Machamp", "Greninja", "Tyranitar"];
    const eTier = ["Chandelure", "Delphox", "Dragapult", "Gardevoir", "Decidueye", "Armarouge", "MewtwoX", "Tsareena"];
    const fTier = ["Tinkaton", "Duraludon", "Lapras", "Falinks", "Azumarill", "Scizor"];
    
    const tierPoints = {
        sTier: 1,
        aTier: 3,
        bTier: 5,
        // Anything below bTier is a lot worse unless it has a perfect matchup
        cTier: 9,
        dTier: 11,
        eTier: 13,
        fTier: 15
    }

    let totalPoints = 0;
    // For each pokemon on the team, add points based on which tier it's in
    providedTeam.forEach(pokemon => {
        if (sTier.includes(pokemon)) {
            totalPoints += tierPoints.sTier;
        } else if (aTier.includes(pokemon)) {
            totalPoints += tierPoints.aTier;
        } else if (bTier.includes(pokemon)) {
            totalPoints += tierPoints.bTier;
        } else if (cTier.includes(pokemon)) {
            totalPoints += tierPoints.cTier;
        } else if (dTier.includes(pokemon)) {
            totalPoints += tierPoints.dTier;
        } else if (eTier.includes(pokemon)) {
            totalPoints += tierPoints.eTier;
        } else if (fTier.includes(pokemon)) {
            totalPoints += tierPoints.fTier;
        }
    });

    return totalPoints;
}

// Heuristic function that takes in a team and returns a score based on that team's synergy
function heuristic_synergy_score(yourTeam){
    // Hard-coded rules for now
    // Larger score means WORSE synergy
    const attrCounts = countAttributes(yourTeam);
    let totalPoints = 0;

    if (attrCounts.earlyGame.Weak > 1) {
        // Having too many weak early game pokemon is very punishing
        totalPoints += attrCounts.earlyGame.Weak * 10 - 10;
    }
    totalPoints += attrCounts.earlyGame.Strong * 1;
    totalPoints += attrCounts.earlyGame.Medium * 3;
    totalPoints += attrCounts.earlyGame.Weak * 5;

    totalPoints += attrCounts.midGame.Strong * 1;
    totalPoints += attrCounts.midGame.Medium * 3;
    totalPoints += attrCounts.midGame.Weak * 5;

    totalPoints += attrCounts.lateGame.Strong * 1;
    totalPoints += attrCounts.lateGame.Medium * 3;
    totalPoints += attrCounts.lateGame.Weak * 5;

    totalPoints += attrCounts.mobility.High * 1;
    totalPoints += attrCounts.mobility.Medium * 3;
    totalPoints += attrCounts.mobility.Low * 5;

    if (attrCounts.range.low > 3) {
        // Too many low range pokemon 
        totalPoints += attrCounts.range.Low * 5 - 5;
    }

    if (attrCounts.bulk.High < 1) {
        // Need more bulky pokemon
        totalPoints += 6;
    }

    if (attrCounts.damage.High < 2) {
        // Can't kill tanks without high damage
        totalPoints += 6;
    }

    if (attrCounts.damage.High > 2) {
        // Having too many high damage pokemon is bad
        totalPoints += attrCounts.damage.High * 5 - 10;
    }

    // Having different play styles is bad
    Object.entries(attrCounts.playStyle).forEach(([style, count]) => {
        if (count > 0 && count < 2){
            totalPoints += 5
        }
    });

    return totalPoints;
}

// Helper function that counts the number of times each attribute appears in a team
function countAttributes(data) {
    const categories = {
        earlyGame: { Strong: 0, Medium: 0, Weak: 0 },
        midGame: { Strong: 0, Medium: 0, Weak: 0 },
        lateGame: { Strong: 0, Medium: 0, Weak: 0 },
        mobility: { High: 0, Medium: 0, Low: 0 },
        range: { High: 0, Medium: 0, Low: 0 },
        bulk: { High: 0, Medium: 0, Low: 0 },
        damage: { High: 0, Medium: 0, Low: 0 },
        damageType: { Burst: 0, Consistent: 0, "N/A": 0 },
        damageAffect: { SingleTarget: 0, SmallAOE: 0, MediumAOE: 0, LargeAOE: 0 },
        cc: { High: 0, Medium: 0, Low: 0, None: 0 },
        playStyle: { Dive: 0, Teamfight: 0, SplitMap: 0, Poke: 0, Assist: 0 },
        classification: { ADC: 0, Bruiser: 0, Assassin: 0, DrainTank: 0, UtilityMage: 0, BurstMage: 0, Healer: 0, Buffer: 0, Engage: 0 },
        OtherAttr: { AntiCC: 0, Peel: 0, Heals: 0, Lockdown: 0, SpaceControl: 0 },
    };
    
    data.forEach(entry => {
        Object.keys(categories).forEach(key => {
            if (Array.isArray(entry.attributes[key])) {
                entry.attributes[key].forEach(value => {
                    if (categories[key].hasOwnProperty(value)) {
                        categories[key][value]++;
                    }
                });
            } else if (entry.attributes[key] && categories[key].hasOwnProperty(entry.attributes[key])) {
                categories[key][entry.attributes[key]]++;
            }
        });
    });
    return categories;
}

// Heuristic function that takes in a team and returns a score based on that team's counterpicks
function heuristic_counter_score(yourTeam, enemyTeam){
    // Hard-coded rules for now
    const allyAttrCounts = countAttributes(yourTeam);
    const enemyAttrCounts = countAttributes(enemyTeam);
    let totalPoints = 70;

    // CC counters low mobility and low range
    if (enemyAttrCounts.mobility.Low > 2 || enemyAttrCounts.range.Low > 2) {
        if (allyAttrCounts.cc.High > 0) {
            totalPoints -= 10 * allyAttrCounts.cc.High;
        }
    }

    // Having a range advantage is good
    if (enemyAttrCounts.range.High == 0 && allyAttrCounts.range.High > 0) {
        totalPoints -= 10;
    }

    // Having a lot of bulk when the enemy has low damage is good
    if (enemyAttrCounts.damage.High == 0 && allyAttrCounts.bulk.High > 0) {
        totalPoints -= 10;
    }

    // Having a lot of burst damage when the enemy has low bulk is good
    if (enemyAttrCounts.bulk.High == 0 && allyAttrCounts.damageType.Burst > 0) {
        totalPoints -= 10;
    }

    // Having consistent damage when the enemy has high bulk is good
    if (enemyAttrCounts.bulk.High > 1 && allyAttrCounts.damageType.Consistent > 1) {
        totalPoints -= 10;
    }

    // Having a lot of mobility when the enemy has low mobility is good
    if (enemyAttrCounts.mobility.Low > 2 && allyAttrCounts.mobility.High > 0) {
        totalPoints -= 10;
    }

    // High safety damage dealer is good into high mobility
    if (enemyAttrCounts.mobility.High > 1) {
        yourTeam.forEach(pokemon => {
            if (pokemon.attributes.damage === "High") {
                let safetyScore = 0;
                switch (pokemon.attributes.cc) {
                    case "High":
                        safetyScore += 10;
                        break;
                    case "Medium":
                        safetyScore += 5;
                        break;
                }
                switch (pokemon.attributes.range) {
                    case "High":
                        safetyScore += 10;
                        break;
                    case "Medium":
                        safetyScore += 5;
                        break;
                        
                }
                switch (pokemon.attributes.Mobility) {
                    case "High":
                        safetyScore += 10;
                        break;
                    case "Medium":
                        safetyScore += 5;
                        break;
                }
                switch (pokemon.attributes.damageType) {
                    case "Burst":
                        safetyScore += 5;
                        break;
                }
                if (safetyScore >= 20) {
                    totalPoints -= 10;
                }
            }
        });
    }

    return totalPoints;
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

const algorithmicPerfectAnswer = a_star_search([], [], [], rawTraitData);
console.log(algorithmicPerfectAnswer);