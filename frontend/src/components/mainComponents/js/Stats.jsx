import React, { useEffect, useState } from 'react';
import { fetchAllEvents, fetchAllTeams, fetchAllPlayers, fetchAllCharactersAndMoves, fetchAllComps } from './backendCalls/http.js';
import CustomDropdown from './compSupport/CustomDropdown.jsx';
import '../css/stats.css';

function Stats() {
    const [mode, setMode] = useState("overall"); /* overall, individual */
    const [events, setEvents] = useState([]);
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [charactersAndMoves, setCharactersAndMoves] = useState([]);
    const [regions, setRegions] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [data, setData] = useState([]);

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
        <select name="mode" id="mode" onChange={(e) => setMode(e.target.value)}>
            <option value="">Select Mode</option>
            <option value="overall">Overall</option>
            <option value="individual">Individual</option>
        </select>
        <StatsOrdering mode={mode} />
        <StatsSorting mode={mode} events={events} teams={teams} players={players} charactersAndMoves={charactersAndMoves} regions={regions} characters={characters} setData={setData} />
        <div id="graphContainer">
            {/* Dont know how to do graphs right now. Will be something with react */}
        </div>
    </div>
  );
}

function StatsSorting({ mode, events, teams, players, charactersAndMoves, regions, characters, setData }) {
    const [moves, setMoves] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState("");
    const [selectedCharacter, setSelectedCharacter] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("");
    const [selectedPlayer, setSelectedPlayer] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [beforeAfter, setBeforeAfter] = useState("");

    useEffect(() => {
        // Get available moves for the selected character
    const getPokemonMoves = (pokemonName) => {
        if (!pokemonName) return [];
        // Find all instances of the Pokémon and collect their moves
        const pokemonInstances = charactersAndMoves.filter(char => char.pokemon_name === pokemonName);
        // Push all of their moves to an array
        let moves = [];
        for (const pokemon of pokemonInstances) {
            moves.push({move_name: pokemon.move_name, move_id: pokemon.move_id});
        }
        return moves;
        };
        const availableMoves = selectedCharacter ? getPokemonMoves(selectedCharacter.pokemon_name) : [];
        setMoves(availableMoves);
    }, [selectedCharacter]);

    useEffect(() => {
        // If mode is overall, filter data uncondiionally
        if (mode === "overall") {
            // Run filter function
        } else if (mode === "individual") { 
            // If mode is individual, filter data based on the selected character (and make sure selectedCharacter is not null and availableMoves is not empty)
            if (selectedCharacter) {
                // Run filter function
            }
        }
    }, [selectedEvent, selectedCharacter, selectedRegion, selectedTeam, selectedPlayer, selectedDate, beforeAfter]);
  
    return (
        <div id="filterContainer">
            <h3>Filters</h3>
            <select name="beforeAfter" id="beforeAfter" onChange={(e) => setBeforeAfter(e.target.value)}>
                <option value="">Before / After</option>
                <option value="before">Before</option>
                <option value="after">After</option>
            </select>
            <input id="dateSelect" type="date" onChange={(e) => setSelectedDate(e.target.value)}></input> 
            <select name="region" id="region" onChange={(e) => setSelectedRegion(e.target.value)}>
                <option value="">Select Region</option>
                {regions.map((region, index) => (
                    <option key={index} value={region}>{region}</option>
                ))}
            </select>
            <select name="event" id="event" onChange={(e) => setSelectedEvent(e.target.value)}>
                <option value="">Select Event</option>
                {events.map((event, index) => (
                    <option key={index} value={event.event_name}>{event.event_name}</option>
                ))}
            </select>
            <select name="team" id="team" onChange={(e) => setSelectedTeam(e.target.value)}>
                <option value="">Select Team</option>
                {teams.map((team, index) => (
                    <option key={index} value={team.team_name}>{team.team_name}</option>
                ))}
            </select>
            <select name="player" id="player" onChange={(e) => setSelectedPlayer(e.target.value)}>
                <option value="">Select Player</option>
                {players.map((player, index) => (
                    <option key={index} value={player.player_name}>{player.player_name}</option>
                ))}
            </select>
            {mode === "individual" && (
                <div className="custom-dropdown-container">
                    {/* Sort by Pokemon */}
                    <div id="sorting-pokemon-dropdown">
                    <CustomDropdown
                    value={selectedCharacter}
                    onChange={setSelectedCharacter}
                    options={characters}
                    placeholder={"Select Pokemon"}
                    disabled={false}
                    path="/assets/Draft/headshots"
                    />
                </div>
            </div>
            )}
        </div>
    )
}

function StatsOrdering({ mode }) {
    
    return (
        mode === "overall" ? (
            <div id="orderingContainer">
                <h3>Order By</h3>
                <select name="orderBy" id="orderBy">
                    <option value="all">All Stats</option>
                    <option value="ban">Ban Rate</option>
                    <option value="pick">Pick Rate</option>
                    <option value="presence">Presence</option>
                    <option value="win">Win Rate</option>
                    <option value="pick">Pick Order</option> 
                    {/* Display bar groups of the number of times a Pokemon was chosen in the 1st, 2nd, 3rd, etc rounds. Each pokemon will therefore have 6 bars. */}
                </select>
            </div>
        ) : (
            null
        )
    )
}

export default Stats;