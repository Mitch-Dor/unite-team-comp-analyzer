import React, { useEffect, useState } from 'react';
import { fetchAllEvents, fetchAllTeams, fetchAllPlayers, fetchAllCharactersAndMoves } from './backendCalls/http.js';
import StatsOrdering from './statSupport/StatsOrdering.jsx';
import StatsSorting from './statSupport/StatsSorting.jsx';
import StatsBarChart from './statSupport/StatsBarChart.jsx';
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

        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            const mainContainer = document.getElementById("mainContainer");
            if (mainContainer) {
            mainContainer.style.backgroundImage = `url("/assets/landingPageBackgrounds/Blurred/UNITE_Theia_Sky_Ruins.png")`;
            mainContainer.style.backgroundSize = "cover";
            mainContainer.style.backgroundPosition = "center";
            mainContainer.style.backgroundAttachment = "fixed";
            } else {
            }
        }, 0);
    }, []);

  return (
    <div id="mainContainer">
        <div id="headerContainer">
            <StatsOrdering setOrderBy={setOrderBy} />
            <StatsSorting events={events} teams={teams} players={players} regions={regions} setData={setData} moveData={moveData} />
        </div>
        <div id="statsContainer">
            {data.length > 0 ? (
                <div className="stats-table-container">
                    <div className="charts-grid">
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
                                <div key={index} className="chart-item">
                                    <StatsBarChart data={character} orderBy={orderBy} />
                                </div>
                            ))
                        }
                    </div>
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

export default Stats;