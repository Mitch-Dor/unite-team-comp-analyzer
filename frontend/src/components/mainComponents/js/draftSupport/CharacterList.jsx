import React from 'react';
import { fetchCharacterIdAndName } from '../backendCalls/http.js';
const constants = require('../../../../common/naming_constants.js');
const routes = require('../../../../common/route_constants.js');

const CharacterList = () => {
    // Get characters from the database and create the below characters object
    const characterInfo = fetchCharacterIdAndName();
    console.log(characterInfo);
    let characters = [];
    characterInfo.forEach( (character, index) => {
        characters.push({id: character.poekmon_id, name: character.pokemon_name, imageSrc: ''}) // FIXME
    });

    return (
        <div>
            {characters.map(character => (
                <div className="draftCharacter" key={character.id}>
                    <img className="characterPortrait" src={character.imageSrc} alt={character.name} />
                    <h4>{character.name}</h4>
                </div>
            ))}
        </div>
    );
};

export default CharacterList;