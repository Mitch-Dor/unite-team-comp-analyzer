import React from 'react';
import { fetchCharacterIdAndName } from '../backendCalls/http.js';
const constants = require('../../../../common/naming_constants.js');
const routes = require('../../../../common/route_constants.js');

const CharacterList = () => {
    // Get characters from the database and create the below characters object
    const characterRawInfo = fetchCharacterIdAndName();
    console.log(characterRawInfo);
    const characters = [
        { id: 1, name: 'Character 1', imageSrc: 'path_to_image1.jpg' },
        { id: 2, name: 'Character 2', imageSrc: 'path_to_image2.jpg' },
        // Add more characters as needed
    ];

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