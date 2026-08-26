import { getCharactersMovesDictionary } from "../common/common";
import "../../css/insightsSupport/notesDisplay.css";

export default function NoteDisplay({noteData, characters}) {
    const mockNotesData = {
        note: ":Venusaur: has two very distinct modes. :Venusaur_Solarbeam: lets him out range and :poke_good: almost anything in the game. Meanwhile, :Venusaur_Giga_Drain: + :Venusaur_Petal_Dance: turns him into a brawling behemoth with great :sustain_good:. Both movesets require him to :scale_meh: late into the game, so there needs to be a plan for getting him online through ganks or jungle scaling. :Venusaur:'s ult is very high :burst_good: damage and does very well into :sustain_meh: comps that make use of healing supports like :Clefable:. :Venusaur:'s poke is also special because it cannot be blocked, unlike other poke like :Inteleon:. :Venusaur:'s main drawback is his lack of :mobility_bad:, so enemy comps with strong :dive_bad: / :engage_bad: potential can be tough to deal with alone.",
        good_teammates: [{pokemon: "Eldegoss", reason: "Decent early game and good anti-dive with its ult."}],
        traits: ["long_range", "large_aoe_damage", "immobile", "burst", "weak_early", "strong_late"]
    };

    const splitString = mockNotesData.note.split(':');

    function findCharacterName(fullString, characterNames) {
        const sorted = [...characterNames].sort((a, b) => b.pokemon_name.length - a.pokemon_name.length);
        return sorted.find(name => 
            fullString === name.pokemon_name || fullString.startsWith(name.pokemon_name + '_')
        ) ?? null;
    }
    
    return splitString.map((segment, i) => {
        if (i % 2 === 0) {
            return <span key={i}>{segment}</span>; // plain text
        } else if (segment.includes("_bad") || segment.includes("_good") || segment.includes("_meh")) {
            const textAndFeel = segment.split('_');
            return <span key={i} className={`pillText ${textAndFeel[1]}`}>{textAndFeel[0]}</span>
        } else {
            // Is either a character or a move. Identify character first
            const pokemonName = findCharacterName(segment, characters).pokemon_name;
            if(!pokemonName) {
                // Malformed
                return <span key={i}>{segment}</span>;
            }
            // Check if there is more, if there is there's a move
            console.log(pokemonName, segment);
            if (pokemonName.length === segment.length) {
                return <span key={i} className="insights-characterIcon"><img src={`/assets/Draft/headshots/${pokemonName}.png`} /></span>
            } else {
                return <span key={i} className="insights-characterMoveIcon"><img src={`/assets/Draft/moves/${segment}.png`}/></span>
            }
        }
    });
}