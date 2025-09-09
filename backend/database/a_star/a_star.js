const MinHeap = require('./MinHeap');

// Calculate the best draft possible given both current teams and the pokemon that are available to be picked.
function a_star_search(yourTeam, enemyTeam, bans, allPokemon, tierList) {
    // Convert raw pokemon data to Pokemon objects if needed
    const pokemonObjects = allPokemon.map(p => 
        p instanceof Pokemon ? p : new Pokemon(p)
    );
    
    // Get a list of all remaining pokemon (Not picked or banned)
    const remainingPokemon = pokemonObjects.filter(pokemon => {
        
        // Check if this pokemon is already in your team
        const inYourTeam = yourTeam.some(teamPokemon => 
            teamPokemon.pokemon_id && teamPokemon.pokemon_id === pokemon.pokemon_id
        );
        
        // Check if this pokemon is already in enemy team
        const inEnemyTeam = enemyTeam.some(teamPokemon => 
            teamPokemon.pokemon_id && teamPokemon.pokemon_id === pokemon.pokemon_id
        );
        
        // Check if this pokemon is banned
        const isBanned = bans.some(bannedPokemon => 
            bannedPokemon.pokemon_id && bannedPokemon.pokemon_id === pokemon.pokemon_id
        );

        // Special cases where if a certain pokemon is in your team, enemy team, or banned, another pokemon is automatically unpickable
        if (pokemon.pokemon_name === "Scyther" && (yourTeam.some(p => p.pokemon_name === "Scizor") || enemyTeam.some(p => p.pokemon_name === "Scizor") || bans.some(p => p.pokemon_name === "Scizor"))) {
            return false;
        } else if (pokemon.pokemon_name === "Scizor" && (yourTeam.some(p => p.pokemon_name === "Scyther") || enemyTeam.some(p => p.pokemon_name === "Scyther") || bans.some(p => p.pokemon_name === "Scyther"))) {
            return false;
        } else if (pokemon.pokemon_name === "Urshifu_SS" && (yourTeam.some(p => p.pokemon_name === "Urshifu_RS") || enemyTeam.some(p => p.pokemon_name === "Urshifu_RS") || bans.some(p => p.pokemon_name === "Urshifu_RS"))) {
            return false;
        } else if (pokemon.pokemon_name === "Urshifu_RS" && (yourTeam.some(p => p.pokemon_name === "Urshifu_SS") || enemyTeam.some(p => p.pokemon_name === "Urshifu_SS") || bans.some(p => p.pokemon_name === "Urshifu_SS"))) {
            return false;
        } else if (pokemon.pokemon_name === "Mewtwo_Y" && (yourTeam.some(p => p.pokemon_name === "Mewtwo_X") || enemyTeam.some(p => p.pokemon_name === "Mewtwo_X") || bans.some(p => p.pokemon_name === "Mewtwo_X"))) {
            return false;
        } else if (pokemon.pokemon_name === "Mewtwo_X" && (yourTeam.some(p => p.pokemon_name === "Mewtwo_Y") || enemyTeam.some(p => p.pokemon_name === "Mewtwo_Y") || bans.some(p => p.pokemon_name === "Mewtwo_Y"))) {
            return false;
        }
        
        // Return true if the pokemon is not in any of these collections
        return !inYourTeam && !inEnemyTeam && !isBanned;
    });

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
            return this.picks.map(p => p.pokemon_id).sort().join('|');
        }
        
        // Helper to check if team already has this pokemon
        hasPokemon(pokemon) {
            return this.picks.some(p => p.pokemon_id === pokemon.pokemon_id);
        }

        // Helper to check if team already has this pokemon's adjacent pokemon
        hasAdjacentPokemon(pokemon) {
            if (pokemon.pokemon_name === "Scyther") {
                return this.picks.some(p => p.pokemon_name === "Scizor");
            } else if (pokemon.pokemon_name === "Scizor") {
                return this.picks.some(p => p.pokemon_name === "Scyther");
            } else if (pokemon.pokemon_name === "Urshifu_SS") {
                return this.picks.some(p => p.pokemon_name === "Urshifu_RS");
            } else if (pokemon.pokemon_name === "Urshifu_RS") {
                return this.picks.some(p => p.pokemon_name === "Urshifu_SS");
            } else if (pokemon.pokemon_name === "Mewtwo_Y") {
                return this.picks.some(p => p.pokemon_name === "Mewtwo_X");
            } else if (pokemon.pokemon_name === "Mewtwo_X") {
                return this.picks.some(p => p.pokemon_name === "Mewtwo_Y");
            }
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
    for (const pokemon of yourTeam) {
        // Find the matching Pokemon in the full data set
        const matchingPokemon = pokemonObjects.find(pokemonObject => 
            pokemonObject.pokemon_id === pokemon.pokemon_id
        );
        
        if (matchingPokemon) {
            yourTeamObjects.push(matchingPokemon);
        } else {
            console.warn(`Pokemon "${pokemon.pokemon_id}" not found in available data`);
            // Create a basic Pokemon object with just the name
            yourTeamObjects.push(new Pokemon({pokemon_id: pokemon.pokemon_id}));
        }
    }

    // Convert string names in yourTeam to full Pokemon objects
    const enemyTeamObjects = [];

    // Loop through all team member names
    for (const pokemon of enemyTeam) {
        // Find the matching Pokemon in the full data set
        const matchingPokemon = pokemonObjects.find(pokemonObject => 
            pokemonObject.pokemon_id === pokemon.pokemon_id
        );
        
        if (matchingPokemon) {
            enemyTeamObjects.push(matchingPokemon);
        } else {
            console.warn(`Pokemon "${pokemon.pokemon_id}" not found in available data`);
            // Create a basic Pokemon object with just the name
            enemyTeamObjects.push(new Pokemon({pokemon_id: pokemon.pokemon_id}));
        }
    }

    // Initialize the search with whatever is currently in your team or if your team is empty, add a node for every available pokemon
    if (yourTeamObjects.length > 0) {
        // If your team has a pokemon that has an alternate form, create nodes for each combination of alternate forms
        const alternateFormsMap = {
            "Scyther": "Scizor",
            "Scizor": "Scyther",
            "Urshifu_SS": "Urshifu_RS",
            "Urshifu_RS": "Urshifu_SS"
        };

        const generateCombinations = (team, index = 0) => {
            if (index >= team.length) {
                open.push(new TeamNode(team));
                return;
            }

            const currentPokemon = team[index];
            const alternateFormName = alternateFormsMap[currentPokemon.pokemon_name];

            if (alternateFormName) {
                const alternateForm = pokemonObjects.find(p => p.pokemon_name === alternateFormName);
                if (alternateForm) {
                    // Create a new team with the alternate form
                    const newTeamWithAlt = [...team];
                    newTeamWithAlt[index] = alternateForm;
                    generateCombinations(newTeamWithAlt, index + 1);
                }
            }

            // Continue with the current form
            generateCombinations(team, index + 1);
        };

        generateCombinations(yourTeamObjects);
    } else {
        for (const pokemon of remainingPokemon) {
            const teamNode = new TeamNode([pokemon]);
            open.push(teamNode);
        }
    }

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
        for (const pokemon of remainingPokemon) {
            // Can't add a pokemon that is already in the team
            if (!currNode.hasPokemon(pokemon) && !currNode.hasAdjacentPokemon(pokemon)){
                // Create the array with added pokemon
                const newTeam = [...currNode.picks, pokemon];
                const teamKey = newTeam.map(p => p.id).sort().join('|'); // Create team key in same way TeamNode would
                if (!closed.has(teamKey)) { // Convert set to string for uniqueness
                    const score = heuristic(newTeam, enemyTeamObjects, tierList); // Heuristic needs to be on the teams list of Pokemon. Not a TeamNode object.
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
        this.name = data.pokemon_name;
        this.pokemon_id = data.pokemon_id; // Unique
        this.attributes = {
            earlyGame: data.early_game,
            midGame: data.mid_game,
            lateGame: data.late_game,
            mobility: data.mobility,
            range: data.range,
            bulk: data.bulk,
            damage: data.damage,
            damageType: data.damage_type,
            damageAffect: data.damage_affect,
            cc: data.cc,
            playStyle: data.play_style,
            classification: data.classification,
            otherAttr: data.other_attr,
            canExpShare: data.can_exp_share,
            canTopLaneCarry: data.can_top_lane_carry,
            canJungleCarry: data.can_jungle_carry,
            canBottomLaneCarry: data.can_bottom_lane_carry,
            bestLane: data.best_lane,
            assumedMove1: data.assumed_move_1,
            assumedMove2: data.assumed_move_2,
            class: data.pokemon_class,
            earlySpike: data.early_spike,
            ultLevel: data.ult_level,
            keySpike: data.key_spike,
            laningPhase: data.laning_phase,
            "8_50_to_7_30": data["8_50_to_7_30"],
            "7_30_to_6_30": data["7_30_to_6_30"],
            "6_30_to_4": data["6_30_to_4"],
            "4_to_end": data["4_to_end"],
        };
    }
}

// Heuristic function that takes in a team and returns a score
function heuristic(yourTeam, enemyTeam, tierList){
    const tierScore = heuristic_tier_score(yourTeam, tierList);
    const synergyScore = heuristic_synergy_score(yourTeam);
    const counterScore = heuristic_counter_score(yourTeam, enemyTeam);
    const totalScore = tierScore + synergyScore + counterScore;
    return totalScore;
}

// Heuristic function that takes in a team and returns a score based on the tier of the pokemon in the team
function heuristic_tier_score(providedTeam, tierList){
    const tierPoints = {
        sTier: 1,
        aTier: 8,
        bTier: 15,
        // Anything below bTier is a lot worse unless it has a perfect matchup
        cTier: 30,
        dTier: 50,
        eTier: 70,
        fTier: 90
    }

    let totalPoints = 0;
    // For each pokemon on the team, add points based on which tier it's in
    providedTeam.forEach(pokemon => {
        if (tierList.S.includes(pokemon.pokemon_id)) {
            totalPoints += tierPoints.sTier;
        } else if (tierList.A.includes(pokemon.pokemon_id)) {
            totalPoints += tierPoints.aTier;
        } else if (tierList.B.includes(pokemon.pokemon_id)) {
            totalPoints += tierPoints.bTier;
        } else if (tierList.C.includes(pokemon.pokemon_id)) {
            totalPoints += tierPoints.cTier;
        } else if (tierList.D.includes(pokemon.pokemon_id)) {
            totalPoints += tierPoints.dTier;
        } else if (tierList.E.includes(pokemon.pokemon_id)) {
            totalPoints += tierPoints.eTier;
        } else if (tierList.F.includes(pokemon.pokemon_id)) {
            totalPoints += tierPoints.fTier;
        } else {
            console.error("Pokemon not found in tier list: " + pokemon);
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

    if (attrCounts.range.low > 3) {
        // Too many low range pokemon 
        totalPoints += attrCounts.range.Low * 5 - 5;
    }

    if (attrCounts.bulk.Low > 1) {
        // Need more bulky pokemon
        totalPoints += attrCounts.bulk.Low * 5 - 5;
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
    Object.entries(attrCounts.playStyle).forEach(([_style, count]) => { // _ to make linter ignore it
        if (count > 0 && count < 2){
            totalPoints += 5
        }
    });

    /// Role distribution is probably the most important set of traits, so heavily tax bad role distributions.

    // You need at least 2 pokemon that can exp share
    if (attrCounts.canExpShare.Yes < 2 && yourTeam.length == 5) {
        totalPoints += 100;
    }

    // If you get to 5 pokemon, and the team can't have at least 1 pokemon fill every role, that's very bad.
    if (checkRoles(yourTeam, attrCounts) == false) {
        totalPoints += 100;
    }

    // Check if the team can fill every role
    function checkRoles(team, attrCounts) {
        if (team.length == 4) {
            // Make sure the team can cover at least 4 roles
            if (attrCounts.canExpShare.Yes < 1) {
                return false;
            }
            if ((attrCounts.canTopLaneCarry.Yes < 1 && attrCounts.canJungleCarry.Yes < 1) || (attrCounts.canTopLaneCarry.Yes < 1 && attrCounts.canBottomLaneCarry.Yes < 1) || (attrCounts.canJungleCarry.Yes < 1 && attrCounts.canBottomLaneCarry.Yes < 1)) {
                return false;
            }
        }
        if (team.length != 5) {
            // Don't penalize yet
            return true;
        }
        if (attrCounts.canTopLaneCarry.Yes < 1 || attrCounts.canJungleCarry.Yes < 1 || attrCounts.canBottomLaneCarry.Yes < 1 || attrCounts.canExpShare.Yes < 2) {
            // Don't have enough traits in general to fill every role
            return false;
        }
        // Check unique pokemon to be able to fill all roles (EX: one pokemon can't be a top laner and a jungle carry)
        let topLane = null;
        let topEXPShare = null;
        let jungle = null;
        let botLane = null;
        let botEXPShare = null;
        
        // First pass: assign pokemon that MUST fill specific roles
        for (const pokemon of team) {
            // Must fill this role because they can only play this role
            if (pokemon.attributes.canTopLaneCarry === "Yes" && pokemon.attributes.canExpShare === "No" && pokemon.attributes.canJungleCarry === "No" && pokemon.attributes.canBottomLaneCarry === "No") {
                topLane = pokemon;
            }
            if (pokemon.attributes.canExpShare === "Yes" && pokemon.attributes.canTopLaneCarry === "No" && pokemon.attributes.canJungleCarry === "No" && pokemon.attributes.canBottomLaneCarry === "No") {
                if (topEXPShare === null) {
                    topEXPShare = pokemon;
                } else if (botEXPShare === null) {
                    botEXPShare = pokemon;
                }
            }
            if (pokemon.attributes.canJungleCarry === "Yes" && pokemon.attributes.canExpShare === "No" && pokemon.attributes.canTopLaneCarry === "No" && pokemon.attributes.canBottomLaneCarry === "No") {
                jungle = pokemon;
            }
            if (pokemon.attributes.canBottomLaneCarry === "Yes" && pokemon.attributes.canExpShare === "No" && pokemon.attributes.canTopLaneCarry === "No" && pokemon.attributes.canJungleCarry === "No") {
                botLane = pokemon;
            }
            
            // Must fill this role because they are the only Pokemon that can fill it
            if (pokemon.attributes.canTopLaneCarry === "Yes" && attrCounts.canTopLaneCarry.Yes === 1) {
                topLane = pokemon;
            }
            if (pokemon.attributes.canJungleCarry === "Yes" && attrCounts.canJungleCarry.Yes === 1) {
                jungle = pokemon;
            }
            if (pokemon.attributes.canBottomLaneCarry === "Yes" && attrCounts.canBottomLaneCarry.Yes === 1) {
                botLane = pokemon;
            }
            if (pokemon.attributes.canExpShare === "Yes" && attrCounts.canExpShare.Yes === 2) {
                if (topEXPShare === null) {
                    topEXPShare = pokemon;
                } else if (botEXPShare === null && topEXPShare !== pokemon) {
                    botEXPShare = pokemon;
                }
            }
        }
        
        // Second pass: try to fill remaining roles with flexible pokemon
        // Get unassigned Pokemon
        const unassignedPokemon = team.filter(p => 
            p !== topLane && p !== topEXPShare && p !== jungle && p !== botLane && p !== botEXPShare
        );
        
        // Helper function to get all permutations of an array
        function getPermutations(arr) {
            if (arr.length <= 1) return [arr];
            let result = [];
            
            for (let i = 0; i < arr.length; i++) {
                const current = arr[i];
                const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
                const permutationsOfRemaining = getPermutations(remaining);
                
                for (let perm of permutationsOfRemaining) {
                    result.push([current, ...perm]);
                }
            }
            
            return result;
        }
        
        // Get all permutations of unassigned Pokemon
        const permutations = getPermutations(unassignedPokemon);
        
        // Try all possible combinations to fill remaining roles
        for (const perm of permutations) {
            for (const pokemon of perm) {
                // Try to fill top lane
                if (topLane === null && pokemon.attributes.canTopLaneCarry === "Yes") {
                    topLane = pokemon;
                }
                // Try to fill jungle
                else if (jungle === null && pokemon.attributes.canJungleCarry === "Yes") {
                    jungle = pokemon;
                }
                // Try to fill bottom lane
                else if (botLane === null && pokemon.attributes.canBottomLaneCarry === "Yes") {
                    botLane = pokemon;
                }
                // Try to fill top exp share
                else if (topEXPShare === null && pokemon.attributes.canExpShare === "Yes") {
                    topEXPShare = pokemon;
                }
                // Try to fill bottom exp share
                else if (botEXPShare === null && pokemon.attributes.canExpShare === "Yes") {
                    botEXPShare = pokemon;
                }
            }
            // All roles filled
            if (topLane !== null && topEXPShare !== null && jungle !== null && botLane !== null && botEXPShare !== null) {
                return true;
            }
        }
        
        // Roles could not be filled
        return false;
    }

    // If we don't have these best roles it's bad
    // EXP Shares are generally more important to have on their proper role
    // This will also trend the model towards picking EXP Shares early unless there is a good counter elsewhere which is generally good
    if (attrCounts.bestLane.EXPShareTop < 1) {
        totalPoints += 80;
    }
    if (attrCounts.bestLane.EXPShareBot < 1) {
        totalPoints += 80;
    }
    // Lanes are less important on their proper role, jungle especially so
    if (attrCounts.bestLane.TopLane < 1) {
        totalPoints += 40;
    }
    if (attrCounts.bestLane.JungleCarry < 1) {
        totalPoints += 20;
    }
    if (attrCounts.bestLane.BottomCarry < 1) {
        totalPoints += 40;
    }

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
        class: { Attacker: 0, Defender: 0, Supporter: 0, Speedster: 0, AllRounder: 0 },
        otherAttr: { AntiCC: 0, Peel: 0, Heals: 0, Lockdown: 0, SpaceControl: 0 },
        canExpShare: { Yes: 0, No: 0 },
        canTopLaneCarry: { Yes: 0, No: 0 },
        canJungleCarry: { Yes: 0, No: 0 },
        canBottomLaneCarry: { Yes: 0, No: 0 },
        bestLane: { TopLane: 0, JungleCarry: 0, BottomCarry: 0, EXPShareTop: 0, EXPShareBot: 0 },
    };
    
    data.forEach(entry => {
        Object.keys(categories).forEach(key => {
            if (Array.isArray(entry.attributes[key])) {
                entry.attributes[key].forEach(value => {
                    if (Object.prototype.hasOwnProperty.call(categories[key], value)) {
                        categories[key][value]++;
                    }
                });
            } else if (entry.attributes[key] && Object.prototype.hasOwnProperty.call(categories[key], entry.attributes[key])) {
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
                switch (pokemon.attributes.mobility) {
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

function rateComp(comp, allPokemon, tierList){
    // Get all pokemon objects
    const pokemonObjects = allPokemon.map(p => 
        p instanceof Pokemon ? p : new Pokemon(p)
    );

    // Make pokemon objects
    const yourTeamObjects = [];

    // Loop through all team member names
    for (const name of comp) {
        // Find the matching Pokemon in the full data set
        const matchingPokemon = pokemonObjects.find(pokemon => 
            pokemon.name === name.pokemon_name || pokemon.id === name.pokemon_name
        );
        
        if (matchingPokemon) {
            yourTeamObjects.push(matchingPokemon);
        } else {
            console.warn(`Pokemon "${name.pokemon_name}" not found in available data`);
            // Create a basic Pokemon object with just the name
            yourTeamObjects.push(new Pokemon({pokemon_name: name.pokemon_name}));
        }
    }
    // Throw it into the heuristics
    const tierScore = heuristic_tier_score(yourTeamObjects, tierList);
    const synergyScore = heuristic_synergy_score(yourTeamObjects);
    const totalScore = tierScore + synergyScore;
    return {totalScore, tierScore, synergyScore};
}

// const algorithmicPerfectAnswer = a_star_search([], [], [], rawTraitData);
// console.log(algorithmicPerfectAnswer);

module.exports = { a_star_search, rateComp };