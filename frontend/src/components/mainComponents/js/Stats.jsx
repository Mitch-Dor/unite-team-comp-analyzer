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
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchAllData();
    }, []);

  return (
    <div id="mainContainer">
        <StatsOrdering setOrderBy={setOrderBy} />
        <StatsSorting events={events} teams={teams} players={players} regions={regions} setData={setData} />
        <div id="statsContainer">
            {data.length > 0 ? (
                <div className="stats-table-container">
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
                                    // Default sort by presence
                                    return b.presence - a.presence;
                                })
                                .map((character, index) => (
                                    <tr key={index}>
                                        <td>{character.pokemon_name}</td>
                                        <td>{(character.ban_rate * 100).toFixed(1)}%</td>
                                        <td>{(character.pick_rate * 100).toFixed(1)}%</td>
                                        <td>{(character.presence * 100).toFixed(1)}%</td>
                                        <td>{(character.win_rate * 100).toFixed(1)}%</td>
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

function StatsSorting({ events, teams, players, regions, setData }) {
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
                    console.log(data);
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
                <option value="pick">Pick Order</option> 
                {/* Display bar groups of the number of times a Pokemon was chosen in the 1st, 2nd, 3rd, etc rounds. Each pokemon will therefore have 6 bars. */}
            </select>
        </div>
    )
}

export default Stats;