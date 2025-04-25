import React, { useEffect, useState } from 'react';
import { fetchAllEvents, fetchAllTeams, fetchAllPlayers, fetchAllCharactersAndMoves, fetchCharacterStats } from './backendCalls/http.js';
import '../css/stats.css';

function Stats() {
    const [events, setEvents] = useState([]);
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [charactersAndMoves, setCharactersAndMoves] = useState([]);
    const [regions, setRegions] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [data, setData] = useState([]);
    const [orderBy, setOrderBy] = useState("all");
    const [moveData, setMoveData] = useState([]);

    useEffect(() => {
        async function fetchAllData() {
            try {
                // Fetch all data to prepopulate dropdowns
                const fetchedEvents = await fetchAllEvents();
                const fetchedTeams = await fetchAllTeams();
                const fetchedPlayers = await fetchAllPlayers();
                const fetchedCharactersAndMoves = await fetchAllCharactersAndMoves();  
                // Only add unique regions
                const fetchedRegions = [...new Set(fetchedTeams.map((team) => team.team_region))];
                setRegions(fetchedRegions.sort((a, b) => a.localeCompare(b)));
            
                // Get unique pokemon_name and pokemon_id combinations
                const uniquePokemon = [...new Set(fetchedCharactersAndMoves.map(char => JSON.stringify({pokemon_name: char.pokemon_name, pokemon_id: char.pokemon_id})))].map(str => JSON.parse(str)); 
                setCharacters(uniquePokemon);
                // Sort all in alphabetical order
                setEvents(fetchedEvents.sort((a, b) => a.event_name.localeCompare(b.event_name)));
                setTeams(fetchedTeams.sort((a, b) => a.team_name.localeCompare(b.team_name)));
                setPlayers(fetchedPlayers.sort((a, b) => a.player_name.localeCompare(b.player_name)));
                // Doesn't need to be sorted. Is already in order of creation / proper move order
                setCharactersAndMoves(fetchedCharactersAndMoves);
                // Cumulate all the moves for each character
                const cumulativeMoves = [];
                for (const character of uniquePokemon) {
                    const characterMoves = fetchedCharactersAndMoves.filter(move => move.pokemon_name === character.pokemon_name);
                    const moveObj = {
                        pokemon_name: character.pokemon_name,
                        move_1_1: characterMoves[0].move_name,
                    };

                    switch (character.pokemon_name) {
                        // 2 move pokemon
                        case "Mew": 
                        case "Urshifu_SS": 
                        case "Urshifu_RS":
                        case "Blaziken":
                            moveObj.move_2_1 = characterMoves[1].move_name;
                            moveObj.move_combos = [[characterMoves[0].move_name, characterMoves[1].move_name]];
                            break;

                        // 3 move pokemon
                        case "Scyther":
                        case "Scizor":
                            moveObj.move_2_1 = characterMoves[1].move_name;
                            moveObj.move_2_2 = characterMoves[2].move_name;
                            moveObj.move_combos = [[characterMoves[0].move_name, characterMoves[1].move_name], [characterMoves[0].move_name, characterMoves[2].move_name]];
                            break;

                        // 4 move pokemon
                        default: 
                            moveObj.move_1_2 = characterMoves[1].move_name;
                            moveObj.move_2_1 = characterMoves[2].move_name;
                            moveObj.move_2_2 = characterMoves[3].move_name;
                            moveObj.move_combos = [[characterMoves[0].move_name, characterMoves[2].move_name], [characterMoves[0].move_name, characterMoves[3].move_name], [characterMoves[1].move_name, characterMoves[2].move_name], [characterMoves[1].move_name, characterMoves[3].move_name]];
                            break;
                    }
                    cumulativeMoves.push(moveObj);
                }
                setMoveData(cumulativeMoves);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchAllData();
    }, []);

  return (
    <div id="mainContainer">
        <StatsOrdering setOrderBy={setOrderBy} />
        <StatsSorting events={events} teams={teams} players={players} regions={regions} setData={setData} moveData={moveData} />
        <div id="statsContainer">
            {data.length > 0 ? (
                <div className="stats-table-container">
                    {/* Vision For The Table: Display bar graphs of the "Order By" column for every Pokemon in sorted order. When the user clicks on a column, it turns the graph into that pokemon's data which shows bar graphs of all the data and move combination usage and winrates. */}
                    <table className="stats-table">
                        <thead>
                            <tr>
                                <th>Character</th>
                                <th>Ban Rate</th>
                                <th>Pick Rate</th>
                                <th>Presence</th>
                                <th>Win Rate</th>
                                <th>Pick R1</th>
                                <th>Pick R2</th>
                                <th>Pick R3</th>
                                <th>Pick R4</th>
                                <th>Pick R5</th>
                                <th>Pick R6</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data
                                .sort((a, b) => {
                                    if (orderBy === "ban") return b.ban_rate - a.ban_rate;
                                    if (orderBy === "pick") return b.pick_rate - a.pick_rate;
                                    if (orderBy === "presence") return b.presence - a.presence;
                                    if (orderBy === "win") return b.win_rate - a.win_rate;
                                    if (orderBy === "pickOrder") {
                                        const round1Diff = b.pick_round_1 - a.pick_round_1;
                                        if (round1Diff !== 0) return round1Diff;
                                        const round2Diff = b.pick_round_2 - a.pick_round_2;
                                        if (round2Diff !== 0) return round2Diff;
                                        const round3Diff = b.pick_round_3 - a.pick_round_3;
                                        if (round3Diff !== 0) return round3Diff;
                                        const round4Diff = b.pick_round_4 - a.pick_round_4;
                                        if (round4Diff !== 0) return round4Diff;
                                        const round5Diff = b.pick_round_5 - a.pick_round_5;
                                        if (round5Diff !== 0) return round5Diff;
                                        return b.pick_round_6 - a.pick_round_6;
                                    }
                                    // Default sort by presence
                                    return b.presence - a.presence;
                                })
                                .map((character, index) => (
                                    <tr key={index}>
                                        <td>{character.pokemon_name}</td>
                                        <td>{character.ban_rate && character.ban_rate !== 0 ? (character.ban_rate).toFixed(1) : "0.0"}%</td>
                                        <td>{character.pick_rate && character.pick_rate !== 0 ? (character.pick_rate).toFixed(1) : "0.0"}%</td>
                                        <td>{character.presence && character.presence !== 0 ? (character.presence).toFixed(1) : "0.0"}%</td>
                                        <td>{character.win_rate !== null && character.win_rate !== undefined ? (character.win_rate).toFixed(1)+"%" : "No Data"}</td>
                                        <td>{character.pick_round_1}</td>
                                        <td>{character.pick_round_2}</td>
                                        <td>{character.pick_round_3}</td>
                                        <td>{character.pick_round_4}</td>
                                        <td>{character.pick_round_5}</td>
                                        <td>{character.pick_round_6}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="no-data-message">
                    <p>Select filters to view character statistics</p>
                </div>
            )}
        </div>
    </div>
  );
}

function StatsSorting({ events, teams, players, regions, setData, moveData }) {
    const [selectedEvent, setSelectedEvent] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("");
    const [selectedPlayer, setSelectedPlayer] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [beforeAfter, setBeforeAfter] = useState("");

    useEffect(() => {
        // Run filter function
        const queryContext = {
            event: selectedEvent ? selectedEvent.event_id : null,
            region: selectedRegion ? selectedRegion : null, // Region is just a string
            team: selectedTeam ? selectedTeam.team_id : null,
            player: selectedPlayer ? selectedPlayer.player_id : null,
            date: selectedDate ? selectedDate : null,
            beforeAfter: beforeAfter ? beforeAfter : null
        }
        
        console.log("Query context:", queryContext);
        
        // Only fetch if at least one filter is applied
        if (selectedEvent || selectedRegion || selectedTeam || selectedPlayer || (selectedDate && beforeAfter)) {
            fetchCharacterStats(queryContext)
                .then(data => {
                    // Process the data without modifying moveData directly
                    const processedData = data.map(row => {
                        // Create a deep copy of the row to avoid modifying the original
                        const rowCopy = { ...row, movesets: [...row.movesets] };
                        
                        // Find the corresponding moveObj but don't modify it
                        const moveObj = moveData.find(move => move.pokemon_name === row.pokemon_name);
                        if (moveObj && row.movesets.length < moveObj.move_combos.length) {
                            // Add missing move combinations to the row's movesets
                            for (const moveCombo of moveObj.move_combos) {
                                const found = row.movesets.some(moveSet => 
                                    moveSet.move_1 === moveCombo[0] && moveSet.move_2 === moveCombo[1]
                                );
                                
                                if (!found) {
                                    // Add missing combo to this row's movesets only
                                    rowCopy.movesets.push({
                                        move_1: moveCombo[0],
                                        move_2: moveCombo[1],
                                        pokemon_id: row.pokemon_id,
                                        pokemon_name: row.pokemon_name,
                                        requested_usages: 0,
                                        requested_wins: 0
                                    });
                                }
                            }
                        }
                        return rowCopy;
                    });
                    
                    console.log(processedData);
                    // Use the processed data instead of the original
                    setData(processedData);
                    setData(data);
                })
                .catch(error => {
                    console.error("Error fetching character stats:", error);
                });
        }
    }, [selectedEvent, selectedRegion, selectedTeam, selectedPlayer, selectedDate, beforeAfter, setData]);
  
    return (
        <div id="filterContainer">
            <h3>Filters</h3>
            <select name="beforeAfter" id="beforeAfter" onChange={(e) => setBeforeAfter(e.target.value)}>
                <option value="">Before / After</option>
                <option value="before">Before</option>
                <option value="after">After</option>
            </select>
            <input id="dateSelect" type="date" onChange={(e) => setSelectedDate(e.target.value)}></input> 
            <select name="region" id="region" onChange={(e) => {
                const selectedValue = e.target.value;
                setSelectedRegion(selectedValue ? selectedValue : "");
            }}>
                <option value="">Select Region</option>
                {regions.map((region, index) => (
                    <option key={index} value={region}>{region}</option>
                ))}
            </select>
            <select name="event" id="event" onChange={(e) => {
                const selectedIndex = e.target.selectedIndex - 1; // -1 for the "Select Event" option
                setSelectedEvent(selectedIndex >= 0 ? events[selectedIndex] : "");
            }}>
                <option value="">Select Event</option>
                {events.map((event, index) => (
                    <option key={index} value={event.event_id}>{event.event_name}</option>
                ))}
            </select>
            <select name="team" id="team" onChange={(e) => {
                const selectedIndex = e.target.selectedIndex - 1; // -1 for the "Select Team" option
                setSelectedTeam(selectedIndex >= 0 ? teams[selectedIndex] : "");
            }}>
                <option value="">Select Team</option>
                {teams.map((team, index) => (
                    <option key={index} value={team.team_id}>{team.team_name}</option>
                ))}
            </select>
            <select name="player" id="player" onChange={(e) => {
                const selectedIndex = e.target.selectedIndex - 1; // -1 for the "Select Player" option
                setSelectedPlayer(selectedIndex >= 0 ? players[selectedIndex] : "");
            }}>
                <option value="">Select Player</option>
                {players.map((player, index) => (
                    <option key={index} value={player.player_id}>{player.player_name}</option>
                ))}
            </select>
        </div>
    )
}

function StatsOrdering({ setOrderBy }) {
    
    return (
        <div id="orderingContainer">
            <h3>Order By</h3>
            <select name="orderBy" id="orderBy" onChange={(e) => setOrderBy(e.target.value)}>
                <option value="all">All Stats</option>
                <option value="ban">Ban Rate</option>
                <option value="pick">Pick Rate</option>
                <option value="presence">Presence</option>
                <option value="win">Win Rate</option>
                <option value="pickOrder">Pick Order</option> 
                {/* Display bar groups of the number of times a Pokemon was chosen in the 1st, 2nd, 3rd, etc rounds. Each pokemon will therefore have 6 bars. */}
            </select>
        </div>
    )
}

export default Stats;