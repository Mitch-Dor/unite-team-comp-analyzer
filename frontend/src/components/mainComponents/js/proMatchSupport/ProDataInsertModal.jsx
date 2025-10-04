import React, { useState, useEffect } from 'react';
import { insertEvent, insertTeam, insertPlayer, insertSet } from '../backendCalls/http';
import CustomDropdown from './CustomDropdown';
import '../../css/proMatchSupport/proDataInsertModal.css';

function ProDataInsertModal({ setShowSubmitForm, coreData, setCoreData, events, teams, players, charactersAndMoves, setEvents, setTeams, setPlayers }) {
    const [setInsertion, setSetInsertion] = useState(null);
    const [eventInsertion, setEventInsertion] = useState(false);
    const [teamInsertion, setTeamInsertion] = useState(false);
    const [playerInsertion, setPlayerInsertion] = useState(false);
    const [creationState, setCreationState] = useState(0);
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        // Set an event listener for if the user clicks outside of the modal to close it
        const handleClick = (e) => {
            if (e.target.id === 'open-set-submit-form' || 
                e.target.closest('#pdim-container')) return;
            setShowSubmitForm(false);
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);

        // const timer = setTimeout(() => {
        //     const savedSet = {};
        //     setSetInsertion(savedSet);
        // }, 5000);

        // return () => clearTimeout(timer);
    }, []);

    // useEffect(() => {
    //     console.log(setInsertion);
    // }, [setInsertion]);
      
  
    // Function to submit the comp
    function submitComp() {
        let errorMsg = "Missing Fields:";
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
            // Check for null values
            /// Event and Set Data
            checkNull(setInsertion.event_date, "Event Date");
            checkNull(setInsertion.event_name, "Event Name");
            checkNull(setInsertion.event_id, "Event ID");
            checkNull(setInsertion.set_descriptor, "Set Descriptor");
            checkNull(setInsertion.set_score[0].team_id, "Set Score[0] Team ID");
            checkNull(setInsertion.set_score[1].team_id, "Set Score[1] Team ID");
            checkNull(setInsertion.set_score[0].team_name, "Set Score[0] Team Name");
            checkNull(setInsertion.set_score[1].team_name, "Set Score[1] Team Name");
            checkNull(setInsertion.set_score[0].wins, "Set Score[0] Wins");
            checkNull(setInsertion.set_score[1].wins, "Set Score[1] Wins");
            checkNull(setInsertion.set_winner.team_id, "Set Winner Team ID");
            checkNull(setInsertion.set_winner.team_name, "Set Winner Team Name");

            let nullMatches = [];
            let nullStats = [];
            
            /// Match Data
            for (let i = 0; i < 5; i++) {
                // Make sure the match is not null
                const backupErrorCount = errorCount;
                const backupErrorMsg = errorMsg;
                checkNull(setInsertion.matches[i].match_winner_id, "Match " + (i+1) + " Winner ID");
                checkNull(setInsertion.matches[i].match_winner_text, "Match " + (i+1) + " Winner Text");
                checkNull(setInsertion.matches[i].team1_id, "Match " + (i+1) + " Team 1 ID");
                checkNull(setInsertion.matches[i].team2_id, "Match " + (i+1) + " Team 2 ID");
                checkNull(setInsertion.matches[i].team1_name, "Match " + (i+1) + " Team 1 Name");
                checkNull(setInsertion.matches[i].team2_name, "Match " + (i+1) + " Team 2 Name");
                checkNull(setInsertion.matches[i].firstPick, "Match " + (i+1) + " First Pick", true);
                checkNull(setInsertion.matches[i].team1_region, "Match " + (i+1) + " Team 1 Region");
                checkNull(setInsertion.matches[i].team2_region, "Match " + (i+1) + " Team 2 Region");
                checkNull(setInsertion.matches[i].match_vod_url, "Match " + (i+1) + " Match VOD URL");
                // Ban Data
                for (let j = 0; j < 3; j++) {
                    checkNull(setInsertion.matches[i].team1_bans[j].pokemon_id, "Match " + (i+1) + " Team 1 Ban " + (j+1) + " Pokemon ID");
                    checkNull(setInsertion.matches[i].team1_bans[j].pokemon_name, "Match " + (i+1) + " Team 1 Ban " + (j+1) + " Pokemon Name");
                    checkNull(setInsertion.matches[i].team1_bans[j].ban_position, "Match " + (i+1) + " Team 1 Ban " + (j+1) + " Ban Position");
                    checkNull(setInsertion.matches[i].team2_bans[j].pokemon_id, "Match " + (i+1) + " Team 2 Ban " + (j+1) + " Pokemon ID");
                    checkNull(setInsertion.matches[i].team2_bans[j].pokemon_name, "Match " + (i+1) + " Team 2 Ban " + (j+1) + " Pokemon Name");
                    checkNull(setInsertion.matches[i].team2_bans[j].ban_position, "Match " + (i+1) + " Team 2 Ban " + (j+1) + " Ban Position");
                }
                // Pick Data
                for (let j = 0; j < 5; j++) {
                    checkNull(setInsertion.matches[i].team1_picks[j].pokemon_id, "Match " + (i+1) + " Team 1 Pick " + (j+1) + " Pokemon ID");
                    checkNull(setInsertion.matches[i].team1_picks[j].pokemon_name, "Match " + (i+1) + " Team 1 Pick " + (j+1) + " Pokemon Name");
                    checkNull(setInsertion.matches[i].team1_picks[j].pick_position, "Match " + (i+1) + " Team 1 Pick " + (j+1) + " Pick Position");
                    checkNull(setInsertion.matches[i].team1_picks[j].move_1_id, "Match " + (i+1) + " Team 1 Pick " + (j+1) + " Move 1 ID");
                    checkNull(setInsertion.matches[i].team1_picks[j].move_1_name, "Match " + (i+1) + " Team 1 Pick " + (j+1) + " Move 1 Name");
                    checkNull(setInsertion.matches[i].team1_picks[j].move_2_id, "Match " + (i+1) + " Team 1 Pick " + (j+1) + " Move 2 ID");
                    checkNull(setInsertion.matches[i].team1_picks[j].move_2_name, "Match " + (i+1) + " Team 1 Pick " + (j+1) + " Move 2 Name");
                    checkNull(setInsertion.matches[i].team1_picks[j].player_id, "Match " + (i+1) + " Team 1 Pick " + (j+1) + " Player ID");
                    checkNull(setInsertion.matches[i].team1_picks[j].player_name, "Match " + (i+1) + " Team 1 Pick " + (j+1) + " Player Name");
                    checkNull(setInsertion.matches[i].team1_picks[j].position_played, "Match " + (i+1) + " Team 1 Pick " + (j+1) + " Stats Position Played");
                    checkNull(setInsertion.matches[i].team2_picks[j].pokemon_id, "Match " + (i+1) + " Team 2 Pick " + (j+1) + " Pokemon ID");
                    checkNull(setInsertion.matches[i].team2_picks[j].pokemon_name, "Match " + (i+1) + " Team 2 Pick " + (j+1) + " Pokemon Name");
                    checkNull(setInsertion.matches[i].team2_picks[j].pick_position, "Match " + (i+1) + " Team 2 Pick " + (j+1) + " Pick Position");
                    checkNull(setInsertion.matches[i].team2_picks[j].move_1_id, "Match " + (i+1) + " Team 2 Pick " + (j+1) + " Move 1 ID");
                    checkNull(setInsertion.matches[i].team2_picks[j].move_1_name, "Match " + (i+1) + " Team 2 Pick " + (j+1) + " Move 1 Name");
                    checkNull(setInsertion.matches[i].team2_picks[j].move_2_id, "Match " + (i+1) + " Team 2 Pick " + (j+1) + " Move 2 ID");
                    checkNull(setInsertion.matches[i].team2_picks[j].move_2_name, "Match " + (i+1) + " Team 2 Pick " + (j+1) + " Move 2 Name");
                    checkNull(setInsertion.matches[i].team2_picks[j].player_id, "Match " + (i+1) + " Team 2 Pick " + (j+1) + " Player ID");
                    checkNull(setInsertion.matches[i].team2_picks[j].player_name, "Match " + (i+1) + " Team 2 Pick " + (j+1) + " Player Name");
                    checkNull(setInsertion.matches[i].team2_picks[j].position_played, "Match " + (i+1) + " Team 2 Pick " + (j+1) + " Stats Position Played");
                    // Optional Extra Stats (All Or Nothing)
                    const backupErrorCount2 = errorCount;
                    const backupErrorMsg2 = errorMsg;
                    checkNull(setInsertion.matches[i].team1_picks[j].kills, "Match " + (i+1) + " Team 1 Pick " + (j+1) + " Stats Kills");
                    checkNull(setInsertion.matches[i].team1_picks[j].assists, "Match " + (i+1) + " Team 1 Pick " + (j+1) + " Stats Assists");
                    checkNull(setInsertion.matches[i].team1_picks[j].scored, "Match " + (i+1) + " Team 1 Pick " + (j+1) + " Stats Scored");
                    checkNull(setInsertion.matches[i].team1_picks[j].dealt, "Match " + (i+1) + " Team 1 Pick " + (j+1) + " Stats Dealt");
                    checkNull(setInsertion.matches[i].team1_picks[j].taken, "Match " + (i+1) + " Team 1 Pick " + (j+1) + " Stats Taken");
                    checkNull(setInsertion.matches[i].team1_picks[j].healed, "Match " + (i+1) + " Team 1 Pick " + (j+1) + " Stats Healed");
                    // None of the stats were filled, so they probably weren't provided
                    if (errorCount-6 === backupErrorCount2) {
                        errorCount = backupErrorCount2;
                        errorMsg = backupErrorMsg2;
                        nullStats.push({match: i, pick: j, team: 1});
                    }
                    const backupErrorCount3 = errorCount;
                    const backupErrorMsg3 = errorMsg;
                    checkNull(setInsertion.matches[i].team2_picks[j].kills, "Match " + (i+1) + " Team 2 Pick " + (j+1) + " Stats Kills");
                    checkNull(setInsertion.matches[i].team2_picks[j].assists, "Match " + (i+1) + " Team 2 Pick " + (j+1) + " Stats Assists");
                    checkNull(setInsertion.matches[i].team2_picks[j].scored, "Match " + (i+1) + " Team 2 Pick " + (j+1) + " Stats Scored");
                    checkNull(setInsertion.matches[i].team2_picks[j].dealt, "Match " + (i+1) + " Team 2 Pick " + (j+1) + " Stats Dealt");
                    checkNull(setInsertion.matches[i].team2_picks[j].taken, "Match " + (i+1) + " Team 2 Pick " + (j+1) + " Stats Taken");
                    checkNull(setInsertion.matches[i].team2_picks[j].healed, "Match " + (i+1) + " Team 2 Pick " + (j+1) + " Stats Healed");
                    // None of the stats were filled, so they probably weren't provided
                    if (errorCount-6 === backupErrorCount3) {
                        errorCount = backupErrorCount3;
                        errorMsg = backupErrorMsg3;
                        nullStats.push({match: i, pick: j, team: 2});
                    }

                }
                if (errorCount-(10+(4*3)+(18*5)) === backupErrorCount) {
                    // Everything was null, so the match is not filled at all
                    errorCount = backupErrorCount;
                    errorMsg = backupErrorMsg;
                    nullMatches.push(i);
                }
            }

            // If both teams have equal wins, then the set is not filled
            if (setInsertion.set_score[0].wins === setInsertion.set_score[1].wins) {
                errorMsg += "\nNo Clear Winner (Equal Wins)";
                errorCount++;
            }

            // If something is missing, don't submit
            if (errorCount > 0) {
                alert(errorMsg);
                return;
            }

            // Submit the data
            insertSet(setInsertion, nullMatches, nullStats).then(data => {
                // Add set to the coreData with set_id added and null matches removed
                const newSetInsertion = {
                    ...setInsertion,
                    set_id: data.set_id,
                    matches: setInsertion.matches.filter((_, i) => !nullMatches.includes(i))
                };
                  
                setCoreData(prev => [...prev, newSetInsertion]);
                // Clear the set insertion data and the input fields
                setSetInsertion(null);
                resetAllForms();
            })
            .catch(error => {
                console.error(error);
                console.log(setInsertion);
                alert("Error submitting set. Please check console for submission data.");
                return;
            });
        }

        function eventCheck() {
            // Check for null values
            // Make sure the fields are consistent with the database
            checkNull(eventInsertion.event_name, "Event Name");
            checkNull(eventInsertion.event_date, "Event Date");
            // If there are no errors, submit the data
            if (errorCount === 0) {
                insertEvent(eventInsertion.event_name, eventInsertion.event_date).then(data => {
                    // Update the event data with the ID
                    const newEvent = {
                        event_id: data.id,
                        event_name: eventInsertion.event_name,
                        event_date: eventInsertion.event_date
                    }
                    // Put this new event in the events array
                    setEvents([...events, newEvent]);
                    // Clear the event insertion data and the input fields
                    setEventInsertion(null);
                    resetAllForms();
                });
            } else {
                alert(errorMsg);
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
                insertTeam(teamInsertion.team_name, teamInsertion.team_region).then(data => {
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
                alert(errorMsg);
                return;
            }
        }

        function playerCheck() {
            // Check for null values
            // Make sure the fields are consistent with the database
            checkNull(playerInsertion.player_name, "Player Name");
            // If there are no errors, submit the data
            if (errorCount === 0) {
                insertPlayer(playerInsertion.player_name).then(data => {
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
                alert(errorMsg);
                return;
            }
        }

        function checkNull(data, field, nonZero = false) {
            if (data === null || data === undefined || data === "") {
                // Add the field to the error message
                errorMsg += "\n" + field;
                errorCount++;
            }
            if (nonZero && data === 0) {
                // Add the field to the error message
                errorMsg += "\n" + field;
                errorCount++;
            }
        }
    }

    const resetAllForms = () => {
        setResetKey(prev => prev + 1);
    };

    // pdim = pro data insert modal
    return (
        <div id="pdim-container">
            <div className="pdim-header-type-select">
                <div 
                  className={`pdim-header-type-select-category ${creationState === 0 ? 'active' : ''}`}
                  onClick={() => setCreationState(0)}
                >Set</div>
                <div 
                  className={`pdim-header-type-select-category ${creationState === 1 ? 'active' : ''}`}
                  onClick={() => setCreationState(1)}
                >Event</div>
                <div 
                  className={`pdim-header-type-select-category ${creationState === 2 ? 'active' : ''}`}
                  onClick={() => setCreationState(2)}
                >Team</div>
                <div 
                  className={`pdim-header-type-select-category ${creationState === 3 ? 'active' : ''}`}
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
            <button id="pdim-submit-button" onClick={submitComp}>Submit</button>
            {/* Add Reset Button */}
            <button id="pdim-reset-button" onClick={resetAllForms}>Reset</button>
        </div>
    );
}

// The full insertion form for a set
function SetInsertion({ resetKey, setSetInsertion, events, teams, players, charactersAndMoves }) {
    /* set_id, and match_ids will be calculated when and after submitting */
    const [composedSet, setComposedSet] = useState({event_date: null, event_id: null, event_name: null, matches: null, set_descriptor: null, set_id: null, set_score: null, set_winner: null});
    const [match1, setMatch1] = useState({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null});
    const [match2, setMatch2] = useState({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null});
    const [match3, setMatch3] = useState({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null});
    const [match4, setMatch4] = useState({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null});
    const [match5, setMatch5] = useState({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null});
    const [selectedEvent, setSelectedEvent] = useState({event_id: null, event_name: null, event_date: null});
    const [setDescriptor, setSetDescriptor] = useState("");
    const fpBans = [1, 3, 5];
    const spBans = [2, 4, 6];
    const fpPicks = [1, 4, 5, 8, 9];
    const spPicks = [2, 3, 6, 7, 10];

    const resetForm = () => {
        setMatch1({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null, match_vod_url: null});
        setMatch2({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null, match_vod_url: null});
        setMatch3({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null, match_vod_url: null});
        setMatch4({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null, match_vod_url: null});
        setMatch5({match_id: null, match_winner_id: null, match_winner_text: null, firstPick: 0, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null, match_vod_url: null});
        setSelectedEvent({event_id: null, event_name: null, event_date: null});
        setSetDescriptor("");
    };

    useEffect(() => {
        const matches = [match1, match2, match3, match4, match5];
    
        const baseSet = selectedEvent
            ? {
                  event_date: selectedEvent.event_date,
                  event_id: selectedEvent.event_id,
                  event_name: selectedEvent.event_name,
              }
            : {
                  event_date: null,
                  event_id: null,
                  event_name: null,
              };
    
        // set_score, set_winner need to be calculated
        const team1 = { team_id: matches[0]?.team1_id, team_name: matches[0]?.team1_name };
        const team2 = { team_id: matches[0]?.team2_id, team_name: matches[0]?.team2_name };
    
        const team1Count = matches.filter(match => match?.match_winner_id === team1.team_id).length;
        const team2Count = matches.filter(match => match?.match_winner_id === team2.team_id).length;
    
        setComposedSet({
            ...baseSet,
            matches,
            set_descriptor: setDescriptor,
            set_id: null,
            set_score: [
                { ...team1, wins: team1Count },
                { ...team2, wins: team2Count },
            ],
            set_winner: team1Count > team2Count ? team1 : team2,
        });
    }, [match1, match2, match3, match4, match5, selectedEvent, setDescriptor]);
    

    useEffect(() => {
        resetForm();
    }, []);

    useEffect(() => {
        resetForm();
    }, [resetKey]);

    useEffect(() => {
        setSetInsertion(composedSet);
    }, [composedSet]);

    useEffect(() => {
        setComposedSet({...composedSet, set_descriptor: setDescriptor});
    }, [setDescriptor]);

    useEffect(() => {
        const updateMatch = (match, fp) => {
          if (!match?.team1_picks?.length || !match?.team2_picks?.length) return match;
      
          const newMatch = {
            ...match,
            team1_picks: match.team1_picks.map((pick, j) => ({
              ...pick,
              pick_position:
                fp === 1 ? fpPicks[j] :
                fp === 2 ? spPicks[j] :
                j + 1 
            })),
            team2_picks: match.team2_picks.map((pick, j) => ({
              ...pick,
              pick_position:
                fp === 1 ? spPicks[j] :
                fp === 2 ? fpPicks[j] :
                j + 1
            })),    
            team1_bans: match.team1_bans.map((ban, j) => ({
              ...ban,
              ban_position:
                fp === 1 ? fpBans[j] :
                fp === 2 ? spBans[j] :
                j + 1
            })),
            team2_bans: match.team2_bans.map((ban, j) => ({
              ...ban,
              ban_position:
                fp === 1 ? spBans[j] :
                fp === 2 ? fpBans[j] :
                j + 1
            }))
          };
      
          return newMatch;
        };
      
        setMatch1(prev => updateMatch(prev, prev.firstPick));
        setMatch2(prev => updateMatch(prev, prev.firstPick));
        setMatch3(prev => updateMatch(prev, prev.firstPick));
        setMatch4(prev => updateMatch(prev, prev.firstPick));
        setMatch5(prev => updateMatch(prev, prev.firstPick));
    }, [match1.firstPick, match2.firstPick, match3.firstPick, match4.firstPick, match5.firstPick]);
      
    return (
        <div className="pdim-creation-forms">
            <div className="pdim-event-data-container">
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
            </div>
            {/* Set Descriptor (Text Input) */}
            <input type="text" value={setDescriptor} placeholder="Set Descriptor (EX: Losers Finals)" onChange={(e) => setSetDescriptor(e.target.value)} />
            <div className="pdim-match-data-card">
                <MatchInsertion resetKey={resetKey} match={match1} setMatch={setMatch1} teams={teams} players={players} charactersAndMoves={charactersAndMoves} matchNumber={1}/>
            </div>
            <div className="pdim-match-data-card">
                <MatchInsertion resetKey={resetKey} match={match2} setMatch={setMatch2} teams={teams} players={players} charactersAndMoves={charactersAndMoves} matchNumber={2}/>
            </div>
            <div className="pdim-match-data-card">
                <MatchInsertion resetKey={resetKey} match={match3} setMatch={setMatch3} teams={teams} players={players} charactersAndMoves={charactersAndMoves} matchNumber={3}/>
            </div>
            <div className="pdim-match-data-card">
                <MatchInsertion resetKey={resetKey} match={match4} setMatch={setMatch4} teams={teams} players={players} charactersAndMoves={charactersAndMoves} matchNumber={4}/>
            </div>
            <div className="pdim-match-data-card">
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
        <div className="pdim-match-data-container">
            <h3>Match {matchNumber}</h3>
            <div className="pdim-comp-card">
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
            {/* Match VOD URL */}
            <input type="text" value={match.match_vod_url ? match.match_vod_url : ""} placeholder="Match VOD URL" onChange={(e) => setMatch({...match, match_vod_url: e.target.value})} />
            {/* Match Winner Dropdown */}
            <div className="pdim-match-winner-dropdown">
            <select
                value={
                match.match_winner_id
                    ? JSON.stringify({
                        team_id: match.match_winner_id,
                        team_name: match.match_winner_text,
                    })
                    : ""
                }
                onChange={(e) => {
                if (!e.target.value) {
                    setMatch({ ...match, match_winner_id: "", match_winner_text: "" });
                    return;
                }
                const team = JSON.parse(e.target.value);
                setMatch({
                    ...match,
                    match_winner_id: team.team_id,
                    match_winner_text: team.team_name,
                });
                }}
            >
                <option value="">Winner Select</option>
                <option value={JSON.stringify(pickedTeams.team1)}>
                {pickedTeams.team1.team_name}
                </option>
                <option value={JSON.stringify(pickedTeams.team2)}>
                {pickedTeams.team2.team_name}
                </option>
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
        setMatch(prev => ({
          ...prev,
          [compNumber === 1 ? "team1_bans" : "team2_bans"]: bans,
          [compNumber === 1 ? "team1_picks" : "team2_picks"]: picks
        }));
    }, [bans, picks, compNumber, setMatch]);

    useEffect(() => {
        if ((firstPickSelected === 2 && compNumber === 1) || (firstPickSelected === 3 && compNumber === 2)) {
            setBans(prevBans => [{...prevBans[0], ban_position: 1}, {...prevBans[1], ban_position: 3}, {...prevBans[2], ban_position: 5}]);
            setPicks(prevPicks => [{...prevPicks[0], pick_position: 1}, {...prevPicks[1], pick_position: 4}, {...prevPicks[2], pick_position: 5}, {...prevPicks[3], pick_position: 8}, {...prevPicks[4], pick_position: 9}]);
        } else if ((firstPickSelected === 3 && compNumber === 1) || (firstPickSelected === 2 && compNumber === 2)) {
            setBans(prevBans => [{...prevBans[0], ban_position: 2}, {...prevBans[1], ban_position: 4}, {...prevBans[2], ban_position: 6}]);
            setPicks(prevPicks => [{...prevPicks[0], pick_position: 2}, {...prevPicks[1], pick_position: 3}, {...prevPicks[2], pick_position: 6}, {...prevPicks[3], pick_position: 7}, {...prevPicks[4], pick_position: 10}]);
        } else {
            setBans(prevBans => [{...prevBans[0], ban_position: 1}, {...prevBans[1], ban_position: 2}, {...prevBans[2], ban_position: 3}]);
            setPicks(prevPicks => [{...prevPicks[0], pick_position: 1}, {...prevPicks[1], pick_position: 2}, {...prevPicks[2], pick_position: 3}, {...prevPicks[3], pick_position: 4}, {...prevPicks[4], pick_position: 5}]);
        }
    }, [firstPickSelected]);

    return (
        <div className="pdim-comp-data-container">
            <div className="pdim-comp-team-data-container">
                {/* Team Name Dropdown */}
                <select
                value={compNumber === 1 
                    ? JSON.stringify({ team_id: match.team1_id, team_name: match.team1_name, team_region: match.team1_region }) 
                    : JSON.stringify({ team_id: match.team2_id, team_name: match.team2_name, team_region: match.team2_region })
                }
                onChange={(e) => {
                    const team = JSON.parse(e.target.value);
                    setMatch({
                    ...match,
                    [compNumber === 1 ? "team1_id" : "team2_id"]: team.team_id,
                    [compNumber === 1 ? "team1_name" : "team2_name"]: team.team_name,
                    [compNumber === 1 ? "team1_region" : "team2_region"]: team.team_region,
                    });
                }}
                >
                <option value="">Select Team</option>
                {teams.map(team => (
                    <option 
                    key={team.team_id} 
                    value={JSON.stringify(team)}
                    >
                    {team.team_name}
                    </option>
                ))}
                </select>
                {/* Team Region (Read-only) */}
                <div className="pdim-comp-team-region-display">
                    <input 
                    type="text" 
                    value={compNumber === 1 ? (match.team1_region ? match.team1_region : "") : (match.team2_region ? match.team2_region : "")} 
                    readOnly 
                    placeholder="Team Region (Choose Team)"
                    />
                </div>
                
                {/* First Pick Checkbox */}
                <div className="pdim-comp-first-pick-checkbox-container">   
                    <label>
                        First Pick:
                    </label>
                    <input 
                        type="checkbox" 
                        checked={(firstPickSelected === 2 && compNumber === 1) || (firstPickSelected === 3 && compNumber === 2)} 
                        disabled={(firstPickSelected !== 1 && (firstPickSelected === 2 && compNumber === 2)) || (firstPickSelected !== 1 && (firstPickSelected === 3 && compNumber === 1))}
                        onChange={(e) => { 
                            if (e.target.checked) {
                                setFirstPickSelected(compNumber === 1 ? 2 : 3);
                            } else {
                                setFirstPickSelected(1); // Unselects first pick
                            }
                        }} 
                    />
                </div>
            </div>
            <div className="pdim-comp-team-bans-container">
                {/* Bans Dropdowns */}
                {[0, 1, 2].map((banPosition) => (
                    <CustomDropdown
                        key={banPosition}
                        value={ {pokemon_id: bans[banPosition]?.pokemon_id ?? "", pokemon_name: bans[banPosition]?.pokemon_name ?? ""} }
                        onChange={value => {
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
                        options={[{ pokemon_id: 0, pokemon_name: "None" }, ...filteredUniquePokemon]}
                        placeholder={`Ban ${banPosition} Select`}
                        disabled={false}
                        path="/assets/Draft/headshots"
                    />
                ))}
            </div>
            <div className="pdim-comp-team-picks-container">
                {/* Pokemon / Players */}
                {[0, 1, 2, 3, 4].map((pickNumber) => (
                    <Pick 
                        key={pickNumber}
                        character={ {pokemon_id: picks[pickNumber]?.pokemon_id ?? "", pokemon_name: picks[pickNumber]?.pokemon_name ?? ""} } 
                        move1={ {move_id: picks[pickNumber]?.move_1_id ?? "", move_name: picks[pickNumber]?.move_1_name} }
                        move2={ {move_id: picks[pickNumber]?.move_2_id ?? "", move_name: picks[pickNumber]?.move_2_name ?? ""} }
                        player={ {player_id: picks[pickNumber]?.player_id ?? "", player_name: picks[pickNumber]?.player_name ?? "", player_other_names: picks[pickNumber]?.player_other_names ?? ""} } 
                        stats={{
                            assists: picks[pickNumber]?.assists ?? "",
                            dealt: picks[pickNumber]?.dealt ?? "",
                            kills: picks[pickNumber]?.kills ?? "",
                            healed: picks[pickNumber]?.healed ?? "",
                            scored: picks[pickNumber]?.scored ?? "",
                            taken: picks[pickNumber]?.taken ?? "",
                            position_played: picks[pickNumber]?.position_played ?? ""
                        }}
                        setCharacter={value => {
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
                        setMove1={value => {
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
                        setMove2={value => {
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
                        setPlayer={value => {
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
                        setStats={(value, stat) => {
                            setPicks(prevPicks => {
                                const newPicks = [...prevPicks];
                                newPicks[pickNumber] = {
                                    ...newPicks[pickNumber],
                                    [stat]: value
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
function Pick({ character, move1, move2, player, stats, setCharacter, setMove1, setMove2, setPlayer, setStats, charactersAndMoves, players, unavailableCharacters }) {
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
        <div className="pdim-pick-data-container">
            <div className="pdim-pick-necessary-data-row">
                {/* Character Dropdown */}
                <div className="pdim-pick-pokemon-select-container">
                    <CustomDropdown
                        value={character}
                        onChange={(value) => {
                            setCharacter(value);
                            setMove1({ move_id: "", move_name: "" });
                            setMove2({ move_id: "", move_name: "" });
                        }}
                        options={filteredUniquePokemon}
                        placeholder="Character Select"
                        path="/assets/Draft/headshots"
                    />
                </div>
                {/* Move 1 Dropdown */}
                <div className="pdim-pick-move-select-container">
                    <CustomDropdown
                        value={move1}
                        onChange={setMove1}
                        options={availableMoves}
                        placeholder="Move 1 Select"
                        disabled={character?.pokemon_name === ""}   
                        path="/assets/Draft/moves"
                        character_name={character ? character.pokemon_name : null}  
                    />
                </div>
                {/* Move 2 Dropdown */}
                <div className="pdim-pick-move-select-container">
                    <CustomDropdown
                    value={move2}
                    onChange={setMove2}
                    options={availableMoves}
                    placeholder="Move 2 Select"
                    disabled={character?.pokemon_name === ""}   
                    path="/assets/Draft/moves"
                    character_name={character ? character.pokemon_name : null}  
                    />
                </div>
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
            <div className="pdim-pick-extra-data-row">
                <input className="pdim-pick-stat-input" type="text" placeholder="kills" value={stats.kills ?? ""} onChange={(e) => setStats(e.target.value ? Number(e.target.value) : null, "kills")}></input>
                <input className="pdim-pick-stat-input" type="text" placeholder="assists" value={stats.assists ?? ""} onChange={(e) => setStats(e.target.value ? Number(e.target.value) : null, "assists")}></input>
                <input className="pdim-pick-stat-input" type="text" placeholder="scored" value={stats.scored ?? ""} onChange={(e) => setStats(e.target.value ? Number(e.target.value) : null, "scored")}></input>
                <input className="pdim-pick-stat-input" type="text" placeholder="dealt" value={stats.dealt ?? ""} onChange={(e) => setStats(e.target.value ? Number(e.target.value) : null, "dealt")}></input>
                <input className="pdim-pick-stat-input" type="text" placeholder="taken" value={stats.taken ?? ""} onChange={(e) => setStats(e.target.value ? Number(e.target.value) : null, "taken")}></input>
                <input className="pdim-pick-stat-input" type="text" placeholder="healed" value={stats.healed ?? ""} onChange={(e) => setStats(e.target.value ? Number(e.target.value) : null, "healed")}></input>
                <select className="pdim-pick-stat-input" value={stats.position_played ?? ""} onChange={(e) => setStats(e.target.value, "position_played")}>
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

    const resetForm = () => {
        setEventName(null);
        setEventDate(null);
    };

    useEffect(() => {
        setEventInsertion({event_name: eventName, event_date: eventDate});
    }, [eventName, eventDate]);

    useEffect(() => {
        resetForm();
    }, []);

    useEffect(() => {
        resetForm();
    }, [resetKey]);

    return (
        <div className="pdim-creation-forms">
            {/* Event Name */}
            <input type="text" value={eventName ? eventName : ""} placeholder="Event Name" onChange={(e) => setEventName(e.target.value)} />
            {/* Event Date */}
            <input type="date" value={eventDate ? eventDate : ""} placeholder="Event Date" onChange={(e) => setEventDate(e.target.value)} />
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
        <div className="pdim-creation-forms">
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
        <div className="pdim-creation-forms">
            {/* Player Name */}
            <input type="text" value={playerName ? playerName : ""} placeholder="Player Name" onChange={(e) => setPlayerName(e.target.value)} />
        </div>
    );
}

export default ProDataInsertModal;
