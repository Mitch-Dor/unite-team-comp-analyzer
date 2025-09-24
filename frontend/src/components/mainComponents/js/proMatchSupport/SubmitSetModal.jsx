import React, { useState, useEffect } from 'react';
import { insertEvent, insertTeam, insertPlayer, insertSet } from '../backendCalls/http';
import CustomDropdown from './CustomDropdown';
import { formatSet } from '../ProMatches';

function SubmitSetModal({ setShowSubmitForm, coreData, setCoreData, events, teams, players, charactersAndMoves, setEvents, setTeams, setPlayers, user }) {
    const [setInsertion, setSetInsertion] = useState(false);
    const [eventInsertion, setEventInsertion] = useState(false);
    const [teamInsertion, setTeamInsertion] = useState(false);
    const [playerInsertion, setPlayerInsertion] = useState(false);
    const [creationState, setCreationState] = useState(0);
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        // Set an event listener for if the user clicks outside of the modal to close it
        window.addEventListener('click', (e) => {
            // Check if the clicked element is the open button or is inside the modal
            if (e.target.id === 'open-set-submit-form' || 
                e.target.closest('#set-submit-form') || 
                e.target.closest('.dropdown-options')) {
                return;
            }
            setShowSubmitForm(false);
        });
    }, []);
  
    // Function to submit the comp
    function submitComp() {

        // Format the data and do error checking
        let formattedData = [];
        let error = "Missing Fields:";
        let errorCount = 0;
        let i = 1;

        // Check which data is trying to be inserted
        switch (creationState) {
            case 0:
                setCheck();
                break;
            case 1:
                eventCheck();
                break;
            case 2:
                teamCheck();
                break;
            case 3:
                playerCheck();
                break;
        }

        function checkNotDefaultMatch(match) {
            for (let j=0; j<2; j++){
                for(let i=0; i<24; i++){
                    if (i === 1 && match[j][i] !== false) {
                        return true;
                    }
                    if(match[j][i] !== null && i !== 1){
                        return true;
                    }
                }
            }
            if(match[3] !== null){
                return false;
            }
            return false;
        }

        function setCheck() {
            const fpBans = [1, 3];
            const spBans = [2, 4];
            const fpPicks = [1, 4, 5, 8, 9];
            const spPicks = [2, 3, 6, 7, 10];

            // Check if setInsertion exists and has the required length
            if (!setInsertion || setInsertion.length < 7) {
                error += "\n" + "Invalid set data structure";
                errorCount++;
            }

            // Check if event data exists
            if (!setInsertion[5] || setInsertion[5] === null) {
                error += "\n" + "Event data is missing";
                errorCount++;
            }

            // Format the data in a way that's easy to insert into the comps page and do null checks
            for (let j = 0; j < 5; j++) {
                const match = setInsertion[j];
                if (checkNotDefaultMatch(match)) {
                    let matchData = {
                        team1: match[0],
                        team2: match[1],
                        winner: match[2]
                    }

                    // Check if team data exists
                    if (!matchData.team1 || !matchData.team2) {
                        error += "\n" + "Match " + (j + 1) + " is missing team data";
                        errorCount++;
                        continue;
                    }

                    // Group team1 and team2 Pokémon and bans for duplicate checking
                    const allPokemonAndBans = [
                        ...matchData.team1.slice(4, 9), // team1 Pokémon
                        ...matchData.team2.slice(4, 9), // team2 Pokémon
                        matchData.team1[2], matchData.team1[3], // team1 bans
                        matchData.team2[2], matchData.team2[3]  // team2 bans
                    ];
                    if (new Set(allPokemonAndBans).size !== allPokemonAndBans.length) {
                        error += "\n" + "Match " + (j + 1) + " has duplicate Pokémon or bans";
                        errorCount++;
                    }

                    // Check if team names are equal
                    if (matchData.team1[0]?.team_name === matchData.team2[0]?.team_name) {
                        error += "\n" + "Match " + (j + 1) + " has identical team names";
                        errorCount++;
                    }

                    let team1Data = {
                        name: checkNull(matchData.team1[0]?.team_name, "team1TeamName", i),
                        region: checkNull(matchData.team1[0]?.team_region, "team1TeamRegion", i),
                        firstPick: checkNull(matchData.team1[1], "team1FirstPick", i),
                        // One attribute like pokemon_name being present implies the other attributes are present
                        bans: [checkNull(matchData.team1[2]?.pokemon_name, "team1Ban1", i), checkNull(matchData.team1[3]?.pokemon_name, "team1Ban2", i)],
                        pokemon: [checkNull(matchData.team1[4]?.pokemon_name, "team1Pokemon1", i), checkNull(matchData.team1[5]?.pokemon_name, "team1Pokemon2", i), checkNull(matchData.team1[6]?.pokemon_name, "team1Pokemon3", i), checkNull(matchData.team1[7]?.pokemon_name, "team1Pokemon4", i), checkNull(matchData.team1[8]?.pokemon_name, "team1Pokemon5", i)],
                        pokemon_moves: [checkNull(matchData.team1[9]?.move_name, "team1Pokemon1Move1", i), checkNull(matchData.team1[10]?.move_name, "team1Pokemon1Move2", i), checkNull(matchData.team1[11]?.move_name, "team1Pokemon2Move1", i), checkNull(matchData.team1[12]?.move_name, "team1Pokemon2Move2", i), checkNull(matchData.team1[13]?.move_name, "team1Pokemon3Move1", i), checkNull(matchData.team1[14]?.move_name, "team1Pokemon3Move2", i), checkNull(matchData.team1[15]?.move_name, "team1Pokemon4Move1", i), checkNull(matchData.team1[16]?.move_name, "team1Pokemon4Move2", i), checkNull(matchData.team1[17]?.move_name, "team1Pokemon5Move1", i), checkNull(matchData.team1[18]?.move_name, "team1Pokemon5Move2", i)],
                        players: [checkNull(matchData.team1[19]?.player_name, "team1Player1", i), checkNull(matchData.team1[20]?.player_name, "team1Player2", i), checkNull(matchData.team1[21]?.player_name, "team1Player3", i), checkNull(matchData.team1[22]?.player_name, "team1Player4", i), checkNull(matchData.team1[23]?.player_name, "team1Player5", i)],
                        pokemon_data: checkStats([matchData.team1[24], matchData.team1[25], matchData.team1[26], matchData.team1[27], matchData.team1[28]], j, 1)
                    }
                    let team2Data = {
                        name: checkNull(matchData.team2[0]?.team_name, "team2TeamName", i),
                        region: checkNull(matchData.team2[0]?.team_region, "team2TeamRegion", i),
                        firstPick: checkNull(matchData.team2[1], "team2FirstPick", i),
                        bans: [checkNull(matchData.team2[2]?.pokemon_name, "team2Ban1", i), checkNull(matchData.team2[3]?.pokemon_name, "team2Ban2", i)],
                        pokemon: [checkNull(matchData.team2[4]?.pokemon_name, "team2Pokemon1", i), checkNull(matchData.team2[5]?.pokemon_name, "team2Pokemon2", i), checkNull(matchData.team2[6]?.pokemon_name, "team2Pokemon3", i), checkNull(matchData.team2[7]?.pokemon_name, "team2Pokemon4", i), checkNull(matchData.team2[8]?.pokemon_name, "team2Pokemon5", i)],
                        pokemon_moves: [checkNull(matchData.team2[9]?.move_name, "team2Pokemon1Move1", i), checkNull(matchData.team2[10]?.move_name, "team2Pokemon1Move2", i), checkNull(matchData.team2[11]?.move_name, "team2Pokemon2Move1", i), checkNull(matchData.team2[12]?.move_name, "team2Pokemon2Move2", i), checkNull(matchData.team2[13]?.move_name, "team2Pokemon3Move1", i), checkNull(matchData.team2[14]?.move_name, "team2Pokemon3Move2", i), checkNull(matchData.team2[15]?.move_name, "team2Pokemon4Move1", i), checkNull(matchData.team2[16]?.move_name, "team2Pokemon4Move2", i), checkNull(matchData.team2[17]?.move_name, "team2Pokemon5Move1", i), checkNull(matchData.team2[18]?.move_name, "team2Pokemon5Move2", i)],
                        players: [checkNull(matchData.team2[19]?.player_name, "team2Player1", i), checkNull(matchData.team2[20]?.player_name, "team2Player2", i), checkNull(matchData.team2[21]?.player_name, "team2Player3", i), checkNull(matchData.team2[22]?.player_name, "team2Player4", i), checkNull(matchData.team2[23]?.player_name, "team2Player5", i)],
                        pokemon_data: checkStats([matchData.team2[24], matchData.team2[25], matchData.team2[26], matchData.team2[27], matchData.team2[28]], j, 2)
                    }
                    checkNull(matchData.winner, "winner", i);

                    // Check first pick validation
                    if (team1Data.firstPick === team2Data.firstPick) {
                        error += "\n" + "Match " + i + " must have exactly one team as first pick";
                        errorCount++;
                    }

                    // Check for duplicate moves for each Pokémon in team1
                    for (let k = 9; k <= 18; k += 2) {
                        if (matchData.team1[k] === matchData.team1[k + 1]) {
                            error += "\n" + "Match " + (j + 1) + " has duplicate moves for a Pokémon in team 1";
                            errorCount++;
                        }
                    }

                    // Check for duplicate moves for each Pokémon in team2
                    for (let k = 9; k <= 18; k += 2) {
                        if (matchData.team2[k] === matchData.team2[k + 1]) {
                            error += "\n" + "Match " + (j + 1) + " has duplicate moves for a Pokémon in team 2";
                            errorCount++;
                        }
                    }

                    // Put it all in one match object with the event data added too
                    // comps page wants first picks as booleans (like they are now), database does not
                    formattedData.push({
                        team1: team1Data, 
                        team2: team2Data, 
                        winningTeam: parseInt(matchData.winner), 
                        event: checkNull(setInsertion[5]?.event_name, "eventName", 0), 
                        matchDate: checkNull(setInsertion[5]?.event_date, "eventDate", 0), 
                        set_description: checkNull(setInsertion[6], "setDescriptor", 0), 
                        vod: checkNull(setInsertion[5]?.vod_url, "vodUrl", 0),
                        has_advanced_data: team1Data.pokemon_data[0][3] ? true : false
                    });
                    i++;
                }
            }

            // If something is missing, don't submit
            if (errorCount > 0) {
                alert(error);
                return;
            }

            // If previous checks determined that the data contained the fields it needed, the IDs are present too.
            // Also format the data in a way that's easy to insert into the database
            // Database needs the IDs
            // Pull out match data first
            let matchData = [];
            for (let j = 0; j < 5; j++) {
                const match = setInsertion[j];
                if (checkNotDefaultMatch(match)) {
                    const thisMatch = {
                        team1: {
                            team_id: match[0][0].team_id,
                            isFirstPick: match[0][1],
                            bans: [match[0][2]?.pokemon_id, match[0][3]?.pokemon_id],
                            pokemon: [match[0][4]?.pokemon_id, match[0][5]?.pokemon_id, match[0][6]?.pokemon_id, match[0][7]?.pokemon_id, match[0][8]?.pokemon_id],
                            pokemon_moves: [match[0][9]?.move_id, match[0][10]?.move_id, match[0][11]?.move_id, match[0][12]?.move_id, match[0][13]?.move_id, match[0][14]?.move_id, match[0][15]?.move_id, match[0][16]?.move_id, match[0][17]?.move_id, match[0][18]?.move_id],
                            players: [match[0][19]?.player_id, match[0][20]?.player_id, match[0][21]?.player_id, match[0][22]?.player_id, match[0][23]?.player_id],
                            pokemon_data: checkStats([match[0][24], match[0][25], match[0][26], match[0][27], match[0][28]])
                        },
                        team2: {
                            team_id: match[1][0].team_id,
                            isFirstPick: match[1][1],
                            bans: [match[1][2]?.pokemon_id, match[1][3]?.pokemon_id],
                            pokemon: [match[1][4]?.pokemon_id, match[1][5]?.pokemon_id, match[1][6]?.pokemon_id, match[1][7]?.pokemon_id, match[1][8]?.pokemon_id],
                            pokemon_moves: [match[1][9]?.move_id, match[1][10]?.move_id, match[1][11]?.move_id, match[1][12]?.move_id, match[1][13]?.move_id, match[1][14]?.move_id, match[1][15]?.move_id, match[1][16]?.move_id, match[1][17]?.move_id, match[1][18]?.move_id],
                            players: [match[1][19]?.player_id, match[1][20]?.player_id, match[1][21]?.player_id, match[1][22]?.player_id, match[1][23]?.player_id],
                            pokemon_data: checkStats([match[1][24], match[1][25], match[1][26], match[1][27], match[1][28]])
                        },
                        winningTeam: parseInt(match[2]),
                        hasAdvancedData: match[0][24].dealt ? true : false
                    }
                    matchData.push(thisMatch);
                }
            }
            const databaseData = {
                event_id: setInsertion[5]?.event_id,
                set_descriptor: setInsertion[6],
                matches: matchData
            }

            // Check if the number of wins for each team is equal
            const team1Name = formattedData[0].team1.team_id;
            const team2Name = formattedData[0].team2.team_id;
            let team1Wins = 0;
            let team2Wins = 0;
            formattedData.forEach(match => {
                if ((match.winningTeam === 1 && match.team1.team_id === team1Name) || (match.winningTeam === 2 && match.team2.team_id === team1Name)) {
                    team1Wins++;
                } else if ((match.winningTeam === 1 && match.team2.team_id === team2Name) || (match.winningTeam === 2 && match.team1.team_id === team2Name)) {
                    team2Wins++;
                }
            });
            if (team1Wins === team2Wins) {
                error += "\n" + "Set has equal wins for both teams";
                errorCount++;
            }

            // If something is missing, don't submit
            if (errorCount > 0) {
                alert(error);
                return;
            }

            // Submit the data
            insertSet(databaseData, user.user_google_id).then(data => {
                // Add the set ID to the set data
                formattedData.forEach(match => {
                    match.set_id = data.id;
                });

                // Set data needs to be the same as the data that's already in the comps page
                const setData = formatSet(formattedData);

                // Update the comp data on the comp display page with the new comps
                // Do after sending to database to only show data that was successfully inserted
                setCompsData([...compsData, ...setData]);
                // Clear the set insertion data and the input fields
                setSetInsertion(null);
                resetAllForms();
            });
        }

        function eventCheck() {
            // Check for null values
            // Make sure the fields are consistent with the database
            checkNull(eventInsertion.event_name, "Event Name");
            checkNull(eventInsertion.event_date, "Event Date");
            checkNull(eventInsertion.vod_url, "Event VOD URL");
            // If there are no errors, submit the data
            if (errorCount === 0) {
                insertEvent(eventInsertion.event_name, eventInsertion.event_date, eventInsertion.vod_url, user.user_google_id).then(data => {
                    // Update the event data with the ID
                    const newEvent = {
                        event_id: data.id,
                        event_name: eventInsertion.event_name,
                        event_date: eventInsertion.event_date,
                        vod_url: eventInsertion.vod_url
                    }
                    // Put this new event in the events array
                    setEvents([...events, newEvent]);
                    // Clear the event insertion data and the input fields
                    setEventInsertion(null);
                    resetAllForms();
                });
            } else {
                alert(error);
                return;
            }
        }

        function teamCheck() {
            // Check for null values
            // Make sure the fields are consistent with the database
            checkNull(teamInsertion.team_name, "Team Name");
            checkNull(teamInsertion.team_region, "Team Region");
            // If there are no errors, submit the data
            if (errorCount === 0) {
                insertTeam(teamInsertion.team_name, teamInsertion.team_region, user.user_google_id).then(data => {
                    // Update the team data with the ID
                    const newTeam = {
                        team_id: data.id,
                        team_name: teamInsertion.team_name,
                        team_region: teamInsertion.team_region
                    }
                    // Put this new team in the teams array
                    setTeams([...teams, newTeam]);
                    // Clear the team insertion data and the input fields
                    setTeamInsertion(null);
                    resetAllForms();
                });
            } else {
                alert(error);
                return;
            }
        }

        function playerCheck() {
            // Check for null values
            // Make sure the fields are consistent with the database
            checkNull(playerInsertion.player_name, "Player Name");
            // If there are no errors, submit the data
            if (errorCount === 0) {
                insertPlayer(playerInsertion.player_name, user.user_google_id).then(data => {
                    // Update the player data with the ID
                    const newPlayer = {
                        player_id: data.id,
                        player_name: playerInsertion.player_name
                    }
                    // Put this new player in the players array
                    setPlayers([...players, newPlayer]);
                    // Clear the player insertion data and the input fields
                    setPlayerInsertion(null);
                    resetAllForms();
                });
            } else {
                alert(error);
                return;
            }
        }

        function checkNull(data, field, i) {
            if (data === null || data === undefined || data === "") {
                if (i === undefined) {
                     // Add the field to the error message
                    error += "\n" + field;
                    errorCount++;
                    return "null";
                }
                // Add the field to the error message
                if (i === 0) {
                    // Error in event data
                    error += "\n" + "Event " + field;
                    errorCount++;
                    return "null";
                }else {
                    // Error in match data
                    error += "\n" + "Match " + i + " " + field;
                    errorCount++;
                    return "null";
                }
            }
            return data;
        }
    
        function checkStats(data, match, team) {
            let allNull = true;
            let allFilled = true;
            let returnArray = [];
            for (let i = 0; i < 5; i++) {
                let statArray = [];
                if (data[i].kills !== null && data[i].kills !== "" && !Number.isNaN(data[i].kills)) {
                    allNull = false;
                } else {
                    allFilled = false;
                }
                statArray.push(data[i].kills);
                if (data[i].assists !== null && data[i].assists !== "" && !Number.isNaN(data[i].assists)) {
                    allNull = false;
                } else {
                    allFilled = false;
                }
                statArray.push(data[i].assists);
                if (data[i].scored !== null && data[i].scored !== "" && !Number.isNaN(data[i].scored)) {
                    allNull = false;
                } else {
                    allFilled = false;
                }
                statArray.push(data[i].scored);
                if (data[i].dealt !== null && data[i].dealt !== "" && !Number.isNaN(data[i].dealt)) {
                    allNull = false;
                } else {
                    allFilled = false;
                }
                statArray.push(data[i].dealt);
                if (data[i].taken !== null && data[i].taken !== "" && !Number.isNaN(data[i].taken)) {
                    allNull = false;
                } else {
                    allFilled = false;
                }
                statArray.push(data[i].taken);
                if (data[i].healed !== null && data[i].healed !== "" && !Number.isNaN(data[i].healed)) {
                    allNull = false;
                } else {
                    allFilled = false;
                }
                statArray.push(data[i].healed);
                if (data[i].positionPlayed !== null && data[i].positionPlayed !== "") {
                    allNull = false;
                } else {
                    allFilled = false;
                }
                statArray.push(data[i].positionPlayed);
                returnArray.push(statArray);
            }
            if (!allFilled && !allNull) {
                errorCount += 1;
                error += `Stat data missing from match ${match} team ${team}.`;
            }
            return returnArray;
        }
    }
    
    const resetAllForms = () => {
        setResetKey(prev => prev + 1);
    };

    return (
        <div id="set-submit-form">
            <div className="comp-header">
                <div 
                  className={`set-submission-category ${creationState === 0 ? 'active' : ''}`}
                  onClick={() => setCreationState(0)}
                >Set</div>
                <div 
                  className={`set-submission-category ${creationState === 1 ? 'active' : ''}`}
                  onClick={() => setCreationState(1)}
                >Event</div>
                <div 
                  className={`set-submission-category ${creationState === 2 ? 'active' : ''}`}
                  onClick={() => setCreationState(2)}
                >Team</div>
                <div 
                  className={`set-submission-category ${creationState === 3 ? 'active' : ''}`}
                  onClick={() => setCreationState(3)}
                >Player</div>
            </div>
            {creationState === 0 && (
                <SetInsertion resetKey={resetKey} setSetInsertion={setSetInsertion} events={events} teams={teams} players={players} charactersAndMoves={charactersAndMoves} />
            )}
            {creationState === 1 && (
                <EventCreation resetKey={resetKey} setEventInsertion={setEventInsertion} />
            )}
            {creationState === 2 && (
                <TeamCreation resetKey={resetKey} setTeamInsertion={setTeamInsertion} />
            )}
            {creationState === 3 && (
                <PlayerCreation resetKey={resetKey} setPlayerInsertion={setPlayerInsertion} />
            )}
            {/* Submit Button */}
            <button id="set-submit-button" onClick={submitComp}>Submit</button>
            {/* Add Reset Button */}
            <button id="set-reset-button" onClick={resetAllForms}>Reset</button>
        </div>
    );
}

// The full insertion form for a set
function SetInsertion({ resetKey, setSetInsertion, events, teams, players, charactersAndMoves }) {
    /* set_id, set_score, set_winner, and match_ids will be calculated when and after submitting */
    const [composedSet, setComposedSet] = useState({event_date: null, event_id: null, event_name: null, matches: null, set_descriptor: null, set_id: null, set_score: null, set_winner: null});
    const [match1, setMatch1] = useState({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null});
    const [match2, setMatch2] = useState({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null});
    const [match3, setMatch3] = useState({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null});
    const [match4, setMatch4] = useState({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null});
    const [match5, setMatch5] = useState({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null});
    const [selectedEvent, setSelectedEvent] = useState({event_id: null, event_name: null, event_date: null, vod_url: null});
    const [setDescriptor, setSetDescriptor] = useState("");

    const resetForm = () => {
        setMatch1({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null});
        setMatch2({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null});
        setMatch3({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null});
        setMatch4({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null});
        setMatch5({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null});
        setSelectedEvent({event_id: null, event_name: null, event_date: null, vod_url: null});
        setSetDescriptor("");
    };

    useEffect(() => {
        if (selectedEvent) {
            setComposedSet({event_date: selectedEvent.event_date, event_id: selectedEvent.event_id, event_name: selectedEvent.event_name, matches: [match1, match2, match3, match4, match5], set_descriptor: setDescriptor, set_id: null, set_score: null, set_winner: null, vod_url: selectedEvent.vod_url});
        } else {
            setComposedSet({event_date: null, event_id: null, event_name: null, matches: [match1, match2, match3, match4, match5], set_descriptor: setDescriptor, set_id: null, set_score: null, set_winner: null, vod_url: null});
        }
    }, [match1, match2, match3, match4, match5, selectedEvent, setDescriptor]);

    useEffect(() => {
        resetForm();
    }, []);

    useEffect(() => {
        resetForm();
    }, [resetKey]);

    useEffect(() => {
        console.log(match1, match2, match3, match4, match5);
    }, [match1, match2, match3, match4, match5]);

    useEffect(() => {
        setComposedSet({...composedSet, set_descriptor: setDescriptor});
    }, [setDescriptor]);

    return (
        <div id="set-creation" className="comp-card">
            <div className="set-creation-event-data">
                {/* Event Name Dropdown */}
                <select value={selectedEvent && selectedEvent.event_name ? selectedEvent.event_name : ""} onChange={(e) => {
                    const eventName = e.target.value;
                    const event = events.find(ev => ev.event_name === eventName);
                    setSelectedEvent(event);
                }}>
                    <option value="">Select Event</option>
                    {events.map(event => (
                        <option key={event.event_id} value={event.event_name}>
                            {event.event_name}
                        </option>
                    ))}
                </select>
                {/* Event Date (Read-only) */}
                <input 
                    type="text" 
                    value={selectedEvent && selectedEvent.event_date ? selectedEvent.event_date : ""} 
                    readOnly 
                    placeholder="Event Date (Choose Event)"
                />
                {/* Event VOD URL (Read-only) */}
                <input 
                    type="text" 
                    value={selectedEvent && selectedEvent.vod_url ? selectedEvent.vod_url : ""} 
                    readOnly 
                    placeholder="Event VOD URL (Choose Event)"
                />
            </div>
            {/* Set Descriptor (Text Input) */}
            <input type="text" value={setDescriptor} placeholder="Set Descriptor (EX: Losers Finals)" onChange={(e) => setSetDescriptor(e.target.value)} />
            <div className="comp-card">
                <MatchInsertion resetKey={resetKey} match={match1} setMatch={setMatch1} teams={teams} players={players} charactersAndMoves={charactersAndMoves} matchNumber={1}/>
            </div>
            <div className="comp-card">
                <MatchInsertion resetKey={resetKey} match={match2} setMatch={setMatch2} teams={teams} players={players} charactersAndMoves={charactersAndMoves} matchNumber={2}/>
            </div>
            <div className="comp-card">
                <MatchInsertion resetKey={resetKey} match={match3} setMatch={setMatch3} teams={teams} players={players} charactersAndMoves={charactersAndMoves} matchNumber={3}/>
            </div>
            <div className="comp-card">
                <MatchInsertion resetKey={resetKey} match={match4} setMatch={setMatch4} teams={teams} players={players} charactersAndMoves={charactersAndMoves} matchNumber={4}/>
            </div>
            <div className="comp-card">
                <MatchInsertion resetKey={resetKey} match={match5} setMatch={setMatch5} teams={teams} players={players} charactersAndMoves={charactersAndMoves} matchNumber={5}/>
            </div>
        </div>
    );
}

// Match insertion form for a set (Used in SetInsertion)
    function MatchInsertion({ resetKey, match, setMatch, teams, players, charactersAndMoves, matchNumber }) {
    // {match_id: null, match_winner_id: null, match_winner_text: null, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null}
    // Just used in this and lower components. Not sent up components to database
    const [unavailableCharacters, setUnavailableCharacters] = useState([]);
    const [firstPickSelected, setFirstPickSelected] = useState(1); // 1 is unselected, 2 is team 1 is fp, 3 is team 2 is fp (For CompInsertion To Know Pick Positions / Ban Positions)
    const [pickedTeams, setPickedTeams] = useState({team1: match.team1_id ? {team_id: match.team1_id, team_name: match.team1_name} : {team_id: null, team_name: "Team 1"}, team2: match.team2_id ? {team_id: match.team2_id, team_name: match.team2_name} : {team_id: null, team_name: "Team 2"}});

    useEffect(() => {
        setPickedTeams({team1: match.team1_id ? {team_id: match.team1_id, team_name: match.team1_name} : {team_id: null, team_name: "Team 1"}, team2: match.team2_id ? {team_id: match.team2_id, team_name: match.team2_name} : {team_id: null, team_name: "Team 2"}});
    }, [match.team1_id, match.team2_id]);

    // Filter out characters that are already banned or picked
    useEffect(() => {
        setUnavailableCharacters([
            ...match.team1_bans.map(ban => ban.pokemon_id),
            ...match.team2_bans.map(ban => ban.pokemon_id),
            ...match.team1_picks.map(pick => pick.pokemon_id),
            ...match.team2_picks.map(pick => pick.pokemon_id)
        ]);
    }, [match.team1_picks, match.team2_picks, match.team1_bans, match.team2_bans]);

    useEffect(() => {
        if (firstPickSelected === 1) {
            setMatch({...match, firstPick: 0});
        } else if (firstPickSelected === 2) {
            setMatch({...match, firstPick: 1});
        } else if (firstPickSelected === 3) {
            setMatch({...match, firstPick: 2});
        }
    }, [firstPickSelected]);

    return (
        <div id="match-insertion">
            <h3>Match {matchNumber}</h3>
            <div className="set-comp-content">
            {[1, 2].map((compNumber) => (
                <CompInsertion 
                    key={compNumber}
                    resetKey={resetKey}
                    match={match}
                    setMatch={setMatch} 
                    teams={teams} 
                    players={players} 
                    charactersAndMoves={charactersAndMoves}
                    unavailableCharacters={unavailableCharacters}
                    firstPickSelected={firstPickSelected}
                    setFirstPickSelected={setFirstPickSelected}
                    compNumber={compNumber}
                />
            ))}
            </div>
            {/* Match Winner Dropdown */}
            <div className="match-winner-dropdown">
                <select value={{team_id: match.match_winner_id, team_name: match.match_winner_text} ?? ""} onChange={(e) => setMatch({...match, match_winner_id: e.target.value.team_id, match_winner_text: e.target.value.team_name})}>
                    <option value="">Winner Select</option>
                    <option value={pickedTeams.team1}>{pickedTeams.team1.team_name}</option>
                    <option value={pickedTeams.team2}>{pickedTeams.team2.team_name}</option>
                </select>
            </div>
        </div>
    )
}

// Comp insertion form for a match (Used in SetInsertion)
function CompInsertion({ resetKey, match, setMatch, teams, players, charactersAndMoves, unavailableCharacters, firstPickSelected, setFirstPickSelected, compNumber }) {
    // Get unique pokemon_name and pokemon_id combinations
    const uniquePokemon = [...new Set(charactersAndMoves.map(char => JSON.stringify({pokemon_name: char.pokemon_name, pokemon_id: char.pokemon_id})))].map(str => JSON.parse(str));
    const [bans, setBans] = useState([{ban_position: 1}, {ban_position: 2}, {ban_position: 3}]);
    const [picks, setPicks] = useState([{pick_position: 1}, {pick_position: 2}, {pick_position: 3}, {pick_position: 4}, {pick_position: 5}]);

    useEffect(() => {
        setBans([{ban_position: 1}, {ban_position: 2}, {ban_position: 3}]);
        setPicks([{pick_position: 1}, {pick_position: 2}, {pick_position: 3}, {pick_position: 4}, {pick_position: 5}]);
    }, [resetKey]);

    // Filter out unavailable characters
    const filteredUniquePokemon = uniquePokemon.filter(char => 
        !unavailableCharacters.includes(char.pokemon_id) || !unavailableCharacters.some(id => id !== null && id !== undefined)
    );

    useEffect(() => {
        
    }, [bans, picks]);

    return (
        <div id="comp-insertion">
            <div className="set-team-header">
                {/* Team Name Dropdown */}
                <select value={compNumber === 1 ? (match.team1_name ? match.team1_name : "") : (match.team2_name ? match.team2_name : "")} onChange={(e) => { setMatch({...match, [compNumber === 1 ? "team1_id" : "team2_id"]: e.target.value.team_id, [compNumber === 1 ? "team1_name" : "team2_name"]: e.target.value.team_name, [compNumber === 1 ? "team1_region" : "team2_region"]: e.target.value.team_region}); }}>
                    <option value="">Select Team</option>
                    {teams.map(team => (
                        <option key={team.team_id} value={team}>
                            {team.team_name}
                        </option>
                    ))}
                </select>
                {/* Team Region (Read-only) */}
                <div className="team-region-display">
                    <input 
                    type="text" 
                    value={compNumber === 1 ? (match.team1_region ? match.team1_region : "") : (match.team2_region ? match.team2_region : "")} 
                    readOnly 
                    placeholder="Team Region (Choose Team)"
                    />
                </div>
                
                {/* First Pick Checkbox */}
                <div className="first-pick-checkbox">   
                    <label>
                        First Pick:
                    </label>
                    <input 
                        type="checkbox" 
                        checked={(firstPickSelected === 2 && compNumber === 1) || (firstPickSelected === 3 && compNumber === 2)} 
                        disabled={firstPickSelected !== 1}
                        onChange={(e) => { 
                            if (firstPickSelected === 1) {
                                !e.target.checked 
                                    ? setFirstPickSelected(1) /* Was Selected, Unselected (None Selected) */ 
                                    : compNumber === 1 
                                        ? setFirstPickSelected(2) /* Team 1 is FP */ 
                                        : setFirstPickSelected(3) /* Team 2 is FP */ 
                            }
                        }} 
                    />
                </div>
            </div>
            <div className="set-team-bans">
                {/* Bans Dropdowns */}
                {[1, 2, 3].map((banPosition) => (
                    <CustomDropdown
                        key={banPosition}
                        value={ {pokemon_id: bans[banPosition]?.pokemon_id, pokemon_name: bans[banPosition]?.pokemon_name} ?? { pokemon_id: "", pokemon_name: "" } }
                        onChange={e => {
                            const value = e.target.value;
                            setBans(prevBans => {
                                const newBans = [...prevBans];
                                newBans[banPosition] = {
                                    ...newBans[banPosition],
                                    pokemon_id: value.pokemon_id,
                                    pokemon_name: value.pokemon_name
                                };
                                return newBans;
                            });
                        }}
                        options={filteredUniquePokemon}
                        placeholder={`Ban ${banPosition} Select`}
                        disabled={false}
                        path="/assets/Draft/headshots"
                    />
                ))}
            </div>
            <div className="team-comp">
                {/* Pokemon / Players */}
                {[1, 2, 3, 4, 5].map((pickNumber) => (
                    <CharacterPlayer 
                        key={pickNumber}
                        character={ {pokemon_id: picks[pickNumber]?.pokemon_id, pokemon_name: picks[pickNumber]?.pokemon_name} ?? { pokemon_id: "", pokemon_name: "" } } 
                        move1={ {move_id: picks[pickNumber]?.move_1_id, move_name: picks[pickNumber]?.move_1_name} ?? { move_id: "", move_name: "" } }
                        move2={ {move_id: picks[pickNumber]?.move_2_id, move_name: picks[pickNumber]?.move_2_name} ?? { move_id: "", move_name: "" } }
                        player={ {player_id: picks[pickNumber]?.player_id, player_name: picks[pickNumber]?.player_name, player_other_names: picks[pickNumber]?.player_other_names} ?? { player_id: "", player_name: "", player_other_names: "" } } 
                        stats={{
                            assists: picks[pickNumber]?.assists ?? "",
                            dealt: picks[pickNumber]?.dealt ?? "",
                            kills: picks[pickNumber]?.kills ?? "",
                            healed: picks[pickNumber]?.healed ?? "",
                            scored: picks[pickNumber]?.scored ?? "",
                            taken: picks[pickNumber]?.taken ?? "",
                            position_played: picks[pickNumber]?.position_played ?? ""
                        }}
                        setCharacter={e => {
                            const value = e.target.value;
                            setPicks(prevPicks => {
                                const newPicks = [...prevPicks];
                                newPicks[pickNumber] = {
                                    ...newPicks[pickNumber],
                                    pokemon_id: value.pokemon_id,
                                    pokemon_name: value.pokemon_name
                                };
                                return newPicks;
                            });
                        }}
                        setMove1={e => {
                            const value = e.target.value;
                            setPicks(prevPicks => {
                                const newPicks = [...prevPicks];
                                newPicks[pickNumber] = {
                                    ...newPicks[pickNumber],
                                    move_1_id: value.move_id,
                                    move_1_name: value.move_name
                                };
                                return newPicks;
                            });
                        }}
                        setMove2={e => {
                            const value = e.target.value;
                            setPicks(prevPicks => {
                                const newPicks = [...prevPicks];
                                newPicks[pickNumber] = {
                                    ...newPicks[pickNumber],
                                    move_2_id: value.move_id,
                                    move_2_name: value.move_name
                                };
                                return newPicks;
                            });
                        }}
                        setPlayer={e => {
                            const value = e.target.value;
                            setPicks(prevPicks => {
                                const newPicks = [...prevPicks];
                                newPicks[pickNumber] = {
                                    ...newPicks[pickNumber],
                                    player_id: value.player_id,
                                    player_name: value.player_name,
                                    player_other_names: value.player_other_names
                                };
                                return newPicks;
                            });
                        }}
                        setStats={e => {
                            const value = e.target.value;
                            setPicks(prevPicks => {
                                const newPicks = [...prevPicks];
                                newPicks[pickNumber] = {
                                    ...newPicks[pickNumber],
                                    assists: value.assists,
                                    dealt: value.dealt,
                                    kills: value.kills,
                                    healed: value.healed,
                                    scored: value.scored,
                                    taken: value.taken,
                                    position_played: value.position_played
                                };
                                return newPicks;
                            });
                        }}
                        charactersAndMoves={charactersAndMoves}
                        players={players}
                        unavailableCharacters={unavailableCharacters}
                    />
                ))}
            </div>
        </div>
    )
}

// Character and player insertion form for a comp (Used in SetInsertion)
function CharacterPlayer({ character, move1, move2, player, stats, setCharacter, setMove1, setMove2, setPlayer, setStats, charactersAndMoves, players, unavailableCharacters }) {
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
    const availableMoves = character ? getPokemonMoves(character.pokemon_name) : [];
    // Get unique pokemon_name and pokemon_id combinations
    const uniquePokemon = [...new Set(charactersAndMoves.map(char => JSON.stringify({pokemon_name: char.pokemon_name, pokemon_id: char.pokemon_id})))].map(str => JSON.parse(str));
    // Filter out unavailable characters
    const filteredUniquePokemon = uniquePokemon.filter(char => 
        !unavailableCharacters.includes(char.pokemon_id) || !unavailableCharacters.some(id => id !== null && id !== undefined)
    );
    
    return (
        <div className="character-player-stat-container">
            <div className="set-character-player">
                {/* Character Dropdown */}
                <CustomDropdown
                    value={character}
                    onChange={(value) => {
                        setCharacter(value);
                        setMove1(null);
                        setMove2(null);
                    }}
                    options={filteredUniquePokemon}
                    placeholder="Character Select"
                    path="/assets/Draft/headshots"
                />
                {/* Move 1 Dropdown */}
                <CustomDropdown
                    value={move1}
                    onChange={setMove1}
                    options={availableMoves}
                    placeholder="Move 1 Select"
                    disabled={!character}   
                    path="/assets/Draft/moves"
                    character_name={character ? character.pokemon_name : character}  
                />
                {/* Move 2 Dropdown */}
                <CustomDropdown
                    value={move2}
                    onChange={setMove2}
                    options={availableMoves}
                    placeholder="Move 2 Select"
                    disabled={!character}   
                    path="/assets/Draft/moves"
                    character_name={character ? character.pokemon_name : character}  
                />
                {/* Player Dropdown */}
                <select value={player ? JSON.stringify(player) : ""} onChange={(e) => setPlayer(JSON.parse(e.target.value))}>
                    <option value="">Player Select</option>
                    {players.map(player => (
                        <option key={player.player_id} value={JSON.stringify({player_id: player.player_id, player_name: player.player_name})}>
                            {player.player_name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="stat-inputs-container">
                <input className="stat-input" type="text" placeholder="kills" value={stats.kills ?? ""} onChange={(e) => setStats(prev => ({ ...prev, kills: e.target.value ? Number(e.target.value) : null }))}></input>
                <input className="stat-input" type="text" placeholder="assists" value={stats.assists ?? ""} onChange={(e) => setStats(prev => ({ ...prev, assists: e.target.value ? Number(e.target.value) : null }))}></input>
                <input className="stat-input" type="text" placeholder="scored" value={stats.scored ?? ""} onChange={(e) => setStats(prev => ({ ...prev, scored: e.target.value ? Number(e.target.value) : null }))}></input>
                <input className="stat-input" type="text" placeholder="dealt" value={stats.dealt ?? ""} onChange={(e) => setStats(prev => ({ ...prev, dealt: e.target.value ? Number(e.target.value) : null }))}></input>
                <input className="stat-input" type="text" placeholder="taken" value={stats.taken ?? ""} onChange={(e) => setStats(prev => ({ ...prev, taken: e.target.value ? Number(e.target.value) : null }))}></input>
                <input className="stat-input" type="text" placeholder="healed" value={stats.healed ?? ""} onChange={(e) => setStats(prev => ({ ...prev, healed: e.target.value ? Number(e.target.value) : null }))}></input>
                <select className="stat-input" value={stats.positionPlayed ?? ""} onChange={(e) => setStats(prev => ({ ...prev, positionPlayed: e.target.value }))}>
                    <option value="">Role</option>
                    <option value="TopCarry">Top Carry</option>
                    <option value="EXPShareTop">Top EXP Share</option>
                    <option value="JungleCarry">Jungle Carry</option>
                    <option value="BottomCarry">Bot Carry</option>
                    <option value="EXPShareBot">Bot EXP Share</option>
                </select>
            </div>
        </div>
    )
}

// Creation form for JUST event
function EventCreation({ resetKey, setEventInsertion }) {
    const [eventName, setEventName] = useState(null);
    const [eventDate, setEventDate] = useState(null);
    const [eventVodUrl, setEventVodUrl] = useState(null);

    const resetForm = () => {
        setEventName(null);
        setEventDate(null);
        setEventVodUrl(null);
    };

    useEffect(() => {
        setEventInsertion({event_name: eventName, event_date: eventDate, vod_url: eventVodUrl});
    }, [eventName, eventDate, eventVodUrl]);

    useEffect(() => {
        resetForm();
    }, []);

    useEffect(() => {
        resetForm();
    }, [resetKey]);

    return (
        <div id="event-creation">
            {/* Event Name */}
            <input type="text" value={eventName ? eventName : ""} placeholder="Event Name" onChange={(e) => setEventName(e.target.value)} />
            {/* Event Date */}
            <input type="date" value={eventDate ? eventDate : ""} placeholder="Event Date" onChange={(e) => setEventDate(e.target.value)} />
            {/* Event VOD URL */}
            <input type="text" value={eventVodUrl ? eventVodUrl : ""} placeholder="Event VOD URL" onChange={(e) => setEventVodUrl(e.target.value)} />
        </div>
    )
}

// Creation form for JUST a team
function TeamCreation({ resetKey, setTeamInsertion }) {
    const [teamName, setTeamName] = useState(null);
    const [teamRegion, setTeamRegion] = useState(null);

    const resetForm = () => {
        setTeamName(null);
        setTeamRegion(null);
    };

    useEffect(() => {
        setTeamInsertion({team_name: teamName, team_region: teamRegion});
    }, [teamName, teamRegion]);

    useEffect(() => {
        resetForm();
    }, []);

    useEffect(() => {
        resetForm();
    }, [resetKey]);

    return (
        <div id="team-creation">
            {/* Team Name */}
            <input type="text" value={teamName ? teamName : ""} placeholder="Team Name" onChange={(e) => setTeamName(e.target.value)} />
            {/* Team Region */}
            <input type="text" value={teamRegion ? teamRegion : ""} placeholder="Team Region" onChange={(e) => setTeamRegion(e.target.value)} />
        </div>
    );
}

// Creation form for JUST a player
function PlayerCreation({ resetKey, setPlayerInsertion }) {
    const [playerName, setPlayerName] = useState(null);

    const resetForm = () => {
        setPlayerName(null);
    };

    useEffect(() => {
        setPlayerInsertion({player_name: playerName});
    }, [playerName]);

    useEffect(() => {
        resetForm();
    }, []);

    useEffect(() => {
        resetForm();
    }, [resetKey]);

    return (
        <div id="player-creation">
            {/* Player Name */}
            <input type="text" value={playerName ? playerName : ""} placeholder="Player Name" onChange={(e) => setPlayerName(e.target.value)} />
        </div>
    );
}

export default SubmitSetModal;
