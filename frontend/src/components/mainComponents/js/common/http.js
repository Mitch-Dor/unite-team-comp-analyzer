import { routes } from '../../../../constants/route_constants.js';

//// DRAFT ROUTES ////

/* Function to fetch all character names and classes */
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

/* Function to fetch all characters and moves */
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

//// TIER LIST ROUTES ////

/* Function to fetch all tier list entries */
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

/* Function to insert a tier list entry */
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

//// USER PERMISSIONS ROUTES ////

/* Function to check if a user is verified */
export async function isVerifiedUser() {
    const response = await fetch(routes.GET_IS_VERIFIED_USER, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        return false;
    }
    return true;
}

/* Function to check if a user is an admin */
export async function isAdmin() {
    const response = await fetch(routes.GET_IS_ADMIN, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        return false;
    }
    return true;
}

/* Current_User, Logout, Sign_In routes not included in this file */

//// TRAITS ROUTES ////

/* Function to fetch all character traits */
export async function fetchAllCharacterTraits() {
    const characterTraitData = await fetch(routes.GET_ALL_TRAITS, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const characterTraitDataJson = await characterTraitData.json();
    return characterTraitDataJson;
}

/* Function to update a single trait on a character */
export async function updateCharacterTrait(pokemonId, column, value) {
    const characterTraitData = await fetch(routes.PUT_CHARACTER_TRAIT, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pokemonId: pokemonId,
            column: column,
            value: value
        })
    });
    const characterTraitDataJson = await characterTraitData.json();
    return characterTraitDataJson;
}