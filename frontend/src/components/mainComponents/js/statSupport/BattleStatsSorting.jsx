import React, { useEffect, useState } from 'react';
import CustomDropdown from '../proMatchSupport/CustomDropdown';
import { fetchIndividualBattleStats } from '../backendCalls/http.js';

function BattleStatsSorting({ setData, moveData, allPokemon, setKeyPokemon }) {
    const [minKills, setMinKills] = useState(0);
    const [minAssists, setMinAssists] = useState(0);
    const [minDealt, setMinDealt] = useState(0);
    const [minTaken, setMinTaken] = useState(0);
    const [minHealed, setMinHealed] = useState(0);
    const [minScored, setMinScored] = useState(0);
    const [lane, setLane] = useState("any");
    const [pokemon, setPokemon] = useState(null);
    const [move1, setMove1] = useState(null);
    const [move2, setMove2] = useState(null);

    useEffect(() => {
        // Run filter function
        const queryContext = {
            minKills: minKills,
            minAssists: minAssists,
            minDealt: minDealt,
            minTaken: minTaken,
            minHealed: minHealed,
            minScored: minScored,
            lane: lane,
            pokemon: pokemon ? pokemon.pokemon_id : null,
            move1: move1 ? move1.move_id : null,
            move2: move2 ? move2.move_id : null
        }

        if (pokemon){
            fetchIndividualBattleStats(queryContext)
                .then(data => {
                    setData(data);
                })
                .catch(error => {
                    console.error("Error fetching battle stats:", error);
            });
        }

    }, [minKills, minAssists, minDealt, minTaken, minHealed, minScored, lane, pokemon, move1, move2]);

    function lesserMoveData (pokemonName) {
        const availableMoves = pokemon ? moveData.find(move => move[0].pokemon_name === pokemonName) : null;
        
        if (!availableMoves) {
            return null;
        }

        return [{move_id: availableMoves[0].move_id, move_name: availableMoves[0].move_name}, {move_id: availableMoves[1].move_id, move_name: availableMoves[1].move_name}, {move_id: availableMoves[2].move_id, move_name: availableMoves[2].move_name}, {move_id: availableMoves[3].move_id, move_name: availableMoves[3].move_name}];
    }

    const availableMoves = pokemon ? lesserMoveData(pokemon.pokemon_name) : null;

    return (
        <div id="filterContainer">
            <h3>Filters</h3>
            <div className="filter-row">
                <input id="minKills" type="number" placeholder='Min Kills' onChange={(e) => e.target.value ? setMinKills(e.target.value) : setMinKills(0)}></input> 
                <input id="minAssists" type="number" placeholder='Min Assists' onChange={(e) => e.target.value ? setMinAssists(e.target.value) : setMinAssists(0)}></input> 
                <input id="minScored" type="number" placeholder='Min Scored' onChange={(e) => e.target.value ? setMinScored(e.target.value) : setMinScored(0)}></input> 
            </div>
            <div className="filter-row">
                <input id="minDealt" type="number" placeholder='Min Dealt' onChange={(e) => e.target.value ? setMinDealt(e.target.value) : setMinDealt(0)}></input> 
                <input id="minTaken" type="number" placeholder='Min Taken' onChange={(e) => e.target.value ? setMinTaken(e.target.value) : setMinTaken(0)}></input> 
                <input id="minHealed" type="number" placeholder='Min Healed' onChange={(e) => e.target.value ? setMinHealed(e.target.value) : setMinHealed(0)}></input> 
                <select id="laneSelect" value={lane} onChange={(e) => setLane(e.target.value)}>
                    <option value="any">Lane Select (Any)</option>
                    <option value="TopCarry">Top Carry</option>
                    <option value="EXPShareTop">EXP Share Top</option>
                    <option value="JungleCarry">Jungle Carry</option>
                    <option value="BottomCarry">Bot Carry</option>
                    <option value="EXPShareBot">EXP Share Bot</option>
                </select>
            </div>
            <div className="filter-row">
                {/* Character Dropdown */}
                <CustomDropdown
                    value={pokemon}
                    onChange={(value) => {
                        setPokemon(value);
                        setKeyPokemon(value);
                        setMove1(null);
                        setMove2(null);
                    }}
                    options={allPokemon}
                    placeholder="Character Select"
                    path="/assets/Draft/headshots"
                />
                {/* Move 1 Dropdown */}
                <CustomDropdown
                    value={move1}
                    onChange={setMove1}
                    options={availableMoves}
                    placeholder="Move 1 Select"
                    disabled={!pokemon}   
                    path="/assets/Draft/moves"
                    character_name={pokemon ? pokemon.pokemon_name : pokemon}  
                />
                {/* Move 2 Dropdown */}
                <CustomDropdown
                    value={move2}
                    onChange={setMove2}
                    options={availableMoves}
                    placeholder="Move 2 Select"
                    disabled={!pokemon}   
                    path="/assets/Draft/moves"
                    character_name={pokemon ? pokemon.pokemon_name : pokemon}  
                />
            </div>
        </div>
    )
}

export default BattleStatsSorting;