import React, { useEffect, useState } from 'react';
import CustomDropdown from '../proMatchSupport/CustomDropdown.jsx';

function TraitDisplay({ characters, charactersAndTraits, character, setSelectedCharacter }) {
    const [traits, setTraits] = useState([]);

    // Define column order and widths
    const allTraits = [
        { trait_name: 'pokemon_class', display_name: 'Pokemon Class', value: null },
        { trait_name: 'classification', display_name: 'Classification', value: null },
        { trait_name: 'early_game', display_name: 'Early Game', value: null },
        { trait_name: 'mid_game', display_name: 'Mid Game', value: null },
        { trait_name: 'late_game', display_name: 'Late Game', value: null },
        { trait_name: 'mobility', display_name: 'Mobility', value: null },
        { trait_name: 'range', display_name: 'Range', value: null },
        { trait_name: 'bulk', display_name: 'Bulk', value: null },
        { trait_name: 'damage', display_name: 'Damage', value: null },
        { trait_name: 'damage_type', display_name: 'Damage Type', value: null },
        { trait_name: 'damage_affect', display_name: 'Damage Affect', value: null },
        { trait_name: 'cc', display_name: 'CC', value: null },
        { trait_name: 'play_style', display_name: 'Play Style', value: null },
        { trait_name: 'other_attr', display_name: 'Other Attr', value: null },
        { trait_name: 'can_exp_share', display_name: 'Can Exp Share', value: null },
        { trait_name: 'can_top_lane_carry', display_name: 'Can Top Lane Carry', value: null },
        { trait_name: 'can_jungle_carry', display_name: 'Can Jungle Carry', value: null },
        { trait_name: 'can_bottom_lane_carry', display_name: 'Can Bottom Lane Carry', value: null },
        { trait_name: 'best_lane', display_name: 'Best Lane', value: null },
        { trait_name: 'assumed_move_1', display_name: 'Assumed Move 1', value: null },
        { trait_name: 'assumed_move_2', display_name: 'Assumed Move 2', value: null },
        { trait_name: 'early_spike', display_name: 'Early Spike', value: null },
        { trait_name: 'ult_level', display_name: 'Ult Level', value: null },
        { trait_name: 'key_spike', display_name: 'Key Spike', value: null },
        { trait_name: 'laning_phase', display_name: 'Laning Phase (1-10)', value: null },
        { trait_name: '8_50_to_7_30', display_name: '8:50-7:30 (1-10)', value: null },
        { trait_name: '7_30_to_6_30', display_name: '7:30-6:30 (1-10)', value: null },
        { trait_name: '6_30_to_4', display_name: '6:30-4:00 (1-10)', value: null },
        { trait_name: '4_to_end', display_name: '4:00-End (1-10)', value: null }
    ];

    useEffect(() => {
        if (character) {
            const traitObject = (charactersAndTraits.find(c => c.pokemon_name === character.pokemon_name));
            const traitList = allTraits.map(trait => ({
                ...trait,
                value: traitObject[trait.trait_name]
            }));
            setTraits(traitList);
        }
    }, [character, charactersAndTraits]);
    
    return (
        <div id="score-trait-display-container">
            <div id="score-trait-display-character-display">
                {character && <img src={`/assets/Draft/headshots/${character.pokemon_name}.png`} alt={character.pokemon_name} />}
            </div>
            <div id="score-trait-display-character-dropdown">
                <CustomDropdown
                    value={character}
                    onChange={setSelectedCharacter}
                    options={characters}
                    placeholder="Select Character"
                    disabled={false}
                    path="/assets/Draft/headshots"
                />
            </div>
            <div id="score-trait-display-trait-list">
                { traits.length > 0 ? (
                    traits.map(trait => (
                        <div key={trait.trait_name} className="score-trait-display-trait-list-row">
                            <div className="trait-name">
                                {trait.display_name}
                            </div>
                            <div className="trait-value">
                                {trait.value}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="score-trait-display-no-traits">
                        No traits found
                    </div>
                )}
            </div>
        </div>
    );
}

export default TraitDisplay;