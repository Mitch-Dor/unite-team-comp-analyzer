import React, { useEffect, useState } from 'react';
import { fetchCharacterStats } from '../backendCalls/http.js';

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

export default StatsSorting;