import React, {useState} from 'react';
import "../../css/insightsSupport/notesDisplay.css";

export default function NoteDisplay({noteData, characters}) {
    const [hoveredPokemon, setHoveredPokemon] = useState(null);

    const splitString = noteData?.text ? noteData.text.split(':') : null;

    function findCharacterName(fullString, characterNames) {
        const sorted = [...characterNames].sort((a, b) => b.pokemon_name.length - a.pokemon_name.length);
        return sorted.find(name => 
            fullString === name.pokemon_name || fullString.startsWith(name.pokemon_name + '_')
        ) ?? null;
    }
    
    const textSection = splitString ? splitString.map((segment, i) => {
        if (i % 2 === 0) {
            return <span key={i}>{segment}</span>; // plain text
        } else if (segment.includes("_bad") || segment.includes("_good") || segment.includes("_meh")) {
            const textAndFeel = segment.split('_');
            return <span key={i} className={`pillText ${textAndFeel[1]}`}>{textAndFeel[0]}</span>
        } else {
            // Is either a character or a move. Identify character first
            const pokemonName = findCharacterName(segment, characters)?.pokemon_name;
            if(!pokemonName) {
                // Malformed
                return <span key={i}>{segment}</span>;
            }
            // Check if there is more, if there is there's a move
            if (pokemonName.length === segment.length) {
                return <span key={i} className="insights-characterIcon" title={pokemonName}><img src={`/assets/Draft/headshots/${pokemonName}.png`} /></span>
            } else {
                return <span key={i} className="insights-characterMoveIcon" title={segment}><img src={`/assets/Draft/moves/${segment}.png`}/></span>
            }
        }
    }) : null;

    const bestPartners = noteData?.good_teammates ? noteData.good_teammates.map((teammate) => (
        <div key={teammate.pokemon} className="best-partner-container">
            <div
                className="best-partner-icon"
                onMouseOver={() => setHoveredPokemon(teammate.pokemon)}
                onMouseLeave={() => setHoveredPokemon(null)}
            >
                <img src={`assets/Draft/headshots/${teammate.pokemon}.png`} />
            </div>
            <div
                className="best-partner-description"
                style={{
                    visibility: hoveredPokemon === teammate.pokemon ? "visible" : "hidden",
                }}
            >
                {teammate.reason}
            </div>
        </div>
    )) : null;

    function traitsToColor(trait) {
        switch(trait) {
            case 'squishy': return 'red';
            case 'tanky': return 'green';
            case 'high_CC': return 'green';
            case 'low_CC': return 'red';
            case 'Artillery Mage': return 'blue';
            case 'burst_damage': return 'gray';
            case 'consistent_damage': return 'gray';
            case 'long_CDs': return 'red';
            case 'high_damage': return 'green';
            case 'high_mobility': return 'green';
            case 'immobile': return 'red';
            case 'Teamfight': return 'blue';
            case 'high_range': return 'green';
            case 'low_range': return 'red';
            case 'LargeAOE_damage': return 'green';
            default: return 'gray';
        }
    }

    const toTitleCase = (str) => str.replaceAll("_", " ").replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());

    const traits = noteData?.traits ? noteData.traits.map((trait) => (
        <div key={trait} className={`insights-trait-pill ${traitsToColor(trait)}`}>{toTitleCase(trait)}</div>
    )) : null;

    return (
        <>
            <div className="insights-notes-text">{textSection}</div>
            <div className="insights-notes-best-partners">
                <div className="insights-data-subtitle">Best Partners</div>
                {bestPartners}
            </div>
            <div className="insights-notes-traits">
                <div className="insights-data-subtitle">Traits</div>
                <div className="insights-data-traits">
                    {traits}
                </div>
            </div>
        </>
    );
}