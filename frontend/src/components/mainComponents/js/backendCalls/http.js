import { constants } from '../../../../common/naming_constants.js';
import { routes } from '../../../../common/route_constants.js';

// Function to fetch all character names and classes
export async function fetchCharacterDraftInfo() {
    const characterData = await fetch(routes.GET_ALL_DRAFT_INFO, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const characterDataJson = await characterData.json();
    return characterDataJson;
}

// Function to fetch all character attributes
export async function fetchAllCharacterAttributes() {
    const characterAttributeData = await fetch(routes.GET_ALL_ATTRIBUTES, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const characterAttributeDataJson = await characterAttributeData.json();
    return characterAttributeDataJson;
}

// Function to fetch a single character's attributes
export async function fetchCharacterAttributes(name) {
    const characterAttributeData = await fetch(routes.GET_SINGLE_ATTRIBUTES, {
        // I can't include a body in a GET request
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name
        })
    });
    const characterAttributeDataJson = await characterAttributeData.json();
    return characterAttributeDataJson;
}

// Function to update a single character's attributes
export async function updateCharacterAttributes(pokemonId, traits, userGoogleId) {
    const characterAttributeData = await fetch(routes.PUT_CHARACTER_ATTRIBUTES, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pokemonId: pokemonId,
            traits: traits,
            userGoogleId: userGoogleId
        })
    });
    const characterAttributeDataJson = await characterAttributeData.json();
    return characterAttributeDataJson;
}

// Function to run the a_star algorithm to find the best team
export async function runAStarAlgorithm(targetTeam, opposingTeam, bans) {
    const characterData = await fetch(routes.GET_RUN_A_STAR_ALGORITHM, {
        // I can't include a body in a GET request
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            targetTeam: targetTeam,
            opposingTeam: opposingTeam,
            bans: bans
        })
    });
    const characterDataJson = await characterData.json();
    return characterDataJson;
}

// Function to fetch all comps
export async function fetchAllComps() {
    const compData = await fetch(routes.GET_ALL_COMPS, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const compDataJson = await compData.json();
    return compDataJson;
}

// Function to fetch all events
export async function fetchAllEvents() {
    const eventData = await fetch(routes.GET_ALL_EVENTS, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const eventDataJson = await eventData.json();
    return eventDataJson;
}

// Function to fetch all teams
export async function fetchAllTeams() {
    const teamData = await fetch(routes.GET_ALL_TEAMS, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const teamDataJson = await teamData.json();
    return teamDataJson;
}

// Function to fetch all players
export async function fetchAllPlayers() {
    const playerData = await fetch(routes.GET_ALL_PLAYERS, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const playerDataJson = await playerData.json();
    // Append other_names to player_name for each player in parenthesis
    playerDataJson.forEach(player => {
        if (player.other_names) {
            player.player_name = player.player_name + " (" + player.other_names + ")";
        }
    });
    return playerDataJson;
}

// Function to fetch all characters and moves
export async function fetchAllCharactersAndMoves() {
    const characterMoveData = await fetch(routes.GET_ALL_CHARACTERS_AND_MOVES, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const characterMoveDataJson = await characterMoveData.json();
    return characterMoveDataJson;
}

// Function to insert an event
export async function insertEvent(name, date, vodUrl, userGoogleId) {
    const eventData = await fetch(routes.POST_EVENT, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            date: date,
            vodUrl: vodUrl,
            userGoogleId: userGoogleId
        })
    });
    const eventDataJson = await eventData.json();
    console.log("Event ID: ", eventDataJson.id);
    return eventDataJson;
}

// Function to insert a team
export async function insertTeam(name, region, userGoogleId) {
    const teamData = await fetch(routes.POST_TEAM, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            region: region,
            userGoogleId: userGoogleId
        })
    });
    const teamDataJson = await teamData.json();
    return teamDataJson;
}

// Function to insert a player
export async function insertPlayer(name, userGoogleId) {
    const playerData = await fetch(routes.POST_PLAYER, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            userGoogleId: userGoogleId
        })
    });
    const playerDataJson = await playerData.json();
    return playerDataJson;
}

// Function to insert a set
export async function insertSet(setMatches, userGoogleId) {
    const setData = await fetch(routes.POST_SET, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            setMatches: setMatches,
            userGoogleId: userGoogleId
        })
    });
    const setDataJson = await setData.json();
    return setDataJson;
}

// Function to create a new room
export async function createRoom() {
    const roomData = await fetch(routes.POST_ROOMS, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const roomDataJson = await roomData.json();
    return roomDataJson;
}

// Function to get all rooms
export async function getAllRooms() {
    const roomData = await fetch(routes.GET_ROOMS, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const roomDataJson = await roomData.json();
    return roomDataJson;
}

// Function to get room info by roomId
export async function getRoomInfo(roomId) {
    const roomData = await fetch(routes.GET_ROOM_INFO + roomId, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const roomDataJson = await roomData.json();
    return roomDataJson;
}

// Function to fetch character stats based on query context
export async function fetchCharacterStats(queryContext) {
    const statsData = await fetch(routes.GET_CHARACTER_STATS, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryContext)
    });
    const statsDataJson = await statsData.json();
    return statsDataJson;
}

// Function to rate a comp using the heuristics used in A*
export async function rateComp(comp) {
    const compData = await fetch(routes.GET_RATE_COMP, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(comp)
    });
    const compDataJson = await compData.json();
    return compDataJson;
}

// Function to fetch all tier list entries
export async function fetchAllTierListEntries() {
    const tierListData = await fetch(routes.GET_TIER_LIST, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const tierListDataJson = await tierListData.json();
    return tierListDataJson;
}

// Function to insert a tier list entry
export async function insertTierListEntry(tierName, pokemonId, googleId) {
    const response = await fetch(routes.POST_TIER_LIST_ENTRY, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tierName: tierName,
            pokemonId: pokemonId,
            googleId: googleId
        })
    }); 
    
    // Just check if status is 200, no need to parse response
    if (response.status === 200) {
        return true;
    }
    throw new Error('Failed to update tier list entry');
}

// Function to check if a user is verified
export async function isVerifiedUser(userGoogleId) {
    const response = await fetch(routes.GET_IS_VERIFIED_USER, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userGoogleId: userGoogleId
        })
    });
    const responseJson = await response.json();
    return responseJson;
}

// Function to check if a user is an admin
export async function isAdmin(userGoogleId) {
    const response = await fetch(routes.GET_IS_ADMIN, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userGoogleId: userGoogleId
        })
    });
    const responseJson = await response.json();
    return responseJson;
}

