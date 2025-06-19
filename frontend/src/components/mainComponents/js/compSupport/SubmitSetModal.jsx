import React, { useState, useEffect } from 'react';
import { insertEvent, insertTeam, insertPlayer, insertSet } from '../backendCalls/http';
import CustomDropdown from './CustomDropdown';
import { formatSet } from '../Comps';

function SubmitSetModal({ setShowSubmitForm, setCompsData, compsData, events, teams, players, charactersAndMoves, setEvents, setTeams, setPlayers, user }) {
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

        function setCheck() {
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
                if (match !== null) {
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
                        players: [checkNull(matchData.team1[19]?.player_name, "team1Player1", i), checkNull(matchData.team1[20]?.player_name, "team1Player2", i), checkNull(matchData.team1[21]?.player_name, "team1Player3", i), checkNull(matchData.team1[22]?.player_name, "team1Player4", i), checkNull(matchData.team1[23]?.player_name, "team1Player5", i)]
                    }
                    let team2Data = {
                        name: checkNull(matchData.team2[0]?.team_name, "team2TeamName", i),
                        region: checkNull(matchData.team2[0]?.team_region, "team2TeamRegion", i),
                        firstPick: checkNull(matchData.team2[1], "team2FirstPick", i),
                        bans: [checkNull(matchData.team2[2]?.pokemon_name, "team2Ban1", i), checkNull(matchData.team2[3]?.pokemon_name, "team2Ban2", i)],
                        pokemon: [checkNull(matchData.team2[4]?.pokemon_name, "team2Pokemon1", i), checkNull(matchData.team2[5]?.pokemon_name, "team2Pokemon2", i), checkNull(matchData.team2[6]?.pokemon_name, "team2Pokemon3", i), checkNull(matchData.team2[7]?.pokemon_name, "team2Pokemon4", i), checkNull(matchData.team2[8]?.pokemon_name, "team2Pokemon5", i)],
                        pokemon_moves: [checkNull(matchData.team2[9]?.move_name, "team2Pokemon1Move1", i), checkNull(matchData.team2[10]?.move_name, "team2Pokemon1Move2", i), checkNull(matchData.team2[11]?.move_name, "team2Pokemon2Move1", i), checkNull(matchData.team2[12]?.move_name, "team2Pokemon2Move2", i), checkNull(matchData.team2[13]?.move_name, "team2Pokemon3Move1", i), checkNull(matchData.team2[14]?.move_name, "team2Pokemon3Move2", i), checkNull(matchData.team2[15]?.move_name, "team2Pokemon4Move1", i), checkNull(matchData.team2[16]?.move_name, "team2Pokemon4Move2", i), checkNull(matchData.team2[17]?.move_name, "team2Pokemon5Move1", i), checkNull(matchData.team2[18]?.move_name, "team2Pokemon5Move2", i)],
                        players: [checkNull(matchData.team2[19]?.player_name, "team2Player1", i), checkNull(matchData.team2[20]?.player_name, "team2Player2", i), checkNull(matchData.team2[21]?.player_name, "team2Player3", i), checkNull(matchData.team2[22]?.player_name, "team2Player4", i), checkNull(matchData.team2[23]?.player_name, "team2Player5", i)]
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
                        vod: checkNull(setInsertion[5]?.vod_url, "vodUrl", 0)
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
                if (match !== null) {
                    const thisMatch = {
                        team1: {
                            team_id: match[0][0].team_id,
                            isFirstPick: match[0][1],
                            bans: [match[0][2]?.pokemon_id, match[0][3]?.pokemon_id],
                            pokemon: [match[0][4]?.pokemon_id, match[0][5]?.pokemon_id, match[0][6]?.pokemon_id, match[0][7]?.pokemon_id, match[0][8]?.pokemon_id],
                            pokemon_moves: [match[0][9]?.move_id, match[0][10]?.move_id, match[0][11]?.move_id, match[0][12]?.move_id, match[0][13]?.move_id, match[0][14]?.move_id, match[0][15]?.move_id, match[0][16]?.move_id, match[0][17]?.move_id, match[0][18]?.move_id],
                            players: [match[0][19]?.player_id, match[0][20]?.player_id, match[0][21]?.player_id, match[0][22]?.player_id, match[0][23]?.player_id]
                        },
                        team2: {
                            team_id: match[1][0].team_id,
                            isFirstPick: match[1][1],
                            bans: [match[1][2]?.pokemon_id, match[1][3]?.pokemon_id],
                            pokemon: [match[1][4]?.pokemon_id, match[1][5]?.pokemon_id, match[1][6]?.pokemon_id, match[1][7]?.pokemon_id, match[1][8]?.pokemon_id],
                            pokemon_moves: [match[1][9]?.move_id, match[1][10]?.move_id, match[1][11]?.move_id, match[1][12]?.move_id, match[1][13]?.move_id, match[1][14]?.move_id, match[1][15]?.move_id, match[1][16]?.move_id, match[1][17]?.move_id, match[1][18]?.move_id],
                            players: [match[1][19]?.player_id, match[1][20]?.player_id, match[1][21]?.player_id, match[1][22]?.player_id, match[1][23]?.player_id]
                        },
                        winningTeam: parseInt(match[2])
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
    const [match1, setMatch1] = useState(null);
    const [match2, setMatch2] = useState(null);
    const [match3, setMatch3] = useState(null);
    const [match4, setMatch4] = useState(null);
    const [match5, setMatch5] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [setDescriptor, setSetDescriptor] = useState("");

    const resetForm = () => {
        setMatch1(null);
        setMatch2(null);
        setMatch3(null);
        setMatch4(null);
        setMatch5(null);
        setSelectedEvent(null);
        setSetDescriptor("");
    };

    useEffect(() => {
        if (selectedEvent) {
            setSetInsertion([match1, match2, match3, match4, match5, selectedEvent, setDescriptor]);
        } else {
            setSetInsertion([match1, match2, match3, match4, match5, null, null]);
        }
    }, [match1, match2, match3, match4, match5, selectedEvent, setDescriptor]);

    useEffect(() => {
        resetForm();
    }, []);

    useEffect(() => {
        resetForm();
    }, [resetKey]);

    return (
        <div id="set-creation" className="comp-card">
            <div className="set-creation-event-data">
                {/* Event Name Dropdown */}
                <select value={selectedEvent ? selectedEvent.event_name : ""} onChange={(e) => {
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
                    value={selectedEvent ? selectedEvent.event_date : ""} 
                    readOnly 
                    placeholder="Event Date (Choose Event)"
                />
                {/* Event VOD URL (Read-only) */}
                <input 
                    type="text" 
                    value={selectedEvent ? selectedEvent.vod_url : ""} 
                    readOnly 
                    placeholder="Event VOD URL (Choose Event)"
                />
            </div>
            {/* Set Descriptor (Text Input) */}
            <input type="text" value={setDescriptor} placeholder="Set Descriptor (EX: Losers Finals)" onChange={(e) => setSetDescriptor(e.target.value)} />
            <div className="comp-card">
                <MatchInsertion resetKey={resetKey} setMatch={setMatch1} teams={teams} players={players} charactersAndMoves={charactersAndMoves} matchNumber={1}/>
            </div>
            <div className="comp-card">
                <MatchInsertion resetKey={resetKey} setMatch={setMatch2} teams={teams} players={players} charactersAndMoves={charactersAndMoves} matchNumber={2}/>
            </div>
            <div className="comp-card">
                <MatchInsertion resetKey={resetKey} setMatch={setMatch3} teams={teams} players={players} charactersAndMoves={charactersAndMoves} matchNumber={3}/>
            </div>
            <div className="comp-card">
                <MatchInsertion resetKey={resetKey} setMatch={setMatch4} teams={teams} players={players} charactersAndMoves={charactersAndMoves} matchNumber={4}/>
            </div>
            <div className="comp-card">
                <MatchInsertion resetKey={resetKey} setMatch={setMatch5} teams={teams} players={players} charactersAndMoves={charactersAndMoves} matchNumber={5}/>
            </div>
        </div>
    );
}

// Match insertion form for a set (Used in SetInsertion)
    function MatchInsertion({ resetKey, setMatch, teams, players, charactersAndMoves, matchNumber }) {
    const [comp1, setComp1] = useState(null);
    const [comp2, setComp2] = useState(null);
    const [matchWinner, setMatchWinner] = useState(null);
    // Just used in this and lower components. Not sent up components to database
    const [unavailableCharacters, setUnavailableCharacters] = useState([]);
    const [pickedTeams, setPickedTeams] = useState({team1: "Team 1", team2: "Team 2"});

    const resetForm = () => {
        setComp1(null);
        setComp2(null);
        setMatchWinner(null);
    };

    useEffect(() => {
        setMatch([comp1, comp2, matchWinner]);
    }, [comp1, comp2, matchWinner]);

    useEffect(() => {
        resetForm();
    }, []);

    useEffect(() => {
        resetForm();
    }, [resetKey]);

    // Filter out characters that are already banned or picked
    useEffect(() => {
        // When comp1 and comp2 are null, use all characters
        if (!comp1 && !comp2) {
            setUnavailableCharacters([[]]);
            return;
        }

        if (comp1 && comp1[0]) {
            setPickedTeams({team1: comp1[0].team_name, team2: pickedTeams.team2});
        }
        if (comp2 && comp2[0]) {
            setPickedTeams({team1: pickedTeams.team1, team2: comp2[0].team_name});
        }
        
        // comp#[2-3] are bans. comp#[4-8] are picks
        // Remove the banned characters from the available characters
        const bannedCharacters = [];
        if (comp1) {
            [comp1[2], comp1[3]].forEach(ban => {
                if (ban && ban.pokemon_id) bannedCharacters.push(ban.pokemon_id);
            });
        }
        if (comp2) {
            [comp2[2], comp2[3]].forEach(ban => {
                if (ban && ban.pokemon_id) bannedCharacters.push(ban.pokemon_id);
            });
        }
        
        // Remove the picks from the available characters
        const picks = [];
        if (comp1) {
            [comp1[4], comp1[5], comp1[6], comp1[7], comp1[8]].forEach(pick => {
                if (pick && pick.pokemon_id) picks.push(pick.pokemon_id);
            });
        }
        if (comp2) {
            [comp2[4], comp2[5], comp2[6], comp2[7], comp2[8]].forEach(pick => {
                if (pick && pick.pokemon_id) picks.push(pick.pokemon_id);
            });
        }
        
        // Combine bannedCharacters and picks
        setUnavailableCharacters([...bannedCharacters, ...picks]);
    }, [comp1, comp2, charactersAndMoves]);

    return (
        <div id="match-insertion">
            <h3>Match {matchNumber}</h3>
            <div className="set-comp-content">
                <CompInsertion 
                    resetKey={resetKey} 
                    setComp={setComp1} 
                    teams={teams} 
                    players={players} 
                    charactersAndMoves={charactersAndMoves}
                    unavailableCharacters={unavailableCharacters}
                />
                <CompInsertion 
                    resetKey={resetKey} 
                    setComp={setComp2} 
                    teams={teams} 
                    players={players} 
                    charactersAndMoves={charactersAndMoves}
                    unavailableCharacters={unavailableCharacters}
                />
            </div>
            {/* Match Winner Dropdown */}
            <div className="match-winner-dropdown">
                <select value={matchWinner ? matchWinner : ""} onChange={(e) => setMatchWinner(e.target.value)}>
                    <option value="">Winner Select</option>
                    <option value="1">{pickedTeams.team1}</option>
                    <option value="2">{pickedTeams.team2}</option>
                </select>
            </div>
        </div>
    )
}

// Comp insertion form for a match (Used in SetInsertion)
function CompInsertion({ resetKey, setComp, teams, players, charactersAndMoves, unavailableCharacters }) {
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamIsFirstPick, setTeamIsFirstPick] = useState(false);
    const [ban1, setBan1] = useState(null);
    const [ban2, setBan2] = useState(null);
    const [pokemon1, setPokemon1] = useState(null);
    const [pokemon2, setPokemon2] = useState(null);
    const [pokemon3, setPokemon3] = useState(null);
    const [pokemon4, setPokemon4] = useState(null);
    const [pokemon5, setPokemon5] = useState(null);
    const [pokemon1move1, setPokemon1Move1] = useState(null);
    const [pokemon1move2, setPokemon1Move2] = useState(null);
    const [pokemon2move1, setPokemon2Move1] = useState(null);
    const [pokemon2move2, setPokemon2Move2] = useState(null);
    const [pokemon3move1, setPokemon3Move1] = useState(null);
    const [pokemon3move2, setPokemon3Move2] = useState(null);
    const [pokemon4move1, setPokemon4Move1] = useState(null);
    const [pokemon4move2, setPokemon4Move2] = useState(null);
    const [pokemon5move1, setPokemon5Move1] = useState(null);
    const [pokemon5move2, setPokemon5Move2] = useState(null);
    const [player1, setPlayer1] = useState(null);
    const [player2, setPlayer2] = useState(null);   
    const [player3, setPlayer3] = useState(null);
    const [player4, setPlayer4] = useState(null);
    const [player5, setPlayer5] = useState(null);

    const resetForm = () => {
        setSelectedTeam(null);
        setTeamIsFirstPick(false);
        setBan1(null);
        setBan2(null);
        setPokemon1(null);
        setPokemon2(null);
        setPokemon3(null);
        setPokemon4(null);
        setPokemon5(null);
        setPokemon1Move1(null);
        setPokemon1Move2(null);
        setPokemon2Move1(null);
        setPokemon2Move2(null);
        setPokemon3Move1(null);
        setPokemon3Move2(null);
        setPokemon4Move1(null);
        setPokemon4Move2(null);
        setPokemon5Move1(null);
        setPokemon5Move2(null);
        setPlayer1(null);
        setPlayer2(null);
        setPlayer3(null);
        setPlayer4(null);
        setPlayer5(null);
    };

    useEffect(() => {
        if (selectedTeam) {
            setComp([selectedTeam, teamIsFirstPick, ban1, ban2, pokemon1, pokemon2, pokemon3, pokemon4, pokemon5, pokemon1move1, pokemon1move2, pokemon2move1, pokemon2move2, pokemon3move1, pokemon3move2, pokemon4move1, pokemon4move2, pokemon5move1, pokemon5move2, player1, player2, player3, player4, player5]);
        } else {
            setComp([null, teamIsFirstPick, ban1, ban2, pokemon1, pokemon2, pokemon3, pokemon4, pokemon5, pokemon1move1, pokemon1move2, pokemon2move1, pokemon2move2, pokemon3move1, pokemon3move2, pokemon4move1, pokemon4move2, pokemon5move1, pokemon5move2, player1, player2, player3, player4, player5]);
        }
    }, [selectedTeam, teamIsFirstPick, ban1, ban2, pokemon1, pokemon2, pokemon3, pokemon4, pokemon5, pokemon1move1, pokemon1move2, pokemon2move1, pokemon2move2, pokemon3move1, pokemon3move2, pokemon4move1, pokemon4move2, pokemon5move1, pokemon5move2, player1, player2, player3, player4, player5]);

    useEffect(() => {
        resetForm();
    }, []);

    useEffect(() => {
        resetForm();
    }, [resetKey]);

    // Get unique pokemon_name and pokemon_id combinations
    const uniquePokemon = [...new Set(charactersAndMoves.map(char => JSON.stringify({pokemon_name: char.pokemon_name, pokemon_id: char.pokemon_id})))].map(str => JSON.parse(str));
    // Filter out unavailable characters
    const filteredUniquePokemon = uniquePokemon.filter(char => 
        !unavailableCharacters.includes(char.pokemon_id) || !unavailableCharacters.some(id => id !== null && id !== undefined)
    );

    return (
        <div id="comp-insertion">
            <div className="set-team-header">
                {/* Team Name Dropdown */}
                <select value={selectedTeam ? selectedTeam.team_name : ""} onChange={(e) => {
                    const teamName = e.target.value;
                    const team = teams.find(t => t.team_name === teamName);
                    setSelectedTeam(team);
                }}>
                    <option value="">Select Team</option>
                    {teams.map(team => (
                        <option key={team.team_id} value={team.team_name}>
                            {team.team_name}
                        </option>
                    ))}
                </select>
                {/* Team Region (Read-only) */}
                <div className="team-region-display">
                    <input 
                    type="text" 
                    value={selectedTeam ? selectedTeam.team_region : ""} 
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
                        checked={teamIsFirstPick} 
                        onChange={(e) => setTeamIsFirstPick(e.target.checked)} 
                    />
                </div>
            </div>
            <div className="set-team-bans">
                {/* Bans Dropdowns */}
                <CustomDropdown
                    value={ban1}
                    onChange={setBan1}
                    options={filteredUniquePokemon}
                    placeholder="Ban 1 Select"
                    disabled={false}
                    path="/assets/Draft/headshots"
                />
                <CustomDropdown
                    value={ban2}
                    onChange={setBan2}
                    options={filteredUniquePokemon}
                    placeholder="Ban 2 Select"
                    disabled={false}
                    path="/assets/Draft/headshots"
                />
            </div>
            <div className="team-comp">
                {/* Pokemon / Players */}
                <CharacterPlayer 
                    character={pokemon1} 
                    move1={pokemon1move1} 
                    move2={pokemon1move2} 
                    player={player1} 
                    setCharacter={setPokemon1} 
                    setMove1={setPokemon1Move1} 
                    setMove2={setPokemon1Move2} 
                    setPlayer={setPlayer1}
                    charactersAndMoves={charactersAndMoves}
                    players={players}
                    unavailableCharacters={unavailableCharacters}
                />
                <CharacterPlayer 
                    character={pokemon2} 
                    move1={pokemon2move1} 
                    move2={pokemon2move2} 
                    player={player2} 
                    setCharacter={setPokemon2} 
                    setMove1={setPokemon2Move1} 
                    setMove2={setPokemon2Move2} 
                    setPlayer={setPlayer2}
                    charactersAndMoves={charactersAndMoves}
                    players={players}
                    unavailableCharacters={unavailableCharacters}
                />
                <CharacterPlayer 
                    character={pokemon3} 
                    move1={pokemon3move1} 
                    move2={pokemon3move2} 
                    player={player3} 
                    setCharacter={setPokemon3} 
                    setMove1={setPokemon3Move1} 
                    setMove2={setPokemon3Move2} 
                    setPlayer={setPlayer3}
                    charactersAndMoves={charactersAndMoves}
                    players={players}
                    unavailableCharacters={unavailableCharacters}
                />
                <CharacterPlayer 
                    character={pokemon4} 
                    move1={pokemon4move1} 
                    move2={pokemon4move2} 
                    player={player4} 
                    setCharacter={setPokemon4} 
                    setMove1={setPokemon4Move1} 
                    setMove2={setPokemon4Move2} 
                    setPlayer={setPlayer4}
                    charactersAndMoves={charactersAndMoves}
                    players={players}
                    unavailableCharacters={unavailableCharacters}
                />
                <CharacterPlayer 
                    character={pokemon5} 
                    move1={pokemon5move1} 
                    move2={pokemon5move2} 
                    player={player5} 
                    setCharacter={setPokemon5} 
                    setMove1={setPokemon5Move1} 
                    setMove2={setPokemon5Move2} 
                    setPlayer={setPlayer5}
                    charactersAndMoves={charactersAndMoves}
                    players={players}
                    unavailableCharacters={unavailableCharacters}
                />
            </div>
        </div>
    )
}

// Character and player insertion form for a comp (Used in SetInsertion)
function CharacterPlayer({ character, move1, move2, player, setCharacter, setMove1, setMove2, setPlayer, charactersAndMoves, players, unavailableCharacters }) {
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
