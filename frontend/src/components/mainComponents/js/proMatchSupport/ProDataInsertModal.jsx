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
            if (e.target.id === 'pro-matches-open-pro-data-insert-form' || 
                e.target.closest('#pdim-container') ||
                e.target.closest('.custom-dropdown-dropdown-options') ||
                e.target.closest('.pdim-match-unite-api-parse-screen-cover')) return;
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
            <div className="pdim-header-container">
                <button className="pdim-header-button" id="pdim-submit-button" onClick={submitComp}>Submit</button>
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
                <button className="pdim-header-button" id="pdim-reset-button" onClick={resetAllForms}>Reset</button>
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
      
    // Create a dictionary mapping pokemon_name to an array of their moves
    const pokemonToMoves = charactersAndMoves.reduce((acc, char) => {
        if (!acc[char.pokemon_name]) {
            acc[char.pokemon_name] = [];
        }
        acc[char.pokemon_name].push({ move_name: char.move_name, move_id: char.move_id });
        return acc;
    }, {});

    // Sort the moves in each array by move_id
    Object.keys(pokemonToMoves).forEach(pokemon => {
        pokemonToMoves[pokemon].sort((a, b) => a.move_id - b.move_id);
    });

    // Get unique pokemon_name and pokemon_id combinations
    const uniquePokemon = [...new Set(charactersAndMoves.map(char => JSON.stringify({pokemon_name: char.pokemon_name, pokemon_id: char.pokemon_id})))].map(str => JSON.parse(str));

    return (
        <div className="pdim-creation-forms">
            <div className="pdim-event-data-container">
                {/* Event Name Dropdown */}
                <select id='pdim-event-name-dropdown' value={selectedEvent && selectedEvent.event_name ? selectedEvent.event_name : ""} onChange={(e) => {
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
                    id='pdim-event-date-input'
                    type="text" 
                    value={selectedEvent && selectedEvent.event_date ? selectedEvent.event_date : ""} 
                    readOnly 
                    placeholder="Event Date (Choose Event)"
                />
                {/* Information Button */}
                <button id='pdim-event-information-button' className="pdim-information-button" onClick={() => alert("Disable McAffee Web Advisor for best performance. It can prevent input interactions for up to 10 seconds. :/")}>i</button>
            </div>
            {/* Set Descriptor (Text Input) */}
            <input id='pdim-set-descriptor-input' type="text" value={setDescriptor} placeholder="Set Descriptor (EX: Losers Finals)" onChange={(e) => setSetDescriptor(e.target.value)} />
            <MatchInsertion resetKey={resetKey} match={match1} setMatch={setMatch1} teams={teams} players={players} matchNumber={1} uniquePokemon={uniquePokemon} pokemonToMoves={pokemonToMoves}/>
            <MatchInsertion resetKey={resetKey} match={match2} setMatch={setMatch2} teams={teams} players={players} matchNumber={2} uniquePokemon={uniquePokemon} pokemonToMoves={pokemonToMoves}/>
            <MatchInsertion resetKey={resetKey} match={match3} setMatch={setMatch3} teams={teams} players={players} matchNumber={3} uniquePokemon={uniquePokemon} pokemonToMoves={pokemonToMoves}/>
            <MatchInsertion resetKey={resetKey} match={match4} setMatch={setMatch4} teams={teams} players={players} matchNumber={4} uniquePokemon={uniquePokemon} pokemonToMoves={pokemonToMoves}/>
            <MatchInsertion resetKey={resetKey} match={match5} setMatch={setMatch5} teams={teams} players={players} matchNumber={5} uniquePokemon={uniquePokemon} pokemonToMoves={pokemonToMoves}/>
        </div>
    );
}

// Match insertion form for a set (Used in SetInsertion)
    function MatchInsertion({ resetKey, match, setMatch, teams, players, matchNumber, uniquePokemon, pokemonToMoves }) {
    // {match_id: null, match_winner_id: null, match_winner_text: null, team1_bans: [], team1_id: null, team1_name: null, team1_picks: [], team1_region: null, team2_bans: [], team2_id: null, team2_name: null, team2_picks: [], team2_region: null}
    // Just used in this and lower components. Not sent up components to database
    const [unavailableCharacters, setUnavailableCharacters] = useState([]);
    const [firstPickSelected, setFirstPickSelected] = useState(1); // 1 is unselected, 2 is team 1 is fp, 3 is team 2 is fp (For CompInsertion To Know Pick Positions / Ban Positions)
    const [pickedTeams, setPickedTeams] = useState({team1: match.team1_id ? {team_id: match.team1_id, team_name: match.team1_name} : {team_id: null, team_name: "Team 1"}, team2: match.team2_id ? {team_id: match.team2_id, team_name: match.team2_name} : {team_id: null, team_name: "Team 2"}});
    const [uniteAPIParseOpen, setUniteAPIParseOpen] = useState(false);

    // Filter out unavailable characters
    const filteredUniquePokemon = uniquePokemon.filter(char => 
        !unavailableCharacters.includes(char.pokemon_id) || !unavailableCharacters.some(id => id !== null && id !== undefined)
    );
    
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

    function checkIfAllPokemonPicked() {
        if (match.team1_picks.length === 5 && match.team2_picks.length === 5) {
            if (match.team1_picks.every(pick => pick?.pokemon_id !== null && pick?.pokemon_id !== undefined) && match.team2_picks.every(pick => pick?.pokemon_id !== null && pick?.pokemon_id !== undefined)) {
                return true;
            }
        }
        return false;
    }

    function parseUniteAPI(matchNumber) {
        const input = document.getElementById(`pdim-match-${matchNumber}-unite-api-parse-input`).value;
        const parser = new DOMParser();
        const doc = parser.parseFromString(input, "text/html");
    
        const rows = doc.querySelectorAll("tr");
        const trArray = Array.from(rows).map(tr => tr.outerHTML);
    
        const results = [];
    
        trArray.forEach((tr, index) => {
            if (index === 0 || index === 6) return; // skip header or unwanted rows
    
            const trDoc = parser.parseFromString(tr, "text/html"); // parse row separately
    
            // 1. Pokemon Name (from image src)
            const img = trDoc.querySelector("img[src*='Ft_Square_']");
            const pokemonName = img ? img.src.split("Ft_Square_")[1].split(".png")[0] : null;
            // Special Case Pokemon Names
            // Urshifu_RS or Urshifu_SS will always show up as Urshifu_Rapid. Look if move1 is "Surging Strikes" or "Wicked Blow" for if it's RS or SS respectively.
            // Galarian_Rapidash will always be Rapidash
            // Alolan_Ninetales and Alolan_Raichu will be Ninetales and Raichu
            // Mewtwo_X and Mewtwo_Y will be MewtwoX and MewtwoY
            // Scizor and Scyther will always be "Scizor" need to look if it has move "Dual Wingbeat" or "Bullet Punch" for Scyther / Scizor respectively

            // 2. Move 1 Name
            const move1Img = trDoc.querySelector('img[alt="Pokemon ability 1"]');
            let move_1 = move1Img ? move1Img.getAttribute("title") : null;
            if (move_1) move_1 = move_1.replace(/\+$/, ""); // remove trailing +
    
            // 3. Move 2 Name
            const move2Img = trDoc.querySelector('img[alt="Pokemon ability 2"]');
            let move_2 = move2Img ? move2Img.getAttribute("title") : null;
            if (move_2) move_2 = move_2.replace(/\+$/, "");

            // Adjust Pokemon Name for special cases now that we have moves

            let normalizedName = pokemonName;

            // Special cases
            if (normalizedName) {
                switch (normalizedName) {
                    case "Urshifu_Rapid":
                        // Determine RS or SS by move1
                        if (move_1 === "Surging Strikes" || move_1 === "Liquidation") normalizedName = "Urshifu_RS";
                        else if (move_1 === "Wicked Blow" || move_1 === "Throat Chop") normalizedName = "Urshifu_SS";
                        break;
                    case "Rapidash":
                        normalizedName = "Galarian_Rapidash";
                        break;
                    case "Ninetales":
                        normalizedName = "Alolan_Ninetales";
                        break;
                    case "Raichu":
                        normalizedName = "Alolan_Raichu";
                        break;
                    case "MewtwoX":
                        normalizedName = "Mewtwo_X";
                        break;
                    case "MewtwoY":
                        normalizedName = "Mewtwo_Y";
                        break;
                    case "Scizor":
                    case "Scyther":
                        // Determine if it's Scyther or Scizor by move1
                        if (move_1 === "Dual Wingbeat" || move_2 === "Dual Wingbeat") normalizedName = "Scyther";
                        else if (move_1 === "Bullet Punch" || move_2 === "Bullet Punch") normalizedName = "Scizor";
                        break;
                }
            }
    
            // 4. Stats (from <p class="sc-6d6ea15e-3 hxGuyl">)
            const stats = trDoc.querySelectorAll("p.sc-6d6ea15e-3.hxGuyl");
            // stats[0] has player name but it will be hard to autopopulate player name and it is quick to enter manually
            const scored = stats[1] ? stats[1].textContent.trim() : null;
    
            const killsAssistsText = stats[2] ? stats[2].textContent.trim() : "";
            const [kills, assists] = killsAssistsText.split("|").map(s => s.trim());
    
            const damage_dealt = stats[3] ? stats[3].textContent.trim() : null;
            const damage_taken = stats[4] ? stats[4].textContent.trim() : null;
            const damage_healed = stats[5] ? stats[5].textContent.trim() : null;
    
            results.push({
                normalizedName,
                move_1,
                move_2,
                scored,
                kills,
                assists,
                damage_dealt,
                damage_taken,
                damage_healed
            });
        });
    
        // Now put results data into picks by matching pokemonName
        let matchCopy = { ...match }; // shallow copy
        matchCopy.team1_picks.forEach((pick) => {
            // Find the Pokémon in results array
            const pickData = results.find(p => p.normalizedName === pick.pokemon_name);
            if (!pickData) return; // skip if no data found

            const pickMoves = pokemonToMoves[pick.pokemon_name] || [];

            let move1 = pickMoves.find(m => m.move_name === pickData.move_1) || null
            let move2 = pickMoves.find(m => m.move_name === pickData.move_2) || null

            if (move1?.move_id > move2?.move_id) {
                const temp = move1;
                move1 = move2;
                move2 = temp;
            }

            pick.move_1_id = move1 ? move1.move_id : "";
            pick.move_1_name = move1 ? move1.move_name : "";
            pick.move_2_id = move2 ? move2.move_id : "";
            pick.move_2_name = move2 ? move2.move_name : "";

            pick.kills = pickData.kills;
            pick.assists = pickData.assists;
            pick.scored = pickData.scored;
            pick.dealt = pickData.damage_dealt;
            pick.taken = pickData.damage_taken;
            pick.healed = pickData.damage_healed;
        });
        matchCopy.team2_picks.forEach((pick) => {
            // Find the Pokémon in results array
            const pickData = results.find(p => p.normalizedName === pick.pokemon_name);
            if (!pickData) return; // skip if no data found

            const pickMoves = pokemonToMoves[pick.pokemon_name] || [];

            let move1 = pickMoves.find(m => m.move_name === pickData.move_1) || null
            let move2 = pickMoves.find(m => m.move_name === pickData.move_2) || null

            if (move1?.move_id > move2?.move_id) {
                const temp = move1;
                move1 = move2;
                move2 = temp;
            }

            pick.move_1_id = move1 ? move1.move_id : "";
            pick.move_1_name = move1 ? move1.move_name : "";
            pick.move_2_id = move2 ? move2.move_id : "";
            pick.move_2_name = move2 ? move2.move_name : "";

            pick.kills = pickData.kills;
            pick.assists = pickData.assists;
            pick.scored = pickData.scored;
            pick.dealt = pickData.damage_dealt;
            pick.taken = pickData.damage_taken;
            pick.healed = pickData.damage_healed;
        });

        setMatch(matchCopy);

        setUniteAPIParseOpen(false);
    }    

    return (
        <div className="pdim-match-data-container">
            <div className="pdim-match-data-input-container">
                <h3>Match {matchNumber}</h3>
                {/* Match VOD URL */}
                <input id={`pdim-match-${matchNumber}-vod-url-input`} type="text" value={match.match_vod_url ? match.match_vod_url : ""} placeholder="Match VOD URL" onChange={(e) => setMatch({...match, match_vod_url: e.target.value})} />
                {/* Match Winner Dropdown */}
                <div className="pdim-match-winner-dropdown">
                    <select
                        id={`pdim-match-${matchNumber}-winner-dropdown`}
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
                <button id={`pdim-match-${matchNumber}-unite-api-information-parse`} className={`pdim-match-unite-api-parse-open-button ${checkIfAllPokemonPicked() ? "" : "disabled"}`} title="Parse Match From Unite API (All Picks Must Be Filled)" onClick={() => {setUniteAPIParseOpen(true)}}>+</button>
            </div>
            {[1, 2].map((compNumber) => (
                <CompInsertion 
                    key={compNumber}
                    resetKey={resetKey}
                    match={match}
                    setMatch={setMatch} 
                    teams={teams} 
                    players={players} 
                    availablePokemon={filteredUniquePokemon}
                    pokemonToMoves={pokemonToMoves}
                    firstPickSelected={firstPickSelected}
                    setFirstPickSelected={setFirstPickSelected}
                    compNumber={compNumber}
                    matchNumber={matchNumber}
                />
            ))}
            {uniteAPIParseOpen && (
                <div className="pdim-match-unite-api-parse-screen-cover" onClick={() => setUniteAPIParseOpen(false)}>
                    <div className="pdim-match-unite-api-parse-container" onClick={(e) => e.stopPropagation()}>
                        <div className="pdim-match-unite-api-parse-header">
                            <h3>Unite API Parser</h3>
                            <button id={`pdim-match-${matchNumber}-unite-api-parse-close`} className="pdim-match-unite-api-parse-close-button" onClick={() => setUniteAPIParseOpen(false)}>X</button>
                            <button id={`pdim-match-${matchNumber}-unite-api-parse-information`} className="pdim-information-button pdim-match-unite-api-parse-information-button" onClick={() => alert("Right click on expanded dropdown on UniteAPI > Inspect > Elements > Copy Element (ON WHOLE TABLE OR DIV)")}>i</button>
                        </div>
                        <textarea id={`pdim-match-${matchNumber}-unite-api-parse-input`} className="pdim-match-unite-api-parse-input" placeholder="Paste Match From Unite API"></textarea>
                        <button id={`pdim-match-${matchNumber}-unite-api-parse-submit`} className="pdim-match-unite-api-parse-submit-button" onClick={() => {parseUniteAPI(matchNumber)}}>Parse</button>
                    </div>
                </div>
            )}
        </div>
    )
}

// Comp insertion form for a match (Used in SetInsertion)
function CompInsertion({ resetKey, match, setMatch, teams, players, availablePokemon, pokemonToMoves, firstPickSelected, setFirstPickSelected, compNumber, matchNumber }) {
    const [bans, setBans] = useState([{ban_position: 1}, {ban_position: 2}, {ban_position: 3}]);
    const [picks, setPicks] = useState([{pick_position: 1}, {pick_position: 2}, {pick_position: 3}, {pick_position: 4}, {pick_position: 5}]);

    useEffect(() => {
        setBans([{ban_position: 1}, {ban_position: 2}, {ban_position: 3}]);
        setPicks([{pick_position: 1}, {pick_position: 2}, {pick_position: 3}, {pick_position: 4}, {pick_position: 5}]);
    }, [resetKey]);

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
                    id={`pdim-match-${matchNumber}-comp-${compNumber}-team-dropdown`}
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
                    id={`pdim-match-${matchNumber}-comp-${compNumber}-region-display`}
                    type="text" 
                    value={compNumber === 1 ? (match.team1_region ? match.team1_region : "") : (match.team2_region ? match.team2_region : "")} 
                    readOnly 
                    placeholder="Team Region (Choose Team)"
                    />
                </div>
                
                {/* First Pick Checkbox */}
                <div className="pdim-comp-first-pick-checkbox-container">   
                    <label htmlFor={`pdim-match-${matchNumber}-comp-${compNumber}-first-pick-checkbox`}>
                        First Pick:
                    </label>
                    <input 
                        id={`pdim-match-${matchNumber}-comp-${compNumber}-first-pick-checkbox`}
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
                        id={`pdim-match-${matchNumber}-comp-${compNumber}-ban-${banPosition}-dropdown`}
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
                        options={[{ pokemon_id: 0, pokemon_name: "None" }, ...availablePokemon]}
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
                        move1={ {move_id: picks[pickNumber]?.move_1_id ?? "", move_name: picks[pickNumber]?.move_1_name ?? ""} }
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
                        availablePokemon={availablePokemon}
                        pokemonToMoves={pokemonToMoves}
                        players={players}
                        pickNumber={pickNumber}
                        matchNumber={matchNumber}
                        compNumber={compNumber}
                    />
                ))}
            </div>
        </div>
    )
}

// Character and player insertion form for a comp (Used in SetInsertion)
function Pick({ character, move1, move2, player, stats, setCharacter, setMove1, setMove2, setPlayer, setStats, availablePokemon, pokemonToMoves, players, pickNumber, matchNumber, compNumber }) {
    // Get available moves for the selected character
    const availableMoves = character ? pokemonToMoves[character.pokemon_name] : [];

    return (
        <div className="pdim-pick-data-container">
            <div className="pdim-pick-necessary-data-row">
                {/* Character Dropdown */}
                <div className="pdim-pick-pokemon-select-container">
                    <CustomDropdown
                        value={character}
                        id={`pdim-match-${matchNumber}-comp-${compNumber}-pick-${pickNumber}-pokemon-dropdown`}
                        onChange={(value) => {
                            setCharacter(value);
                            setMove1({ move_id: "", move_name: "" });
                            setMove2({ move_id: "", move_name: "" });
                        }}
                        options={availablePokemon}
                        placeholder={`Character ${pickNumber + 1} Select`}
                        path="/assets/Draft/headshots"
                    />
                </div>
                {/* Move 1 Dropdown */}
                <div className="pdim-pick-move-select-container">
                    <CustomDropdown
                        value={move1}
                        id={`pdim-match-${matchNumber}-comp-${compNumber}-pick-${pickNumber}-move-1-dropdown`}
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
                    id={`pdim-match-${matchNumber}-comp-${compNumber}-pick-${pickNumber}-move-2-dropdown`}
                    onChange={setMove2}
                    options={availableMoves}
                    placeholder="Move 2 Select"
                    disabled={character?.pokemon_name === ""}   
                    path="/assets/Draft/moves"
                    character_name={character ? character.pokemon_name : null}  
                    />
                </div>
                {/* Player Dropdown */}
                <select id={`pdim-match-${matchNumber}-comp-${compNumber}-pick-${pickNumber}-player-dropdown`} value={player ? JSON.stringify(player) : ""} onChange={(e) => setPlayer(JSON.parse(e.target.value))}>
                    <option value="">Player Select</option>
                    {players.map(player => (
                        <option key={player.player_id} value={JSON.stringify({player_id: player.player_id, player_name: player.player_name})}>
                            {player.player_name}
                        </option>
                    ))}
                </select>
                {/* Position Dropdown */}
                <select id={`pdim-match-${matchNumber}-comp-${compNumber}-pick-${pickNumber}-position-dropdown`} className="pdim-pick-stat-input" value={stats.position_played ?? ""} onChange={(e) => setStats(e.target.value, "position_played")}>
                    <option value="">Role</option>
                    <option value="TopCarry">Top Carry</option>
                    <option value="EXPShareTop">Top EXP Share</option>
                    <option value="JungleCarry">Jungle Carry</option>
                    <option value="BottomCarry">Bot Carry</option>
                    <option value="EXPShareBot">Bot EXP Share</option>
                </select>
            </div>
            <div className="pdim-pick-extra-data-row">
                <input id={`pdim-match-${matchNumber}-comp-${compNumber}-pick-${pickNumber}-kills-input`} className="pdim-pick-stat-input" type="text" placeholder="kills" value={stats.kills ?? ""} onChange={(e) => setStats(e.target.value ? Number(e.target.value) : null, "kills")}></input>
                <input id={`pdim-match-${matchNumber}-comp-${compNumber}-pick-${pickNumber}-assists-input`} className="pdim-pick-stat-input" type="text" placeholder="assists" value={stats.assists ?? ""} onChange={(e) => setStats(e.target.value ? Number(e.target.value) : null, "assists")}></input>
                <input id={`pdim-match-${matchNumber}-comp-${compNumber}-pick-${pickNumber}-scored-input`} className="pdim-pick-stat-input" type="text" placeholder="scored" value={stats.scored ?? ""} onChange={(e) => setStats(e.target.value ? Number(e.target.value) : null, "scored")}></input>
                <input id={`pdim-match-${matchNumber}-comp-${compNumber}-pick-${pickNumber}-dealt-input`} className="pdim-pick-stat-input" type="text" placeholder="dealt" value={stats.dealt ?? ""} onChange={(e) => setStats(e.target.value ? Number(e.target.value) : null, "dealt")}></input>
                <input id={`pdim-match-${matchNumber}-comp-${compNumber}-pick-${pickNumber}-taken-input`} className="pdim-pick-stat-input" type="text" placeholder="taken" value={stats.taken ?? ""} onChange={(e) => setStats(e.target.value ? Number(e.target.value) : null, "taken")}></input>
                <input id={`pdim-match-${matchNumber}-comp-${compNumber}-pick-${pickNumber}-healed-input`} className="pdim-pick-stat-input" type="text" placeholder="healed" value={stats.healed ?? ""} onChange={(e) => setStats(e.target.value ? Number(e.target.value) : null, "healed")}></input>
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
            <input id='pdim-event-name-input' type="text" value={eventName ? eventName : ""} placeholder="Event Name" onChange={(e) => setEventName(e.target.value)} />
            {/* Event Date */}
            <input id='pdim-event-date-input' type="date" value={eventDate ? eventDate : ""} placeholder="Event Date" onChange={(e) => setEventDate(e.target.value)} />
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
            <input id='pdim-team-name-input' type="text" value={teamName ? teamName : ""} placeholder="Team Name" onChange={(e) => setTeamName(e.target.value)} />
            {/* Team Region */}
            <input id='pdim-team-region-input' type="text" value={teamRegion ? teamRegion : ""} placeholder="Team Region" onChange={(e) => setTeamRegion(e.target.value)} />
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
            <input id='pdim-player-name-input' type="text" value={playerName ? playerName : ""} placeholder="Player Name" onChange={(e) => setPlayerName(e.target.value)} />
        </div>
    );
}

export default ProDataInsertModal;
