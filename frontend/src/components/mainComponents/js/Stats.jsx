import React, { useEffect, useState } from 'react';
import { fetchAllEvents, fetchAllTeams, fetchAllPlayers, fetchAllCharactersAndMoves, fetchOverallBattleStats } from './backendCalls/http.js';
import StatsOrdering from './statSupport/StatsOrdering.jsx';
import DraftStatsSorting from './statSupport/DraftStatsSorting.jsx';
import DraftStatsBarChart from './statSupport/DraftStatsBarChart.jsx';
import BattleStatsSorting from './statSupport/BattleStatsSorting.jsx';
import BattleStatsDisplay from './statSupport/BattleStatsDisplay.jsx';
import Home from '../../sideComponents/js/Home.jsx';
import Disclaimer from '../../sideComponents/js/Disclaimer.jsx';
import '../css/stats.css';

function Stats() {
    const [events, setEvents] = useState([]);
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [regions, setRegions] = useState([]);
    const [allPokemon, setAllPokemon] = useState([]);
    const [moveData, setMoveData] = useState([]);
    const [rawMoveData, setRawMoveData] = useState([]);
    const [draftData, setDraftData] = useState([]);
    const [draftOrderBy, setDraftOrderBy] = useState("all");
    const [battleData, setBattleData] = useState([]);
    const [battleOrderBy, setBattleOrderBy] = useState("all");
    const [overallBattleData, setOverallBattleData] = useState([]);
    const [battleMode, setBattleMode] = useState("allPokemon");
    const [keyPokemon, setKeyPokemon] = useState(null);
    const [mode, setMode] = useState("draftMode"); // draftMode / battleMode

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
                setAllPokemon(uniquePokemon);
                // Sort all in alphabetical order
                setEvents(fetchedEvents.sort((a, b) => a.event_name.localeCompare(b.event_name)));
                setTeams(fetchedTeams.sort((a, b) => a.team_name.localeCompare(b.team_name)));
                setPlayers(fetchedPlayers.sort((a, b) => a.player_name.localeCompare(b.player_name)));
                // Cumulate all the moves for each character
                const cumulativeMoves = [];
                const rawMovesData = [];
                for (const character of uniquePokemon) {
                    const characterMoves = fetchedCharactersAndMoves.filter(move => move.pokemon_name === character.pokemon_name);
                    rawMovesData.push(characterMoves);
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
                setRawMoveData(rawMovesData);
                setMoveData(cumulativeMoves);

                const fetchedOverallBattleData = await fetchOverallBattleStats();
                setOverallBattleData(fetchedOverallBattleData);
                setBattleData(fetchedOverallBattleData); // Starts in allPokemon mode.
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchAllData();
    }, []);

    useEffect(() => {
        setBattleOrderBy("all");
        setKeyPokemon(null);

        if(battleMode==='allPokemon') {
            setBattleData(overallBattleData);
        } else {
            setBattleData([]);
        }
    }, [battleMode]);

    useEffect(() => {
        setBattleOrderBy("all");
        setKeyPokemon(null);
        setDraftOrderBy("all");
        setBattleMode("allPokemon");
    }, [mode]);

  return (
    <div id="mainContainer">
        <div id="modeSelection">
            <div className={`modeSelector ${mode === "draftMode" ? 'selected' : ''}`} onClick={() => setMode("draftMode")}>Draft Stats</div>
            <div className={`modeSelector ${mode === "battleMode" ? 'selected' : ''}`} onClick={() => setMode("battleMode")}>Battle Stats</div>
            {/* Underline element, moves left/right based on selected mode */}
            <div className="underline" style={{ transform: mode === "draftMode" ? "translateX(0%)" : "translateX(100%)" }}/>
        </div>
        {mode === "draftMode" ? (
            <>
                {/* Draft Mode */}
                <div id="headerContainer">
                    <StatsOrdering setOrderBy={setDraftOrderBy} orderingArray={[{value: 'all', title: 'All Stats'}, {value: 'ban', title: 'Ban Rate'}, {value: 'pick', title: 'Pick Rate'}, {value: 'presence', title: 'Presence'}, {value: 'win', title: 'Win Rate'}, {value: 'pickOrder', title: 'Pick Order'}]} />
                    <DraftStatsSorting events={events} teams={teams} players={players} regions={regions} setData={setDraftData} moveData={moveData} />
                </div>
                <div id="statsContainer">
                    {draftData.length > 0 ? (
                        <div className="stats-table-container">
                            <div className="charts-grid">
                                {draftData
                                    .sort((a, b) => {
                                        if (draftOrderBy === "ban") return b.ban_rate - a.ban_rate;
                                        if (draftOrderBy === "pick") return b.pick_rate - a.pick_rate;
                                        if (draftOrderBy === "presence") return b.presence - a.presence;
                                        if (draftOrderBy === "win") return b.win_rate - a.win_rate;
                                        if (draftOrderBy === "pickOrder") {
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
                                            <img src={`/assets/Draft/headshots/${character.pokemon_name}.png`} alt={character.pokemon_name} className="stats-graph-pokemon-icon" />
                                            <DraftStatsBarChart data={character} orderBy={draftOrderBy} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ) : (
                        <div className="no-data-message">
                            <p>No valid data found. Please change your filters.</p>
                        </div>
                    )}
                </div>
            </>
        ) : (
            <>
                {/* Battle Mode */}
                <div id="headerContainer">
                    <StatsOrdering setOrderBy={setBattleOrderBy} orderingArray={[{value: 'all', title: 'All Stats'}, {value: 'kills', title: 'Kills'}, {value: 'assists', title: 'Assists'}, {value: 'dealt', title: 'Damage Dealt'}, {value: 'taken', title: 'Damage Taken'}, {value: 'healed', title: 'Damage Healed'}, {value: 'points', title: 'Points Scored'}]} setBattleMode={setBattleMode} />
                    {battleMode ===  "individual" && (
                        <BattleStatsSorting setData={setBattleData} moveData={rawMoveData} allPokemon={allPokemon} setKeyPokemon={setKeyPokemon} />
                    )}
                </div>
                <div id="statsContainer">
                    {battleMode === 'individual' ? (
                        <>
                            {!keyPokemon ? (
                                <div className="no-data-message">
                                    <p>Select A Pokemon To View Data.</p>
                                </div>
                            ) : (
                                <>
                                    {battleData.length > 0 ? (
                                        <>
                                            {battleData
                                                .slice() // clone so you don't mutate state
                                                .sort((a, b) => {
                                                if (battleOrderBy === "kills") return b.kills - a.kills;
                                                if (battleOrderBy === "assists") return b.assists - a.assists;
                                                if (battleOrderBy === "dealt") return b.dealt - a.dealt;
                                                if (battleOrderBy === "taken") return b.taken - a.taken;
                                                if (battleOrderBy === "healed") return b.healed - a.healed;
                                                if (battleOrderBy === "points") return b.scored - a.scored;
                                                return 0; // fallback
                                                })
                                                .map((match, idx) => (
                                                    <BattleStatsDisplay key={idx} match={match} mode={battleMode} />
                                                ))
                                            }
                                        </>
                                    ) : (
                                        <div className="no-data-message">
                                            <p>No Data Found.</p>
                                        </div>
                                    )}
                                </>
                            )}
                            
                        </>
                    ) : (
                        <>
                        {battleData.length > 0 ? (
                            <div className="stats-table-container">
                                <div className="charts-grid">
                                    {battleMode === 'allPokemon' ? (
                                        <>
                                            {battleOrderBy !== 'all' ? (
                                                <>
                                                    <BattleStatsDisplay mode={battleMode} orderBy={battleOrderBy} totalData={battleData
                                                        .sort((a, b) => {
                                                            if (battleOrderBy === "kills") return b.mean_kills - a.mean_kills;
                                                            if (battleOrderBy === "assists") return b.mean_assists - a.mean_assists;
                                                            if (battleOrderBy === "dealt") return b.mean_dealt - a.mean_dealt;
                                                            if (battleOrderBy === "taken") return b.mean_taken - a.mean_taken;
                                                            if (battleOrderBy === "healed") return b.mean_healed - a.mean_healed;
                                                            if (battleOrderBy === "points") return b.mean_scored - a.mean_scored;
                                                        })}></BattleStatsDisplay>
                                                </>
                                            ) : (
                                                <>
                                                    {battleData
                                                        .sort((a, b) => {
                                                            // Default sort by release date
                                                            return a.pokemon_id - b.pokemon_id;
                                                        })
                                                        .map((character, index) => (
                                                            <div key={index}>
                                                                <BattleStatsDisplay character={character} mode={battleMode} orderBy={battleOrderBy} totalData={battleData}></BattleStatsDisplay>
                                                            </div>
                                                        ))
                                                    }
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {battleData
                                                .sort((a, b) => {
                                                    if (battleOrderBy === "kills") return b.kills - a.kills;
                                                    if (battleOrderBy === "assists") return b.assists - a.assists;
                                                    if (battleOrderBy === "dealt") return b.dealt - a.dealt;
                                                    if (battleOrderBy === "taken") return b.taken - a.taken;
                                                    if (battleOrderBy === "healed") return b.healed - a.healed;
                                                    if (battleOrderBy === "points") return b.scored - a.scored;
                                                    // Default sort by dealt
                                                    return a.dealt - b.dealt;
                                                })
                                                .map((match, index) => (
                                                    <BattleStatsDisplay match={match} mode={battleMode} orderBy={battleOrderBy} totalData={battleData} ></BattleStatsDisplay>
                                                ))
                                            }
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="no-data-message">
                                <p>No valid data found. Please change your filters.</p>
                            </div>
                        )}
                        </>
                    )}
                </div>
            </>
        )}
        <Home />
        <Disclaimer />
    </div>
  );
}

export default Stats;