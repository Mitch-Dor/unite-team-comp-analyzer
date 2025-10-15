import React, { useEffect, useState } from 'react';
import { fetchAllEvents, fetchAllTeams, fetchAllPlayers, fetchAllCharactersAndMoves, fetchOverallBattleStats } from './common/http.js';
import StatsOrdering from './statSupport/StatsOrdering.jsx';
import DraftStatsFiltering from './statSupport/DraftStatsFiltering.jsx';
import DraftStatsBarChart from './statSupport/DraftStatsBarChart.jsx';
import BattleStatsFiltering from './statSupport/BattleStatsFiltering.jsx';
import BattleStatsDisplay from './statSupport/BattleStatsDisplay.jsx';
import Home from '../../sideComponents/js/Home.jsx';
import Disclaimer from '../../sideComponents/js/Disclaimer.jsx';
import '../css/stats.css';
import { pokemonToMovesetsDictionary } from './common/common.js';

function Stats() {
    const [events, setEvents] = useState([]);
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [regions, setRegions] = useState([]);
    const [allPokemon, setAllPokemon] = useState([]);
    const [movesets, setMovesets] = useState([]);
    const [charactersAndMoves, setCharactersAndMoves] = useState([]);
    const [draftData, setDraftData] = useState([]);
    const [draftOrderBy, setDraftOrderBy] = useState("all");
    const [battleData, setBattleData] = useState([]);
    const [battleOrderBy, setBattleOrderBy] = useState("all");
    const [overallBattleData, setOverallBattleData] = useState([]);
    const [battleMode, setBattleMode] = useState("allPokemon");
    const [keyPokemon, setKeyPokemon] = useState(null);
    const [mode, setMode] = useState("draftMode"); // draftMode / battleMode
    const [popUpText, setPopUpText] = useState("");

    useEffect(() => {
        async function fetchAllData() {
            try {
                // Fetch all data to prepopulate dropdowns
                const fetchedEvents = await fetchAllEvents();
                setEvents(fetchedEvents);
                const fetchedTeams = await fetchAllTeams();
                setTeams(fetchedTeams);
                const fetchedPlayers = await fetchAllPlayers();
                setPlayers(fetchedPlayers);
                const fetchedCharactersAndMoves = await fetchAllCharactersAndMoves();
                setCharactersAndMoves(fetchedCharactersAndMoves);  
                // Only add unique regions
                const fetchedRegions = [...new Set(fetchedTeams.map((team) => team.team_region))];
                setRegions(fetchedRegions.sort((a, b) => a.localeCompare(b)));
            
                // Get unique pokemon_name and pokemon_id combinations
                const uniquePokemon = [...new Set(fetchedCharactersAndMoves.map(char => JSON.stringify({pokemon_name: char.pokemon_name, pokemon_id: char.pokemon_id, release_date: new Date(char.release_date)})))].map(str => JSON.parse(str)); 
                setAllPokemon(uniquePokemon);
                // Accumulate all the moves for each character
                const movesets = pokemonToMovesetsDictionary(fetchedCharactersAndMoves);
                setMovesets(movesets);

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
    }, [mode]);

  return (
    <div id="stats-main-container">
        {popUpText && (
            <div className="stats-pop-up-cover" onClick={() => {setPopUpText("")}}>
                <div className="stats-pop-up-cover-content" onClick={(e) => e.stopPropagation()}>{popUpText}</div>
            </div>
        )}
        <div id="stats-mode-selection">
            <div className={`stats-mode-selection-selector ${mode === "draftMode" ? 'selected' : ''}`} onClick={() => setMode("draftMode")}>Draft Stats</div>
            <div className={`stats-mode-selection-selector ${mode === "battleMode" ? 'selected' : ''}`} onClick={() => setMode("battleMode")}>Battle Stats
                <div id="stats-battle-mode-selector-container">
                    <div className="stats-on-dropdown-label">Change Mode</div>
                    <select name="battleMode" id="stats-battle-mode-selector" onClick={(e) => {e.stopPropagation();}} onChange={(e) => setBattleMode(e.target.value)}>
                        <option value='allPokemon'>All Pokemon</option>
                        <option value='individual'>Individual</option>
                    </select>
                </div>
            </div>
            {/* Underline element, moves left/right based on selected mode */}
            <div className="stats-mode-selection-underline" style={{ transform: mode === "draftMode" ? "translateX(0%)" : "translateX(100%)" }}/>
        </div>
        {mode === "draftMode" ? (
            <>
                {/* Draft Mode */}
                <div id="stats-display-header-container">
                    <DraftStatsFiltering events={events} teams={teams} players={players} regions={regions} setData={setDraftData} movesets={movesets} allPokemon={allPokemon} setPopUpText={setPopUpText} />
                </div>
                <div id="stats-display-container">
                    <StatsOrdering setOrderBy={setDraftOrderBy} orderingArray={[{value: 'all', title: 'All Stats'}, {value: 'ban', title: 'Ban Rate'}, {value: 'pick', title: 'Pick Rate'}, {value: 'presence', title: 'Presence'}, {value: 'win', title: 'Win Rate'}, {value: 'pickOrder', title: 'Pick Order'}]} />
                    {draftData.length > 0 ? (
                        <div className="stats-display-table">
                            {draftData
                                .sort((a, b) => {
                                    if (draftOrderBy === "ban") return b.ban_rate - a.ban_rate;
                                    if (draftOrderBy === "pick") return b.pick_rate - a.pick_rate;
                                    if (draftOrderBy === "presence") return b.presence - a.presence;
                                    if (draftOrderBy === "win") return b.win_rate - a.win_rate;
                                    if (draftOrderBy === "pickOrder") {
                                        const round1Diff = b.round_1_pick_rate - a.round_1_pick_rate;
                                        if (round1Diff !== 0) return round1Diff;
                                        const round2Diff = b.round_2_pick_rate - a.round_2_pick_rate;
                                        if (round2Diff !== 0) return round2Diff;
                                        const round3Diff = b.round_3_pick_rate - a.round_3_pick_rate;
                                        if (round3Diff !== 0) return round3Diff;
                                        const round4Diff = b.round_4_pick_rate - a.round_4_pick_rate;
                                        if (round4Diff !== 0) return round4Diff;
                                        const round5Diff = b.round_5_pick_rate - a.round_5_pick_rate;
                                        if (round5Diff !== 0) return round5Diff;
                                        return b.round_6_pick_rate - a.round_6_pick_rate;
                                    }
                                    // Default sort by presence
                                    return b.presence - a.presence;
                                })
                                .map((character, index) => (
                                    <div key={index} className="stats-display-table-item">
                                        <img src={`/assets/Draft/headshots/${character.pokemon_name}.png`} alt={character.pokemon_name} className="stats-display-table-pokemon-icon" />
                                        <DraftStatsBarChart data={character} orderBy={draftOrderBy} />
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className="stats-no-data-message">
                            <p>No valid data found. Please change your filters.</p>
                        </div>
                    )}
                </div>
            </>
        ) : (
            <>
                {/* Battle Mode */}
                {battleMode === "individual" && (
                    <div id="stats-display-header-container">
                        <BattleStatsFiltering setData={setBattleData} charactersAndMoves={charactersAndMoves} allPokemon={allPokemon} setKeyPokemon={setKeyPokemon} />
                    </div>
                )}
                <div id="stats-display-container" className={`${battleMode !== 'individual' ? 'full-screen' : ''}`}>
                    <StatsOrdering setOrderBy={setBattleOrderBy} orderingArray={[{value: 'all', title: 'All Stats'}, {value: 'kills', title: 'Kills'}, {value: 'assists', title: 'Assists'}, {value: 'dealt', title: 'Damage Dealt'}, {value: 'taken', title: 'Damage Taken'}, {value: 'healed', title: 'Damage Healed'}, {value: 'points', title: 'Points Scored'}]} />
                    {battleMode === 'individual' ? (
                        <>
                            {!keyPokemon ? (
                                <div className="stats-no-data-message">
                                    <p>Select A Pokemon To View Data.</p>
                                </div>
                            ) : (
                                <>
                                    {battleData && battleData.length > 0 ? (
                                        <>
                                            {battleData
                                                .slice()
                                                .sort((a, b) => {
                                                    const aStats =
                                                    a.team1_picks.find(p => p.pokemon_id === keyPokemon.pokemon_id) ||
                                                    a.team2_picks.find(p => p.pokemon_id === keyPokemon.pokemon_id);

                                                    const bStats =
                                                    b.team1_picks.find(p => p.pokemon_id === keyPokemon.pokemon_id) ||
                                                    b.team2_picks.find(p => p.pokemon_id === keyPokemon.pokemon_id);

                                                    if (!aStats || !bStats) return 0;
                                                    if (battleOrderBy === "kills") return bStats.kills - aStats.kills;
                                                    if (battleOrderBy === "assists") return bStats.assists - aStats.assists;
                                                    if (battleOrderBy === "dealt") return bStats.dealt - aStats.dealt;
                                                    if (battleOrderBy === "taken") return bStats.taken - aStats.taken;
                                                    if (battleOrderBy === "healed") return bStats.healed - aStats.healed;
                                                    if (battleOrderBy === "points") return bStats.scored - aStats.scored;
                                                    return 0; // fallback
                                                })
                                                .map((match, idx) => (
                                                    <BattleStatsDisplay key={idx} match={match} mode={battleMode} />
                                                ))
                                            }
                                        </>
                                    ) : (
                                        <div className="stats-no-data-message">
                                            <p>No Data Found.</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            {battleData.length > 0 ? (
                                <div className="stats-display-table">
                                    {battleData
                                        .sort((a, b) => {
                                            if (battleOrderBy === "kills") return b.mean_kills - a.mean_kills;
                                            if (battleOrderBy === "assists") return b.mean_assists - a.mean_assists;
                                            if (battleOrderBy === "dealt") return b.mean_dealt - a.mean_dealt;
                                            if (battleOrderBy === "taken") return b.mean_taken - a.mean_taken;
                                            if (battleOrderBy === "healed") return b.mean_healed - a.mean_healed;
                                            if (battleOrderBy === "points") return b.mean_scored - a.mean_scored;
                                            if (battleOrderBy === 'all') return a.pokemon_id - b.pokemon_id; 
                                        })
                                        .map((character, index) => (
                                            <div key={index}>
                                                <BattleStatsDisplay character={character} mode={battleMode}></BattleStatsDisplay>
                                            </div>
                                        ))
                                    }
                                </div>
                            ) : (
                                <div className="stats-no-data-message">
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