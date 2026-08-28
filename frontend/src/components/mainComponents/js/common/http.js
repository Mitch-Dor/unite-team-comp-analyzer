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

//// ADMIN ////

export async function fetchTableDraftInformation() {
    const tableData = await fetch(routes.GET_TABLE_DRAFT_INFORMATION, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const tableDataJson = await tableData.json();
    return tableDataJson;
}

export async function fetchTableInsights() {
    const tableData = await fetch(routes.GET_TABLE_INSIGHTS, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const tableDataJson = await tableData.json();
    return tableDataJson;
}

export async function fetchTableTraits() {
    const tableData = await fetch(routes.GET_TABLE_TRAITS, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const tableDataJson = await tableData.json();
    return tableDataJson;
}

export async function fetchIDNameMapping() {
    const mapData = await fetch(routes.GET_ID_NAME_MAPPING, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const mapDataJson = await mapData.json();
    return mapDataJson;
}

/* Function to update a single row on a pokemon_traits table */
export async function updateTraitsTableRow(row) {
    const successData = await fetch(routes.UPDATE_TRAITS_TABLE_ROW, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            row: row
        })
    });
    const successDataJson = await successData.json();
    return successDataJson;
}

/* Function to update a level_strength column on pokemon_traits table */
export async function updateLevelStrengthColumn(column) {
    const successData = await fetch(routes.UPDATE_STRENGTH_LEVEL, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            column: column
        })
    });
    const successDataJson = await successData.json();
    return successDataJson;
}


/* Function to update a single row on a pokemon_insights table */
export async function updateInsightsTableRow(row) {
    const successData = await fetch(routes.UPDATE_INSIGHTS_TABLE_ROW, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            row: row
        })
    });
    const successDataJson = await successData.json();
    return successDataJson;
}

/* Function to update a single row on pokemon_draft_information table */
export async function updateDraftInfoTableRow(row) {
    const successData = await fetch(routes.UPDATE_DRAFT_INFO_TABLE_ROW, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            row: row
        })
    });
    const successDataJson = await successData.json();
    return successDataJson;
}

/* Function to update a single row on tier_list table */
export async function updateTierListTableRow(row) {
    const successData = await fetch(routes.UPDATE_TIER_LIST_TABLE_ROW, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            row: row
        })
    });
    const successDataJson = await successData.json();
    return successDataJson;
}

/* Function to post a new row to pokemon_traits table */
export async function postTraitsTableRow(row) {
    const successData = await fetch(routes.POST_TRAITS_TABLE_ROW, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            row: row
        })
    });
    const successDataJson = await successData.json();
    return successDataJson;
}

/* Function to post a new row to pokemon_insights table */
export async function postInsightsTableRow(row) {
    const successData = await fetch(routes.POST_INSIGHTS_TABLE_ROW, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            row: row
        })
    });
    const successDataJson = await successData.json();
    return successDataJson;
}


/* Function to post a new row to pokemon_draft_information table */
export async function postDraftInfoTableRow(row) {
    const successData = await fetch(routes.POST_DRAFT_INFO_TABLE_ROW, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            row: row
        })
    });
    const successDataJson = await successData.json();
    return successDataJson;
}

/* Function to post a new row to tier_list table */
export async function postTierListTableRow(row) {
    const successData = await fetch(routes.POST_TIER_LIST_TABLE_ROW, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            row: row
        })
    });
    const successDataJson = await successData.json();
    return successDataJson;
}

/* Function to post a new row to playable_characters table */
export async function postCharacterTableRow(row) {
    const successData = await fetch(routes.POST_CHARACTER_TABLE_ROW, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            row: row
        })
    });
    const successDataJson = await successData.json();
    return successDataJson;
}

/* Function to post a new row to pokemon_moves table */
export async function postMoveTableRow(row) {
    const successData = await fetch(routes.POST_MOVE_TABLE_ROW, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            row: row
        })
    });
    const successDataJson = await successData.json();
    return successDataJson;
}

