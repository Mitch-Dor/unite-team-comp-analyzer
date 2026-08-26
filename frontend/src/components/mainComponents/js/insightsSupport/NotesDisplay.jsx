import React, {useState} from 'react';
import { createPortal } from "react-dom";
import "../../css/insightsSupport/notesDisplay.css";

export default function NoteDisplay({noteData, characters}) {
    const [hoveredPokemon, setHoveredPokemon] = useState(null);

    const mockNotesData = {
        note: ":Venusaur: has two very distinct modes. :Venusaur_Solarbeam: lets him out range and :poke_good: almost anything in the game. Meanwhile, :Venusaur_Giga_Drain: + :Venusaur_Petal_Dance: turns him into a brawling behemoth with great :sustain_good:. Both movesets require him to :scale_meh: late into the game, so there needs to be a plan for getting him online through ganks or jungle scaling. :Venusaur:'s ult is very high :burst_good: damage and does very well into :sustain_meh: comps that make use of healing supports like :Clefable:. :Venusaur:'s poke is also special because it cannot be blocked, unlike other poke like :Inteleon_Snipe_Shot:. :Venusaur:'s main drawback is his lack of :mobility_bad:, so enemy comps with strong :dive_bad: / :engage_bad: potential can be tough to deal with alone.",
        good_teammates: [{pokemon: "Eldegoss", reason: "Decent early game and good anti-dive with its ult."}, {pokemon: "Snorlax", reason: "Snorlax has very strong peel or engage making it flexible for supporting either moveset Venusaur wants to play."}],
        traits: ["long_range", "large_aoe_damage", "immobile", "burst", "weak_early", "strong_late"]
    };

    const splitString = mockNotesData.note.split(':');

    function findCharacterName(fullString, characterNames) {
        const sorted = [...characterNames].sort((a, b) => b.pokemon_name.length - a.pokemon_name.length);
        return sorted.find(name => 
            fullString === name.pokemon_name || fullString.startsWith(name.pokemon_name + '_')
        ) ?? null;
    }
    
    const textSection = splitString.map((segment, i) => {
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
    });

    const bestPartners = mockNotesData.good_teammates.map((teammate) => (
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
    ));

    function traitsToColor(trait) {
        switch(trait) {
            case 'long_range': return 'green';
            case 'large_aoe_damage': return 'green';
            case 'immobile': return 'red';
            case 'burst': return 'gray';
            case 'weak_early': return 'red';
            case 'strong_late': return 'green';
            default: return 'gray;'
        }
    }

    const toTitleCase = (str) => str.replaceAll("_", " ").replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());

    const traits = mockNotesData.traits.map((trait) => (
        <div key={trait} className={`insights-trait-pill ${traitsToColor(trait)}`}>{toTitleCase(trait)}</div>
    ));

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