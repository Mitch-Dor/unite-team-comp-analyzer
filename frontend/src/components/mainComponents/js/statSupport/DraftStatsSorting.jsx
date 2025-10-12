import React, { useEffect, useState } from 'react';
import { fetchDraftStats } from '../common/http.js';

function DraftStatsSorting({ events, teams, players, regions, setData, moveData, allPokemon, setPopUpText }) {
    const [selectedEvent, setSelectedEvent] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("");
    const [selectedPlayer, setSelectedPlayer] = useState("");
    const [dateLower, setDateLower] = useState("");
    const [dateUpper, setDateUpper] = useState("");

    useEffect(() => {
        // Run filter function
        const queryContext = {
            event: selectedEvent ? selectedEvent.event_id : null,
            region: selectedRegion ? selectedRegion : null, // Region is just a string
            team: selectedTeam ? selectedTeam.team_id : null,
            player: selectedPlayer ? selectedPlayer.player_id : null,
            dateLower: dateLower ? dateLower : null,
            dateUpper: dateUpper ? dateUpper : null
        }
        
        fetchDraftStats(queryContext)
            .then(data => {
                // Process the data without modifying moveData directly
                const processedData = data.map(row => {
                    // Create a deep copy of the row to avoid modifying the original
                    const rowCopy = { ...row, movesets: [...row.movesets || []] };
                    
                    // Find the corresponding moveObj but don't modify it
                    const moveObj = moveData.find(move => move.pokemon_name === row.pokemon_name);
                    if (moveObj) {
                        // Add missing move combinations to the row's movesets
                        for (const moveCombo of moveObj.move_combos) {
                            const found = rowCopy.movesets.find(moveSet => 
                                (moveSet.move_1_name === moveCombo[0] && moveSet.move_2_name === moveCombo[1])
                            );
                            
                            if (!found) {
                                // Add missing combo to this row's movesets only
                                rowCopy.movesets.push({
                                    move_1_name: moveCombo[0],
                                    move_2_name: moveCombo[1],
                                    moveset_count: 0,
                                    moveset_wins: 0,
                                    pick_rate: 0,
                                    win_rate: 0,
                                });
                            } else {
                                // Update the existing combo to include pick rate and win rate
                                found.pick_rate = parseFloat(((found.moveset_count / row.total_picks) * 100).toFixed(1));
                                found.win_rate = parseFloat(((found.moveset_wins / found.moveset_count) * 100).toFixed(1));
                            }
                        }
                    }
                    // Calculate Percentages (Win Rate, Pick Rate, Ban Rate, Presence)
                    rowCopy.ban_rate = parseFloat(((rowCopy.total_bans / rowCopy.total_matches) * 100).toFixed(1));
                    rowCopy.pick_rate = parseFloat(((rowCopy.total_picks / rowCopy.total_matches) * 100).toFixed(1));
                    rowCopy.win_rate = parseFloat(((rowCopy.total_pick_wins / rowCopy.total_picks) * 100).toFixed(1));
                    rowCopy.presence = parseFloat(((rowCopy.total_picks + rowCopy.total_bans) / rowCopy.total_matches) * 100).toFixed(1);
                    // Round Pick Rates
                    rowCopy.round_1_pick_rate = parseFloat(((rowCopy.round_1_picks / rowCopy.total_picks) * 100).toFixed(1));
                    rowCopy.round_2_pick_rate = parseFloat(((rowCopy.round_2_picks / rowCopy.total_picks) * 100).toFixed(1));
                    rowCopy.round_3_pick_rate = parseFloat(((rowCopy.round_3_picks / rowCopy.total_picks) * 100).toFixed(1));
                    rowCopy.round_4_pick_rate = parseFloat(((rowCopy.round_4_picks / rowCopy.total_picks) * 100).toFixed(1));
                    rowCopy.round_5_pick_rate = parseFloat(((rowCopy.round_5_picks / rowCopy.total_picks) * 100).toFixed(1));
                    rowCopy.round_6_pick_rate = parseFloat(((rowCopy.round_6_picks / rowCopy.total_picks) * 100).toFixed(1));
                    return rowCopy;
                });
                // Use the processed data instead of the original
                setData(processedData);
            })
            .catch(error => {
                console.error("Error fetching draft stats:", error);
            });
    }, [selectedEvent, selectedRegion, selectedTeam, selectedPlayer, dateLower, dateUpper, setData, moveData]);
  
    return (
        <div id="filterContainer">
            <h3>Filters</h3>
            <div className="filter-row">
                <label htmlFor="dateSelectLower">Date Lower</label>
                <input id="dateSelect" name="dateSelectLower" type="date" onChange={(e) => setDateLower(e.target.value)}></input> 
                <label htmlFor="dateSelectUpper">Date Upper</label>
                <input id="dateSelect" name="dateSelectUpper" type="date" onChange={(e) => setDateUpper(e.target.value)}></input> 
                <div className="infoHover" onClick={ () => {setPopUpText(`For most relevant stats on a particular Pokemon (because total matches by default may include matches from before the Pokemon was released), use \'after [RELEASE DATE]\', in the settings using the release dates provided:\n\n ${allPokemon
                    .map((char) => {const date = new Date(char.release_date);
                    return `${char.pokemon_name}: ${date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}`;})
                    .join("\n")}`)}}>
                    ?
                </div>
                <select name="region" id="region" onChange={(e) => {
                    const selectedValue = e.target.value;
                    setSelectedRegion(selectedValue ? selectedValue : "");
                }}>
                    <option value="">Select Region</option>
                    {regions.map((region, index) => (
                        <option key={index} value={region}>{region}</option>
                    ))}
                </select>
            </div>
            <div className="filter-row">
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
        </div>
    )
}

export default DraftStatsSorting;