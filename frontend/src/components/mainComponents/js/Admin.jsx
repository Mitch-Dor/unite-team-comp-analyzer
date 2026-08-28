import React, { useState, useEffect } from 'react';
import '../css/admin.css';
import Login from "../../sideComponents/js/Login.jsx";
import TierList from "./TierList.jsx";
import { fetchIDNameMapping, fetchTableDraftInformation, fetchTableInsights, fetchTableTraits, fetchAllTierListEntries, updateTraitsTableRow, updateLevelStrengthColumn, updateInsightsTableRow, updateDraftInfoTableRow, updateTierListTableRow, postTraitsTableRow, postInsightsTableRow, postDraftInfoTableRow, postTierListTableRow, postCharacterTableRow, postMoveTableRow, isAdmin, updateTierListWholeTable } from './common/http.js';

///////// BLANK ROW GENERATORS (used to seed "New" tables)
function blankTraitRow() {
  return {
    pokemon_id: '',
    bulk: 1,
    cc: 0,
    range: 1,
    mobility: 0,
    damage: 1,
    damage_area: 'SingleTarget',
    damage_consistency: 1,
    play_style: 'Teamfight',
    classification: 'Artillery Mage',
    special_attributes: [],
    level_strength: blankLevelStrengthArray(),
  };
}

function blankLevelStrengthArray() {
  return Array.from({ length: 15 }, (_, i) => ({ level: i + 1, explanation: null, relative_power: 1 }));
}

function blankInsightRow() {
  return {
    pokemon_id: '',
    text: '',
    match_title: '',
    match_link: '',
    good_teammates: [],
  };
}

function blankDraftInfoRow() {
  return {
    pokemon_id: '',
    can_exp_share: false,
    can_top_carry: false,
    can_jungle_carry: false,
    can_bottom_carry: false,
    best_lane: 1,
  };
}

function blankTierRow() {
  return { pokemon_id: '', tier_name: 'F' };
}

function blankCharacterRow() {
  return { pokemon_name: '', pokemon_class: 'Attacker', pokedex_number: '', release_date: '' };
}

function blankMoveRow() {
  return { move_name: '', pokemon_id: '', move_position: 1 };
}

function getNameFromID(id_name_mapping, pokemon_id) {
  return id_name_mapping[Number(pokemon_id)].pokemon_name;
}

// Returns [{pokemon_id, pokemon_name}] for pokemon NOT already present in existing_data
function getAvailablePokemon(id_name_mapping, existing_data) {
  const used_ids = new Set(existing_data.map(r => Number(r.pokemon_id)));
  return id_name_mapping
    .map((p, i) => ({ pokemon_id: i, pokemon_name: p.pokemon_name }))
    .filter(p => p.pokemon_id !== 0 && !used_ids.has(p.pokemon_id));
}

function getAllPokemon(id_name_mapping) {
  return id_name_mapping
    .map((p, i) => ({ pokemon_id: i, pokemon_name: p.pokemon_name }))
    .filter(p => p.pokemon_id !== 0);
}

///////// UPDATE & POST OPTIONS SECTION
//// pokemon_traits TABLE SECTION
function Pokemon_Traits_Table({ pokemon_traits_table_data, set_pokemon_traits_table_data, id_name_mapping, submitTraits }) {
  // pokemon_id, bulk, cc, range, mobility, damage, damage_area, damage_consistency, play_style, classification, special_attributes
  return (
    <table className="admin-edit-table">
      <tr>
        <th>Pokemon</th>
        <th title="1 = Very squishy (Greninja), 2 = Can be OHKO'd but harder (Typhlosion/Sylveon/Absol), 3 = Some decent natural bulk or extra tools (Blaziken/Suicune/Psyduck), 4 = Takes several people to kill (Metagross/Scizor/Mewtwo X/Mamoswine), 5 = Survives against many people for long periods (Goodra/Crustle)">Bulk</th>
        <th title="0 = No CC or minor slow, 1 = Small Interrupt (Cinderace Blaze Kick), 2 = Medium Single Stun / Short Group Stun (Muddy Water Vaporeon / Garchomp Rush+Claw), 3 = Long Single Stun / Medium Group Stun (Heavy Slam Snorlax / Volt Tackle Pikachu), 4 = Significant CC to consistently stun large groups or single players for long times, 5 = Multiple significant stuns">CC</th>
        <th title="1 = Pokemon must be in melee range to do significant damage, 2 = Pokemon can be short range away (Metagross Gyro Ball), 3 = Pokemon can be a decent distance away (A9 Blizzard / Raichu Electro Ball / Espeon Psyshock), 4 = Somewhat long range (Miraidon charge beam), 5 = Very long range (Inteleon Snipe Shot, Venusaur Solar Beam)">Range</th>
        <th title="0 = No mobility (Venusaur), 1 = Movement buff (Raichu, Pikachu, Tinkaton), 2 = Short Dash on Long CD (able to go over small walls) (Latios, Ninetales), 3 = Long Dash on long CD or Short Dash on Short CD (Feraligatr, Machamp), 4 = Combo of Long Dash on long CD or Short Dash on Short CD or movement buffs (Leafeon / Absol), 5 = Multiple dashes and/or movement buffs (Zoroark / Talonflame)">Mobility</th>
        <th title="1 = Little to none (Blissey/Comfey/Umbreon), 2 = Small damage output (Hoopa, Mamoswine), 3 = Deals decent damage but isn't primary reason it's picked (Sylveon, Mewtwos), 4 = Good damage output (Tsareena, Metagross, Empoleon), 5 = Pumping damage (Mega Lucario, Latios, Cinderace)">Damage</th>
        <th title="SingleTarget, SmallAOE (Raichu Electro Ball), MediumAOE (A9 Blizzard, Heavy Slam Snorlax), LargeAOE (Venusaur Solarbeam, Miraidon Charge Beam)">Damage Area</th>
        <th title="How many seconds it takes for the Pokemon to get another round of damage out. (ADC = 0)">Damage Consistency</th>
        <th title="Teamfight = Target frontline down first and protect your carries. Count on them to kill enemy team frontline faster than they kill yours, Dive = Go past frontline to kill backline first with burst, Split Map = Characters that excel in 2v2s or 1v1s more than 5v5s, Poke = Characters that are good at dealing damage from long range or supporting said characters, Brawl = Stick on enemies in a drawn out fight where you out sustain the enemy while killing them">Playstyle</th>
        <th title="Artillery Mage = Character that deals a lot of damage from range with their spells (typically long cooldowns and skillshots), Control Mage = Character that controls space using their spells to manipulate enemy movement, Bruiser = Melee pokemon that gets on enemies and sticks to them while dealing damage, Drain Tank = Character with medium bulk that heals off of enemies to win long fights, Healer = Character that supports its team through healing, Buffer = Character that supports its team through buffs and shields, Disruptor = Character that impedes the enemy team through debuffs or cc, CC Tank = Character that supports its team through stunning enemies (slightly less tanky than Pure Tanks), Pure Tank = Tank that aims to soak as much damage as possible and supporting with slight amounts of CC, ADC = Character that deals high amounts of consistent damage through auto attacks, Utility Mage = Character that deals some damage with its spells but the primary purpose of its spells are its secondary effects (stuns, debuffs, etc), Assassin = Character that uses high mobility and burst to eliminate back line threats quickly">Classification</th>
        <th title="Special Attributes of a Pokemon that are uncommon like Umbreon's ability to steal shields.">Special Attributes</th>
        <th>SUBMIT</th>
      </tr>
      {pokemon_traits_table_data.map((row, idx) => (
        <tr key={idx}>
          <td>
            {getNameFromID(id_name_mapping, row.pokemon_id)}
          </td>
          <td>
            <input type="number" value={row.bulk} min="1" max="5" onChange={(e) => {
              const newValue = Number(e.target.value);
              set_pokemon_traits_table_data(prev =>
                prev.map((r, i) => (i === idx ? { ...r, bulk: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <input type="number" value={row.cc} min="0" max="5" onChange={(e) => {
              const newValue = Number(e.target.value);
              set_pokemon_traits_table_data(prev =>
                prev.map((r, i) => (i === idx ? { ...r, cc: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <input type="number" value={row.range} min="1" max="5" onChange={(e) => {
              const newValue = Number(e.target.value);
              set_pokemon_traits_table_data(prev =>
                prev.map((r, i) => (i === idx ? { ...r, range: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <input type="number" value={row.mobility} min="0" max="5" onChange={(e) => {
              const newValue = Number(e.target.value);
              set_pokemon_traits_table_data(prev =>
                prev.map((r, i) => (i === idx ? { ...r, mobility: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <input type="number" value={row.damage} min="1" max="5" onChange={(e) => {
              const newValue = Number(e.target.value);
              set_pokemon_traits_table_data(prev =>
                prev.map((r, i) => (i === idx ? { ...r, damage: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <select
              value={row.damage_area}
              onChange={(e) => {
                const newValue = e.target.value;
                set_pokemon_traits_table_data(prev =>
                  prev.map((r, i) => (i === idx ? { ...r, damage_area: newValue } : r))
                );
              }}
            >
              <option value=""></option>
              <option value="SingleTarget">Single Target</option>
              <option value="SmallAOE">Small AOE</option>
              <option value="MediumAOE">Medium AOE</option>
              <option value="LargeAOE">Large AOE</option>
            </select>
          </td>
          <td>
            <input type="number" value={row.damage_consistency} min="1" max="20" onChange={(e) => {
              const newValue = Number(e.target.value);
              set_pokemon_traits_table_data(prev =>
                prev.map((r, i) => (i === idx ? { ...r, damage_consistency: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <select
              value={row.play_style}
              onChange={(e) => {
                const newValue = e.target.value;
                set_pokemon_traits_table_data(prev =>
                  prev.map((r, i) => (i === idx ? { ...r, play_style: newValue } : r))
                );
              }}
            >
              <option value=""></option>
              <option value="Teamfight">Teamfight</option>
              <option value="Dive">Dive</option>
              <option value="Split Map">Split Map</option>
              <option value="Poke">Poke</option>
              <option value="Brawl">Brawl</option>
            </select>
          </td>
          <td>
            <select
              value={row.classification}
              onChange={(e) => {
                const newValue = e.target.value;
                set_pokemon_traits_table_data(prev =>
                  prev.map((r, i) => (i === idx ? { ...r, classification: newValue } : r))
                );
              }}
            >
              <option value=""></option>
              <option value="Artillery Mage">Artillery Mage</option>
              <option value="Control Mage">Control Mage</option>
              <option value="Bruiser">Bruiser</option>
              <option value="Drain Tank">Drain Tank</option>
              <option value="Healer">Healer</option>
              <option value="Buffer">Buffer</option>
              <option value="Disruptor">Disruptor</option>
              <option value="CC Tank">CC Tank</option>
              <option value="Pure Tank">Pure Tank</option>
              <option value="ADC">ADC</option>
              <option value="Utility Mage">Utility Mage</option>
              <option value="Assassin">Assassin</option>
            </select>
          </td>
          <td>
            <div className="special-attributes-cell">
              {(row.special_attributes || []).map((attr, attrIdx) => (
                <span key={attrIdx} className="special-attribute-tag">
                  {attr}
                  <button
                    type="button"
                    onClick={() => {
                      set_pokemon_traits_table_data(prev =>
                        prev.map((r, i) =>
                          i === idx
                            ? {
                                ...r,
                                special_attributes: r.special_attributes.filter((_, ai) => ai !== attrIdx),
                              }
                            : r
                        )
                      );
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Add attribute..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim() !== '') {
                    e.preventDefault();
                    const newAttr = e.target.value.trim();
                    set_pokemon_traits_table_data(prev =>
                      prev.map((r, i) =>
                        i === idx
                          ? { ...r, special_attributes: [...(r.special_attributes || []), newAttr] }
                          : r
                      )
                    );
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </td>
          <td>
            <button className="admin-submit-button" onClick={() => {submitTraits(pokemon_traits_table_data[idx])}}>Submit Row</button>
          </td>
        </tr>
      ))}
    </table>
  )
}

function Pokemon_Traits_Table_New({ new_trait_rows, set_new_trait_rows, available_pokemon, postTraits }) {
  return (
    <table className="admin-edit-table">
      <tr>
        <th>Pokemon</th>
        <th>Bulk</th>
        <th>CC</th>
        <th>Range</th>
        <th>Mobility</th>
        <th>Damage</th>
        <th>Damage Area</th>
        <th>Damage Consistency</th>
        <th>Playstyle</th>
        <th>Classification</th>
        <th>Special Attributes</th>
        <th>Level Strengths</th>
        <th>SUBMIT</th>
      </tr>
      {new_trait_rows.map((row, idx) => (
        <tr key={idx}>
          <td>
            <select
              value={row.pokemon_id}
              onChange={(e) => {
                const newValue = e.target.value === '' ? '' : Number(e.target.value);
                set_new_trait_rows(prev =>
                  prev.map((r, i) => (i === idx ? { ...r, pokemon_id: newValue } : r))
                );
              }}
            >
              <option value="" disabled>Select Pokemon</option>
              {available_pokemon.map(p => (
                <option key={p.pokemon_id} value={p.pokemon_id}>{p.pokemon_name}</option>
              ))}
            </select>
          </td>
          <td>
            <input type="number" value={row.bulk} min="1" max="5" onChange={(e) => {
              const newValue = Number(e.target.value);
              set_new_trait_rows(prev =>
                prev.map((r, i) => (i === idx ? { ...r, bulk: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <input type="number" value={row.cc} min="0" max="5" onChange={(e) => {
              const newValue = Number(e.target.value);
              set_new_trait_rows(prev =>
                prev.map((r, i) => (i === idx ? { ...r, cc: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <input type="number" value={row.range} min="1" max="5" onChange={(e) => {
              const newValue = Number(e.target.value);
              set_new_trait_rows(prev =>
                prev.map((r, i) => (i === idx ? { ...r, range: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <input type="number" value={row.mobility} min="0" max="5" onChange={(e) => {
              const newValue = Number(e.target.value);
              set_new_trait_rows(prev =>
                prev.map((r, i) => (i === idx ? { ...r, mobility: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <input type="number" value={row.damage} min="1" max="5" onChange={(e) => {
              const newValue = Number(e.target.value);
              set_new_trait_rows(prev =>
                prev.map((r, i) => (i === idx ? { ...r, damage: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <select
              value={row.damage_area}
              onChange={(e) => {
                const newValue = e.target.value;
                set_new_trait_rows(prev =>
                  prev.map((r, i) => (i === idx ? { ...r, damage_area: newValue } : r))
                );
              }}
            >
              <option value="SingleTarget">Single Target</option>
              <option value="SmallAOE">Small AOE</option>
              <option value="MediumAOE">Medium AOE</option>
              <option value="LargeAOE">Large AOE</option>
            </select>
          </td>
          <td>
            <input type="number" value={row.damage_consistency} min="1" max="20" onChange={(e) => {
              const newValue = Number(e.target.value);
              set_new_trait_rows(prev =>
                prev.map((r, i) => (i === idx ? { ...r, damage_consistency: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <select
              value={row.play_style}
              onChange={(e) => {
                const newValue = e.target.value;
                set_new_trait_rows(prev =>
                  prev.map((r, i) => (i === idx ? { ...r, play_style: newValue } : r))
                );
              }}
            >
              <option value="Teamfight">Teamfight</option>
              <option value="Dive">Dive</option>
              <option value="Split Map">Split Map</option>
              <option value="Poke">Poke</option>
              <option value="Brawl">Brawl</option>
            </select>
          </td>
          <td>
            <select
              value={row.classification}
              onChange={(e) => {
                const newValue = e.target.value;
                set_new_trait_rows(prev =>
                  prev.map((r, i) => (i === idx ? { ...r, classification: newValue } : r))
                );
              }}
            >
              <option value="Artillery Mage">Artillery Mage</option>
              <option value="Control Mage">Control Mage</option>
              <option value="Bruiser">Bruiser</option>
              <option value="Drain Tank">Drain Tank</option>
              <option value="Healer">Healer</option>
              <option value="Buffer">Buffer</option>
              <option value="Disruptor">Disruptor</option>
              <option value="CC Tank">CC Tank</option>
              <option value="Pure Tank">Pure Tank</option>
              <option value="ADC">ADC</option>
              <option value="Utility Mage">Utility Mage</option>
              <option value="Assassin">Assassin</option>
            </select>
          </td>
          <td>
            <div className="special-attributes-cell">
              {(row.special_attributes || []).map((attr, attrIdx) => (
                <span key={attrIdx} className="special-attribute-tag">
                  {attr}
                  <button
                    type="button"
                    onClick={() => {
                      set_new_trait_rows(prev =>
                        prev.map((r, i) =>
                          i === idx
                            ? { ...r, special_attributes: r.special_attributes.filter((_, ai) => ai !== attrIdx) }
                            : r
                        )
                      );
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Add attribute..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim() !== '') {
                    e.preventDefault();
                    const newAttr = e.target.value.trim();
                    set_new_trait_rows(prev =>
                      prev.map((r, i) =>
                        i === idx
                          ? { ...r, special_attributes: [...(r.special_attributes || []), newAttr] }
                          : r
                      )
                    );
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </td>
          <td>
            <div className="level-strength-cell">
              {(row.level_strength || blankLevelStrengthArray()).map((level_obj, level_idx) => (
                <div key={level_idx} className="level-strength-row">
                  <label>Level {level_obj.level}:</label>
                  <input
                    type="text"
                    value={level_obj.explanation || ''}
                    placeholder="Explanation..."
                    onChange={(e) => {
                      const newValue = e.target.value === '' ? null : e.target.value;
                      set_new_trait_rows(prev =>
                        prev.map((r, i) =>
                          i === idx
                            ? {
                                ...r,
                                level_strength: (r.level_strength || blankLevelStrengthArray()).map((l, li) =>
                                  li === level_idx ? { ...l, explanation: newValue } : l
                                ),
                              }
                            : r
                        )
                      );
                    }}
                  />
                  <input
                    type="number"
                    value={level_obj.relative_power}
                    min="0"
                    onChange={(e) => {
                      const newValue = Number(e.target.value);
                      set_new_trait_rows(prev =>
                        prev.map((r, i) =>
                          i === idx
                            ? {
                                ...r,
                                level_strength: (r.level_strength || blankLevelStrengthArray()).map((l, li) =>
                                  li === level_idx ? { ...l, relative_power: newValue } : l
                                ),
                              }
                            : r
                        )
                      );
                    }}
                  />
                </div>
              ))}
            </div>
          </td>
          <td>
            <button className="admin-submit-button" onClick={() => {postTraits(new_trait_rows[idx])}}>Submit Row</button>
          </td>
        </tr>
      ))}
    </table>
  )
}

//// pokemon_traits.level_strength SECTION ([{"level":1,"explanation":"text"}, repeated for 15 levels])
function Level_Strength_Table({ level_strengths_data, set_level_strengths_data, id_name_mapping, submitLevelStrength }) {
  return (
    <table className="admin-edit-table">
      <tr>
        <th>Pokemon</th>
        <th>Level Strengths</th>
        <th>SUBMIT</th>
      </tr>
      {level_strengths_data.map((row, idx) => (
        <tr key={idx}>
          <td>
            {getNameFromID(id_name_mapping, row.pokemon_id)}
          </td>
          <td>
            <div className="level-strength-cell">
              {(row.level_strength || blankLevelStrengthArray()).map((level_obj, level_idx) => (
                <div key={level_idx} className="level-strength-row">
                  <label>Level {level_obj.level}:</label>
                  <input
                    type="text"
                    value={level_obj.explanation || ''}
                    placeholder="Explanation..."
                    onChange={(e) => {
                      const newValue = e.target.value === '' ? null : e.target.value;
                      set_level_strengths_data(prev =>
                        prev.map((r, i) =>
                          i === idx
                            ? {
                                ...r,
                                level_strength: (r.level_strength || blankLevelStrengthArray()).map((l, li) =>
                                  li === level_idx ? { ...l, explanation: newValue } : l
                                ),
                              }
                            : r
                        )
                      );
                    }}
                  />
                  <input
                    type="number"
                    value={level_obj.relative_power}
                    min="0"
                    onChange={(e) => {
                      const newValue = Number(e.target.value);
                      set_level_strengths_data(prev =>
                        prev.map((r, i) =>
                          i === idx
                            ? {
                                ...r,
                                level_strength: (r.level_strength || blankLevelStrengthArray()).map((l, li) =>
                                  li === level_idx ? { ...l, relative_power: newValue } : l
                                ),
                              }
                            : r
                        )
                      );
                    }}
                  />
                </div>
              ))}
            </div>
          </td>
          <td>
            <button className="admin-submit-button" onClick={() => {submitLevelStrength(level_strengths_data[idx])}}>Submit Row</button>
          </td>
        </tr>
      ))}
    </table>
  )
}

//// pokemon_insights TABLE SECTION
function Pokemon_Insights_Table({ pokemon_insights_table_data, set_pokemon_insights_table_data, id_name_mapping, submitInsights }) {
  return (
    <table className="admin-edit-table">
      <tr>
        <th>Pokemon</th>
        <th>Text</th>
        <th>Match Title</th>
        <th>Match Link</th>
        <th>Good Teammates</th>
        <th>SUBMIT</th>
      </tr>
      {pokemon_insights_table_data.map((row, idx) => (
        <tr key={idx}>
          <td>
            {getNameFromID(id_name_mapping, row.pokemon_id)}
          </td>
          <td>
            <input type="text" value={row.text} onChange={(e) => {
              const newValue = e.target.value;
              set_pokemon_insights_table_data(prev =>
                prev.map((r, i) => (i === idx ? { ...r, text: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <input type="text" value={row.match_title} onChange={(e) => {
              const newValue = e.target.value;
              set_pokemon_insights_table_data(prev =>
                prev.map((r, i) => (i === idx ? { ...r, match_title: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <input type="text" value={row.match_link} onChange={(e) => {
              const newValue = e.target.value;
              set_pokemon_insights_table_data(prev =>
                prev.map((r, i) => (i === idx ? { ...r, match_link: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <div className="good-teammates-cell">
              {(row.good_teammates || []).map((gt, gtIdx) => (
                <span key={gtIdx} className="good-teammate-tag">
                  {gt.pokemon}: {gt.reason}
                  <button
                    type="button"
                    onClick={() => {
                      set_pokemon_insights_table_data(prev =>
                        prev.map((r, i) =>
                          i === idx
                            ? { ...r, good_teammates: r.good_teammates.filter((_, gi) => gi !== gtIdx) }
                            : r
                        )
                      );
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
              <select id={`teammate-pokemon-select-${idx}`} defaultValue="">
                <option value="" disabled>Select Pokemon</option>
                {getAllPokemon(id_name_mapping).map(p => (
                  <option key={p.pokemon_id} value={p.pokemon_name}>{p.pokemon_name}</option>
                ))}
              </select>
              <input type="text" id={`teammate-reason-input-${idx}`} placeholder="Reason..." />
              <button
                type="button"
                onClick={() => {
                  const pokemon_select = document.getElementById(`teammate-pokemon-select-${idx}`);
                  const reason_input = document.getElementById(`teammate-reason-input-${idx}`);
                  const pokemon_value = pokemon_select.value;
                  const reason_value = reason_input.value.trim();
                  if (pokemon_value && reason_value) {
                    set_pokemon_insights_table_data(prev =>
                      prev.map((r, i) =>
                        i === idx
                          ? { ...r, good_teammates: [...(r.good_teammates || []), { pokemon: pokemon_value, reason: reason_value }] }
                          : r
                      )
                    );
                    pokemon_select.value = "";
                    reason_input.value = "";
                  }
                }}
              >
                Add
              </button>
            </div>
          </td>
          <td>
            <button className="admin-submit-button" onClick={() => {submitInsights(pokemon_insights_table_data[idx])}}>Submit Row</button>
          </td>
        </tr>
      ))}
    </table>
  )
}

function Pokemon_Insights_Table_New({ new_insight_rows, set_new_insight_rows, available_pokemon, id_name_mapping, postInsights }) {
  return (
    <table className="admin-edit-table">
      <tr>
        <th>Pokemon</th>
        <th>Text</th>
        <th>Match Title</th>
        <th>Match Link</th>
        <th>Good Teammates</th>
        <th>SUBMIT</th>
      </tr>
      {new_insight_rows.map((row, idx) => (
        <tr key={idx}>
          <td>
            <select
              value={row.pokemon_id}
              onChange={(e) => {
                const newValue = e.target.value === '' ? '' : Number(e.target.value);
                set_new_insight_rows(prev =>
                  prev.map((r, i) => (i === idx ? { ...r, pokemon_id: newValue } : r))
                );
              }}
            >
              <option value="" disabled>Select Pokemon</option>
              {available_pokemon.map(p => (
                <option key={p.pokemon_id} value={p.pokemon_id}>{p.pokemon_name}</option>
              ))}
            </select>
          </td>
          <td>
            <input type="text" value={row.text} onChange={(e) => {
              const newValue = e.target.value;
              set_new_insight_rows(prev =>
                prev.map((r, i) => (i === idx ? { ...r, text: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <input type="text" value={row.match_title} onChange={(e) => {
              const newValue = e.target.value;
              set_new_insight_rows(prev =>
                prev.map((r, i) => (i === idx ? { ...r, match_title: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <input type="text" value={row.match_link} onChange={(e) => {
              const newValue = e.target.value;
              set_new_insight_rows(prev =>
                prev.map((r, i) => (i === idx ? { ...r, match_link: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <div className="good-teammates-cell">
              {(row.good_teammates || []).map((gt, gtIdx) => (
                <span key={gtIdx} className="good-teammate-tag">
                  {gt.pokemon}: {gt.reason}
                  <button
                    type="button"
                    onClick={() => {
                      set_new_insight_rows(prev =>
                        prev.map((r, i) =>
                          i === idx
                            ? { ...r, good_teammates: r.good_teammates.filter((_, gi) => gi !== gtIdx) }
                            : r
                        )
                      );
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
              <select id={`new-teammate-pokemon-select-${idx}`} defaultValue="">
                <option value="" disabled>Select Pokemon</option>
                {id_name_mapping.map((p, pi) => (
                  <option key={pi} value={p.pokemon_name}>{p.pokemon_name}</option>
                ))}
              </select>
              <input type="text" id={`new-teammate-reason-input-${idx}`} placeholder="Reason..." />
              <button
                type="button"
                onClick={() => {
                  const pokemon_select = document.getElementById(`new-teammate-pokemon-select-${idx}`);
                  const reason_input = document.getElementById(`new-teammate-reason-input-${idx}`);
                  const pokemon_value = pokemon_select.value;
                  const reason_value = reason_input.value.trim();
                  if (pokemon_value && reason_value) {
                    set_new_insight_rows(prev =>
                      prev.map((r, i) =>
                        i === idx
                          ? { ...r, good_teammates: [...(r.good_teammates || []), { pokemon: pokemon_value, reason: reason_value }] }
                          : r
                      )
                    );
                    pokemon_select.value = "";
                    reason_input.value = "";
                  }
                }}
              >
                Add
              </button>
            </div>
          </td>
          <td>
            <button className="admin-submit-button" onClick={() => {postInsights(new_insight_rows[idx])}}>Submit Row</button>
          </td>
        </tr>
      ))}
    </table>
  )
}

//// tier_list TABLE SECTION
function Tier_List_Table({ tier_list_table_data, set_tier_list_table_data, id_name_mapping, submitTierList }) {
  return (
    <table className="admin-edit-table">
      <tr>
        <th>Pokemon</th>
        <th>Tier</th>
        <th>SUBMIT</th>
      </tr>
      {tier_list_table_data.map((row, idx) => (
        <tr key={idx} className={row.tier_name}>
          <td>
            {getNameFromID(id_name_mapping, row.pokemon_id)}
          </td>
          <td>
            <select
              value={row.tier_name}
              onChange={(e) => {
                const newValue = e.target.value;
                set_tier_list_table_data(prev =>
                  prev.map((r, i) => (i === idx ? { ...r, tier_name: newValue } : r))
                );
              }}
            >
              <option value="F">F</option>
              <option value="E">E</option>
              <option value="D">D</option>
              <option value="C">C</option>
              <option value="B">B</option>
              <option value="A">A</option>
              <option value="S">S</option>
            </select>
          </td>
          <td>
            <button className="admin-submit-button" onClick={() => {submitTierList(tier_list_table_data[idx])}}>Submit Row</button>
          </td>
        </tr>
      ))}
    </table>
  )
}

function Tier_List_Visual({ submitTierListVisual }) {
  const [visual_tier_list_data, set_visual_tier_list_data] = useState([]);

  return ( 
    <>
      < TierList setAdminData={set_visual_tier_list_data} />
      <button id="tier_list_visual_submit_button" onClick={() => {submitTierListVisual(visual_tier_list_data)}}>Submit</button>
    </>
  );
}

function Tier_List_Table_New({ new_tier_rows, set_new_tier_rows, available_pokemon, postTierList }) {
  return (
    <table className="admin-edit-table">
      <tr>
        <th>Pokemon</th>
        <th>Tier</th>
        <th>SUBMIT</th>
      </tr>
      {new_tier_rows.map((row, idx) => (
        <tr key={idx}>
          <td>
            <select
              value={row.pokemon_id}
              onChange={(e) => {
                const newValue = e.target.value === '' ? '' : Number(e.target.value);
                set_new_tier_rows(prev =>
                  prev.map((r, i) => (i === idx ? { ...r, pokemon_id: newValue } : r))
                );
              }}
            >
              <option value="" disabled>Select Pokemon</option>
              {available_pokemon.map(p => (
                <option key={p.pokemon_id} value={p.pokemon_id}>{p.pokemon_name}</option>
              ))}
            </select>
          </td>
          <td>
            <select
              value={row.tier_name}
              onChange={(e) => {
                const newValue = e.target.value;
                set_new_tier_rows(prev =>
                  prev.map((r, i) => (i === idx ? { ...r, tier_name: newValue } : r))
                );
              }}
            >
              <option value="F">F</option>
              <option value="E">E</option>
              <option value="D">D</option>
              <option value="C">C</option>
              <option value="B">B</option>
              <option value="A">A</option>
              <option value="S">S</option>
            </select>
          </td>
          <td>
            <button className="admin-submit-button" onClick={() => {postTierList(new_tier_rows[idx])}}>Submit Row</button>
          </td>
        </tr>
      ))}
    </table>
  )
}

//// pokemon_draft_information SECTION
function Draft_Information_Table({ pokemon_draft_information_table_data, set_pokemon_draft_information_table_data, id_name_mapping, submitDraftInformation }) {
  return (
    <table className="admin-edit-table">
      <tr>
        <th>Pokemon</th>
        <th>Can EXP Share</th>
        <th>Can Top Carry</th>
        <th>Can Jungle Carry</th>
        <th>Can Bottom Carry</th>
        <th title="1 = Top Carry, 2 = Top EXP Share, 3 = Jungle Carry, 4 = Bottom Carry, 5 = Bot EXP Share">Best Lane</th>
        <th>SUBMIT</th>
      </tr>
      {pokemon_draft_information_table_data.map((row, idx) => (
        <tr key={idx}>
          <td>
            {getNameFromID(id_name_mapping, row.pokemon_id)}
          </td>
          <td>
            <input type="checkbox" checked={row.can_exp_share} onChange={(e) => {
              const newValue = e.target.checked;
              set_pokemon_draft_information_table_data(prev =>
                prev.map((r, i) => (i === idx ? { ...r, can_exp_share: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <input type="checkbox" checked={row.can_top_carry} onChange={(e) => {
              const newValue = e.target.checked;
              set_pokemon_draft_information_table_data(prev =>
                prev.map((r, i) => (i === idx ? { ...r, can_top_carry: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <input type="checkbox" checked={row.can_jungle_carry} onChange={(e) => {
              const newValue = e.target.checked;
              set_pokemon_draft_information_table_data(prev =>
                prev.map((r, i) => (i === idx ? { ...r, can_jungle_carry: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <input type="checkbox" checked={row.can_bottom_carry} onChange={(e) => {
              const newValue = e.target.checked;
              set_pokemon_draft_information_table_data(prev =>
                prev.map((r, i) => (i === idx ? { ...r, can_bottom_carry: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <select
              value={row.best_lane}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                set_pokemon_draft_information_table_data(prev =>
                  prev.map((r, i) => (i === idx ? { ...r, best_lane: newValue } : r))
                );
              }}
            >
              <option value={1}>Top Carry</option>
              <option value={2}>Top EXP Share</option>
              <option value={3}>Jungle Carry</option>
              <option value={4}>Bottom Carry</option>
              <option value={5}>Bot EXP Share</option>
            </select>
          </td>
          <td>
            <button className="admin-submit-button" onClick={() => {submitDraftInformation(pokemon_draft_information_table_data[idx])}}>Submit Row</button>
          </td>
        </tr>
      ))}
    </table>
  )
}

function Draft_Information_Table_New({ new_draft_info_rows, set_new_draft_info_rows, available_pokemon, postDraftInformation }) {
  return (
    <table className="admin-edit-table">
      <tr>
        <th>Pokemon</th>
        <th>Can EXP Share</th>
        <th>Can Top Carry</th>
        <th>Can Jungle Carry</th>
        <th>Can Bottom Carry</th>
        <th>Best Lane</th>
        <th>SUBMIT</th>
      </tr>
      {new_draft_info_rows.map((row, idx) => (
        <tr key={idx}>
          <td>
            <select
              value={row.pokemon_id}
              onChange={(e) => {
                const newValue = e.target.value === '' ? '' : Number(e.target.value);
                set_new_draft_info_rows(prev =>
                  prev.map((r, i) => (i === idx ? { ...r, pokemon_id: newValue } : r))
                );
              }}
            >
              <option value="" disabled>Select Pokemon</option>
              {available_pokemon.map(p => (
                <option key={p.pokemon_id} value={p.pokemon_id}>{p.pokemon_name}</option>
              ))}
            </select>
          </td>
          <td>
            <input type="checkbox" checked={row.can_exp_share} onChange={(e) => {
              const newValue = e.target.checked;
              set_new_draft_info_rows(prev =>
                prev.map((r, i) => (i === idx ? { ...r, can_exp_share: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <input type="checkbox" checked={row.can_top_carry} onChange={(e) => {
              const newValue = e.target.checked;
              set_new_draft_info_rows(prev =>
                prev.map((r, i) => (i === idx ? { ...r, can_top_carry: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <input type="checkbox" checked={row.can_jungle_carry} onChange={(e) => {
              const newValue = e.target.checked;
              set_new_draft_info_rows(prev =>
                prev.map((r, i) => (i === idx ? { ...r, can_jungle_carry: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <input type="checkbox" checked={row.can_bottom_carry} onChange={(e) => {
              const newValue = e.target.checked;
              set_new_draft_info_rows(prev =>
                prev.map((r, i) => (i === idx ? { ...r, can_bottom_carry: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <select
              value={row.best_lane}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                set_new_draft_info_rows(prev =>
                  prev.map((r, i) => (i === idx ? { ...r, best_lane: newValue } : r))
                );
              }}
            >
              <option value={1}>Top Carry</option>
              <option value={2}>Top EXP Share</option>
              <option value={3}>Jungle Carry</option>
              <option value={4}>Bottom Carry</option>
              <option value={5}>Bot EXP Share</option>
            </select>
          </td>
          <td>
            <button className="admin-submit-button" onClick={() => {postDraftInformation(new_draft_info_rows[idx])}}>Submit Row</button>
          </td>
        </tr>
      ))}
    </table>
  )
}

////////// POST ONLY SECTION
//// playable_characters
function Playable_Characters_Table_New({ new_character_rows, set_new_character_rows, postCharacter }) {
  // Creates the pokemon itself, so pokemon_name is free text, not a lookup
  return (
    <table className="admin-edit-table">
      <tr>
        <th>Pokemon Name</th>
        <th>Class</th>
        <th>Pokedex Number</th>
        <th>Release Date</th>
        <th>SUBMIT</th>
      </tr>
      {new_character_rows.map((row, idx) => (
        <tr key={idx}>
          <td>
            <input type="text" value={row.pokemon_name} onChange={(e) => {
              const newValue = e.target.value;
              set_new_character_rows(prev =>
                prev.map((r, i) => (i === idx ? { ...r, pokemon_name: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <select
              value={row.pokemon_class}
              onChange={(e) => {
                const newValue = e.target.value;
                set_new_character_rows(prev =>
                  prev.map((r, i) => (i === idx ? { ...r, pokemon_class: newValue } : r))
                );
              }}
            >
              <option value="Attacker">Attacker</option>
              <option value="All_Rounder">All_Rounder</option>
              <option value="Speedster">Speedster</option>
              <option value="Supporter">Supporter</option>
              <option value="Defender">Defender</option>
            </select>
          </td>
          <td>
            <input type="number" value={row.pokedex_number} onChange={(e) => {
              const newValue = Number(e.target.value);
              set_new_character_rows(prev =>
                prev.map((r, i) => (i === idx ? { ...r, pokedex_number: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <input type="date" value={row.release_date} onChange={(e) => {
              const newValue = e.target.value;
              set_new_character_rows(prev =>
                prev.map((r, i) => (i === idx ? { ...r, release_date: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <button className="admin-submit-button" onClick={() => {postCharacter(new_character_rows[idx])}}>Submit Row</button>
          </td>
        </tr>
      ))}
    </table>
  )
}

//// pokemon_moves
function Pokemon_Moves_Table_New({ new_move_rows, set_new_move_rows, id_name_mapping, postMove }) {
  return (
    <table className="admin-edit-table">
      <tr>
        <th>Move Name</th>
        <th>Pokemon</th>
        <th>Move Position</th>
        <th>SUBMIT</th>
      </tr>
      {new_move_rows.map((row, idx) => (
        <tr key={idx}>
          <td>
            <input type="text" value={row.move_name} onChange={(e) => {
              const newValue = e.target.value;
              set_new_move_rows(prev =>
                prev.map((r, i) => (i === idx ? { ...r, move_name: newValue } : r))
              );
            }}></input>
          </td>
          <td>
            <select
              value={row.pokemon_id}
              onChange={(e) => {
                const newValue = e.target.value === '' ? '' : Number(e.target.value);
                set_new_move_rows(prev =>
                  prev.map((r, i) => (i === idx ? { ...r, pokemon_id: newValue } : r))
                );
              }}
            >
              <option value="" disabled>Select Pokemon</option>
              {getAllPokemon(id_name_mapping).map(p => (
                <option key={p.pokemon_id} value={p.pokemon_id}>{p.pokemon_name}</option>
              ))}
            </select>
          </td>
          <td>
            <select
              value={row.move_position}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                set_new_move_rows(prev =>
                  prev.map((r, i) => (i === idx ? { ...r, move_position: newValue } : r))
                );
              }}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </td>
          <td>
            <button className="admin-submit-button" onClick={() => {postMove(new_move_rows[idx])}}>Submit Row</button>
          </td>
        </tr>
      ))}
    </table>
  )
}

function Traits() {
  const [pokemon_traits_table_data, set_pokemon_traits_table_data] = useState([]);
  const [level_strengths_data, set_level_strengths_data] = useState([]);
  const [pokemon_insights_table_data, set_pokemon_insights_table_data] = useState([]);
  const [pokemon_draft_information_table_data, set_pokemon_draft_information_table_data] = useState([]);
  const [tier_list_table_data, set_tier_list_table_data] = useState([]);
  const [id_name_mapping, set_id_name_mapping] = useState([]);
  const [current_state, set_current_state] = useState("None");

  // "New" (POST) draft row state - each is an array so multiple new rows can be staged at once
  const [new_trait_rows, set_new_trait_rows] = useState([blankTraitRow()]);
  const [new_insight_rows, set_new_insight_rows] = useState([blankInsightRow()]);
  const [new_draft_info_rows, set_new_draft_info_rows] = useState([blankDraftInfoRow()]);
  const [new_tier_rows, set_new_tier_rows] = useState([blankTierRow()]);
  const [new_character_rows, set_new_character_rows] = useState([blankCharacterRow()]);
  const [new_move_rows, set_new_move_rows] = useState([blankMoveRow()]);

  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    async function fetchAllData() {
      try {
          const traits_table_data_base = await fetchTableTraits();
          const level_strengths = traits_table_data_base.map(row => ({
            pokemon_id: row.pokemon_id,
            level_strength: row.level_strength,
          }));
          const traits_table_data = traits_table_data_base.map(
            ({ level_strength, ...rest }) => rest
          );
          const insights_table_data = (await fetchTableInsights()).filter(row => row.pokemon_id !== 0);
          const draft_information_table_data = await fetchTableDraftInformation();
          const name_id_mapping = await fetchIDNameMapping();
          const tier_data = (await fetchAllTierListEntries()).sort((a, b) => a.pokemon_id - b.pokemon_id);

          set_pokemon_traits_table_data(traits_table_data);
          set_level_strengths_data(level_strengths);
          set_pokemon_insights_table_data(insights_table_data);
          set_pokemon_draft_information_table_data(draft_information_table_data);
          set_id_name_mapping(name_id_mapping);
          set_tier_list_table_data(tier_data);
      } catch (error) {
          console.error("Error fetching data:", error);
      }
    }
    fetchAllData();
  }, [])

  useEffect(() => {
    if (user === null) return;
    async function checkAdmin() {
      try {
        const adminTruthy = await isAdmin(user);
        setAdmin(adminTruthy);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setAdmin(false); // fail closed, but at least stop hanging
      }
    }
    checkAdmin();
  }, [user]);

  ///////// SUBMIT (UPDATE) FUNCTIONS - blank, fill in with API calls
  function submitTraits(row) {
    updateTraitsTableRow(row);
  }

  function submitLevelStrength(column) {
    updateLevelStrengthColumn(column);
  }

  function submitInsights(row) {
    updateInsightsTableRow(row);
  }

  function submitDraftInformation(row) {
    updateDraftInfoTableRow(row);
  }

  function submitTierList(row) {
    updateTierListTableRow(row);
  }

  function submitTierListVisual(table) {
    updateTierListWholeTable(table);
  }

  ///////// POST (NEW) FUNCTIONS - blank, fill in with API calls
  function postTraits(row) {
    postTraitsTableRow(row);
  }

  function postInsights(row) {
    postInsightsTableRow(row);
  }

  function postDraftInformation(row) {
    postDraftInfoTableRow(row);
  }

  function postTierList(row) {
    postTierListTableRow(row);
  }

  function postCharacter(row) {
    postCharacterTableRow(row);
  }

  function postMove(row) {
    postMoveTableRow(row);
  }

  if (!user || !admin) {
    return (
      <div id="admin-main-container">
        < Login setUser={setUser} />
      </div>
    )
  }

  return (
    <div id="admin-main-container">
      <div id="admin-mode-selector">
        <div className="admin-mode-selector" onClick={() => {set_current_state("UPDATE_TRAITS")}}>UPDATE Traits</div>
        <div className="admin-mode-selector" onClick={() => {set_current_state("POST_TRAITS")}}>POST (new) Traits</div>
        <div className="admin-mode-selector" onClick={() => {set_current_state("UPDATE_LEVEL_STRENGTH")}}>UPDATE Level Strength</div>
        <div className="admin-mode-selector" onClick={() => {set_current_state("UPDATE_INSIGHTS")}}>UPDATE Insights</div>
        <div className="admin-mode-selector" onClick={() => {set_current_state("POST_INSIGHTS")}}>POST (new) Insights</div>
        <div className="admin-mode-selector" onClick={() => {set_current_state("UPDATE_DRAFT_INFO")}}>UPDATE Draft Info</div>
        <div className="admin-mode-selector" onClick={() => {set_current_state("POST_DRAFT_INFO")}}>POST (new) Draft Info</div>
        <div className="admin-mode-selector" onClick={() => {set_current_state("UPDATE_TIER_LIST")}}>UPDATE Tier List</div>
        <div className="admin-mode-selector" onClick={() => {set_current_state("POST_TIER_LIST")}}>POST (new) Tier List</div>
        <div className="admin-mode-selector" onClick={() => {set_current_state("POST_CHARACTER")}}>POST (new) Character</div>
        <div className="admin-mode-selector" onClick={() => {set_current_state("POST_MOVE")}}>POST (new) Move</div>
      </div>
      <div id="admin-edit-section">
        {current_state === "UPDATE_TRAITS" && (
          <Pokemon_Traits_Table
            pokemon_traits_table_data={pokemon_traits_table_data}
            set_pokemon_traits_table_data={set_pokemon_traits_table_data}
            id_name_mapping={id_name_mapping}
            submitTraits={submitTraits}
          />
        )}
        {current_state === "POST_TRAITS" && (
          <>
            <Pokemon_Traits_Table_New
              new_trait_rows={new_trait_rows}
              set_new_trait_rows={set_new_trait_rows}
              available_pokemon={getAvailablePokemon(id_name_mapping, pokemon_traits_table_data)}
              postTraits={postTraits}
            />
            <button className="admin-add-row-button" onClick={() => {set_new_trait_rows(prev => [...prev, blankTraitRow()])}}>+ Add Row</button>
          </>
        )}
        {current_state === "UPDATE_LEVEL_STRENGTH" && (
          <Level_Strength_Table
            level_strengths_data={level_strengths_data}
            set_level_strengths_data={set_level_strengths_data}
            id_name_mapping={id_name_mapping}
            submitLevelStrength={submitLevelStrength}
          />
        )}
        {current_state === "UPDATE_INSIGHTS" && (
          <Pokemon_Insights_Table
            pokemon_insights_table_data={pokemon_insights_table_data}
            set_pokemon_insights_table_data={set_pokemon_insights_table_data}
            id_name_mapping={id_name_mapping}
            submitInsights={submitInsights}
          />
        )}
        {current_state === "POST_INSIGHTS" && (
          <>
            <Pokemon_Insights_Table_New
              new_insight_rows={new_insight_rows}
              set_new_insight_rows={set_new_insight_rows}
              available_pokemon={getAvailablePokemon(id_name_mapping, pokemon_insights_table_data)}
              id_name_mapping={id_name_mapping}
              postInsights={postInsights}
            />
            <button className="admin-add-row-button" onClick={() => {set_new_insight_rows(prev => [...prev, blankInsightRow()])}}>+ Add Row</button>
          </>
        )}
        {current_state === "UPDATE_DRAFT_INFO" && (
          <Draft_Information_Table
            pokemon_draft_information_table_data={pokemon_draft_information_table_data}
            set_pokemon_draft_information_table_data={set_pokemon_draft_information_table_data}
            id_name_mapping={id_name_mapping}
            submitDraftInformation={submitDraftInformation}
          />
        )}
        {current_state === "POST_DRAFT_INFO" && (
          <>
            <Draft_Information_Table_New
              new_draft_info_rows={new_draft_info_rows}
              set_new_draft_info_rows={set_new_draft_info_rows}
              available_pokemon={getAvailablePokemon(id_name_mapping, pokemon_draft_information_table_data)}
              postDraftInformation={postDraftInformation}
            />
            <button className="admin-add-row-button" onClick={() => {set_new_draft_info_rows(prev => [...prev, blankDraftInfoRow()])}}>+ Add Row</button>
          </>
        )}
        {current_state === "UPDATE_TIER_LIST" && (
          // <Tier_List_Table
          //   tier_list_table_data={tier_list_table_data}
          //   set_tier_list_table_data={set_tier_list_table_data}
          //   id_name_mapping={id_name_mapping}
          //   submitTierList={submitTierList}
          // />
          < Tier_List_Visual submitTierListVisual={submitTierListVisual} />
        )}
        {current_state === "POST_TIER_LIST" && (
          <>
            <Tier_List_Table_New
              new_tier_rows={new_tier_rows}
              set_new_tier_rows={set_new_tier_rows}
              available_pokemon={getAvailablePokemon(id_name_mapping, tier_list_table_data)}
              postTierList={postTierList}
            />
            <button className="admin-add-row-button" onClick={() => {set_new_tier_rows(prev => [...prev, blankTierRow()])}}>+ Add Row</button>
          </>
        )}
        {current_state === "POST_CHARACTER" && (
          <>
            <Playable_Characters_Table_New
              new_character_rows={new_character_rows}
              set_new_character_rows={set_new_character_rows}
              postCharacter={postCharacter}
            />
            <button className="admin-add-row-button" onClick={() => {set_new_character_rows(prev => [...prev, blankCharacterRow()])}}>+ Add Row</button>
          </>
        )}
        {current_state === "POST_MOVE" && (
          <>
            <Pokemon_Moves_Table_New
              new_move_rows={new_move_rows}
              set_new_move_rows={set_new_move_rows}
              id_name_mapping={id_name_mapping}
              postMove={postMove}
            />
            <button className="admin-add-row-button" onClick={() => {set_new_move_rows(prev => [...prev, blankMoveRow()])}}>+ Add Row</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Traits;