const constants = require('../../../../common/naming_constants.js');
const routes = require('../../../../common/route_constants.js');

export async function fetchCharacterDisplayInfo() {
    const characterData = await fetch(routes.ALL_ID_NAME, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const characterDataJson = await characterData.json();
    return characterDataJson;
}