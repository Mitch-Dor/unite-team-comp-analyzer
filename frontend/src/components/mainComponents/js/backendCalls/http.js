const constants = require('../../../../common/naming_constants.js');
const routes = require('../../../../common/route_constants.js');

export async function fetchCharacterIdAndName() {
    console.log("HERE");
    const characterData = await fetch(routes.ALL_ID_NAME, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log('1');
    console.log(characterData);
    const characterDataJson = await characterData.json();
    console.log("here");
    console.log(characterDataJson);
    return characterDataJson.data;
}