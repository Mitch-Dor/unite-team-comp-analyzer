const constants = require('../../../../common/naming_constants.js');
const routes = require('../../../../common/route_constants.js');

// Function to fetch all character names and classes
export async function fetchCharacterDisplayInfo() {
    const characterData = await fetch(routes.GET_ALL_ID_NAME, {
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
    const characterData = await fetch(routes.GET_ALL_ATTRIBUTES, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const characterDataJson = await characterData.json();
    return characterDataJson;
}

// Function to fetch a single character's attributes
export async function fetchCharacterAttributes(name) {
    const characterData = await fetch(routes.GET_SINGLE_ATTRIBUTES, {
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
    const characterDataJson = await characterData.json();
    return characterDataJson;
}

// Function to update a single character's attributes
export async function updateCharacterAttributes(name, traits) {
    const characterData = await fetch(routes.PUT_CHARACTER_ATTRIBUTES, {
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
    const characterDataJson = await characterData.json();
    return characterDataJson;
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
