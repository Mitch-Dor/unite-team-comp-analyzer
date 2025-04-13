const constants = require('../../../../common/naming_constants.js');
const routes = require('../../../../common/route_constants.js');

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
export async function updateCharacterAttributes(name, traits) {
    const characterAttributeData = await fetch(routes.PUT_CHARACTER_ATTRIBUTES, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            traits: traits
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
export async function insertEvent(name, date, vodUrl) {
    const eventData = await fetch(routes.POST_EVENT, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            date: date,
            vodUrl: vodUrl
        })
    });
    const eventDataJson = await eventData.json();
    console.log("Event ID: ", eventDataJson.id);
    return eventDataJson;
}

// Function to insert a team
export async function insertTeam(name, region) {
    const teamData = await fetch(routes.POST_TEAM, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            region: region
        })
    });
    const teamDataJson = await teamData.json();
    return teamDataJson;
}

// Function to insert a player
export async function insertPlayer(name) {
    const playerData = await fetch(routes.POST_PLAYER, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name
        })
    });
    const playerDataJson = await playerData.json();
    return playerDataJson;
}

// Function to insert a set
export async function insertSet(setMatches) {
    const setData = await fetch(routes.POST_SET, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(setMatches)
    });
    const setDataJson = await setData.json();
    return setDataJson;
}
