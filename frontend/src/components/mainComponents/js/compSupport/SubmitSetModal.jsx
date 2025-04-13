import React, { useState, useEffect, useRef } from 'react';
import { fetchAllEvents, fetchAllTeams, fetchAllPlayers, fetchAllCharactersAndMoves, insertEvent, insertTeam, insertPlayer, insertSet } from '../backendCalls/http';

function SubmitSetModal({ setShowSubmitForm, setCompsData }) {
    const [setInsertion, setSetInsertion] = useState(false);
    const [events, setEvents] = useState([]);
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [charactersAndMoves, setCharactersAndMoves] = useState([]);
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

        async function fetchAllData() {
            try {
                // Fetch all data to prepopulate dropdowns
                const events = await fetchAllEvents();
                const teams = await fetchAllTeams();
                const players = await fetchAllPlayers();
                const charactersAndMoves = await fetchAllCharactersAndMoves();  
                console.log(events);
                console.log(teams);
                console.log(players);
                console.log(charactersAndMoves);
                setEvents(events);
                setTeams(teams);
                setPlayers(players);
                setCharactersAndMoves(charactersAndMoves);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        // Fetch all data to prepopulate dropdowns
        fetchAllData();

    }, []);

    useEffect(() => {
        console.log("Events: ", events);
        console.log("Teams: ", teams);
        console.log("Players: ", players);
        console.log("Characters and Moves: ", charactersAndMoves);
    }, [events, teams, players, charactersAndMoves]);
  
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
            // Pull out the data
            let eventData = {
                eventName: checkNull(setInsertion[5], "eventName", 0),
                eventDate: checkNull(setInsertion[6], "eventDate", 0),
                eventVodUrl: checkNull(setInsertion[7], "eventVodUrl", 0),
                setDescriptor: checkNull(setInsertion[8], "setDescriptor", 0)
            }
            // Format it in a way that's easy to insert into the comps page
            formattedData.push({event: eventData.event_name, matchDate: eventData.event_date, vod: eventData.vod_url, set_description: eventData.setDescriptor});
            for (let j = 0; j < 5; j++) {
                const match = setInsertion[j];
                if (match !== null) {
                    let matchData = {
                        team1: match[0],
                        team2: match[1],
                        winner: match[2]
                    }
                    let team1Data = {
                        name: checkNull(matchData.team1[0], "team1TeamName", i),
                        region: checkNull(matchData.team1[1], "team1TeamRegion", i),
                        firstPick: checkNull(matchData.team1[2], "team1FirstPick", i),
                        bans: [checkNull(matchData.team1[3], "team1Ban1", i), checkNull(matchData.team1[4], "team1Ban2", i)],
                        pokemon: [checkNull(matchData.team1[5], "team1Pokemon1", i), checkNull(matchData.team1[6], "team1Pokemon2", i), checkNull(matchData.team1[7], "team1Pokemon3", i), checkNull(matchData.team1[8], "team1Pokemon4", i), checkNull(matchData.team1[9], "team1Pokemon5", i)],
                        pokemon_moves: [checkNull(matchData.team1[10], "team1Pokemon1Move1", i), checkNull(matchData.team1[11], "team1Pokemon1Move2", i), checkNull(matchData.team1[12], "team1Pokemon2Move1", i), checkNull(matchData.team1[13], "team1Pokemon2Move2", i), checkNull(matchData.team1[14], "team1Pokemon3Move1", i), checkNull(matchData.team1[15], "team1Pokemon3Move2", i), checkNull(matchData.team1[16], "team1Pokemon4Move1", i), checkNull(matchData.team1[17], "team1Pokemon4Move2", i), checkNull(matchData.team1[18], "team1Pokemon5Move1", i), checkNull(matchData.team1[19], "team1Pokemon5Move2", i)],
                        players: [checkNull(matchData.team1[20], "team1Player1", i), checkNull(matchData.team1[21], "team1Player2", i), checkNull(matchData.team1[22], "team1Player3", i), checkNull(matchData.team1[23], "team1Player4", i), checkNull(matchData.team1[24], "team1Player5", i)]
                    }
                    let team2Data = {
                        name: checkNull(matchData.team2[0], "team2TeamName", i),
                        region: checkNull(matchData.team2[1], "team2TeamRegion", i),
                        firstPick: checkNull(matchData.team2[2], "team2FirstPick", i),
                        bans: [checkNull(matchData.team2[3], "team2Ban1", i), checkNull(matchData.team2[4], "team2Ban2", i)],
                        pokemon: [checkNull(matchData.team2[5], "team2Pokemon1", i), checkNull(matchData.team2[6], "team2Pokemon2", i), checkNull(matchData.team2[7], "team2Pokemon3", i), checkNull(matchData.team2[8], "team2Pokemon4", i), checkNull(matchData.team2[9], "team2Pokemon5", i)],
                        pokemon_moves: [checkNull(matchData.team2[10], "team2Pokemon1Move1", i), checkNull(matchData.team2[11], "team2Pokemon1Move2", i), checkNull(matchData.team2[12], "team2Pokemon2Move1", i), checkNull(matchData.team2[13], "team2Pokemon2Move2", i), checkNull(matchData.team2[14], "team2Pokemon3Move1", i), checkNull(matchData.team2[15], "team2Pokemon3Move2", i), checkNull(matchData.team2[16], "team2Pokemon4Move1", i), checkNull(matchData.team2[17], "team2Pokemon4Move2", i), checkNull(matchData.team2[18], "team2Pokemon5Move1", i), checkNull(matchData.team2[19], "team2Pokemon5Move2", i)],
                        players: [checkNull(matchData.team2[20], "team2Player1", i), checkNull(matchData.team2[21], "team2Player2", i), checkNull(matchData.team2[22], "team2Player3", i), checkNull(matchData.team2[23], "team2Player4", i), checkNull(matchData.team2[24], "team2Player5", i)]
                    }
                    checkNull(matchData.winner, "winner", i);

                    // Check first pick validation
                    if (team1Data.firstPick === team2Data.firstPick) {
                        error += "\n" + "Match " + i + " must have exactly one team as first pick";
                        errorCount++;
                    }

                    // Put it all in one match object
                    formattedData.push({team1: team1Data, team2: team2Data, winningTeam: matchData.winner});
                    i++;
                }
            }
            // If something is missing, don't submit
            if (errorCount > 0) {
                alert(error);
                return;
            }
            // Submit the data
            insertSet(formattedData).then(data => {
                // Update the comp data on the comp display page with the new comps
                // Missing some of the data that the comps page has but it has everything needed to display
                for (let k=1; k < formattedData.length; k++) {
                    const newMatch = {
                        team1: formattedData[k].team1,
                        team2: formattedData[k].team2,
                        winningTeam: formattedData[k].winningTeam,
                        event: formattedData[0].event,
                        matchDate: formattedData[0].matchDate,
                        set_description: formattedData[0].set_description,
                        vod: formattedData[0].vod
                    }
                    setCompsData([...setCompsData, newMatch]);
                }
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
                insertEvent(eventInsertion.event_name, eventInsertion.event_date, eventInsertion.vod_url).then(data => {
                    // Update the event data with the ID
                    const newEvent = {
                        event_id: data.id,
                        event_name: eventInsertion.event_name,
                        event_date: eventInsertion.event_date,
                        vod_url: eventInsertion.vod_url
                    }
                    console.log("New Event: ", newEvent);
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
                alert(error);
                return;
            }
        }

        function checkNull(data, field, i) {
            if (data === null) {
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
        function checkNull(data, field) {
            if (data === null) {
                // Add the field to the error message
                error += "\n" + field;
                errorCount++;
                return "null";
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
                <SetInsertion key={resetKey} setSetInsertion={setSetInsertion} events={events} teams={teams} players={players} charactersAndMoves={charactersAndMoves} />
            )}
            {creationState === 1 && (
                <EventCreation key={resetKey} setEventInsertion={setEventInsertion} />
            )}
            {creationState === 2 && (
                <TeamCreation key={resetKey} setTeamInsertion={setTeamInsertion} />
            )}
            {creationState === 3 && (
                <PlayerCreation key={resetKey} setPlayerInsertion={setPlayerInsertion} />
            )}
            {/* Submit Button */}
            <button id="set-submit-button" onClick={submitComp}>Submit</button>
            {/* Add Reset Button */}
            <button id="set-reset-button" onClick={resetAllForms}>Reset</button>
        </div>
    );
}

// The full insertion form for a set
function SetInsertion({ key, setSetInsertion, events, teams, players, charactersAndMoves }) {
    const [match1, setMatch1] = useState(null);
    const [match2, setMatch2] = useState(null);
    const [match3, setMatch3] = useState(null);
    const [match4, setMatch4] = useState(null);
    const [match5, setMatch5] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [setDescriptor, setSetDescriptor] = useState(null);

    const resetForm = () => {
        setMatch1(null);
        setMatch2(null);
        setMatch3(null);
        setMatch4(null);
        setMatch5(null);
        setSelectedEvent(null);
        setSetDescriptor(null);
    };

    useEffect(() => {
        if (selectedEvent) {
            setSetInsertion([match1, match2, match3, match4, match5, selectedEvent.event_name, selectedEvent.event_date, selectedEvent.vod_url]);
        } else {
            setSetInsertion([match1, match2, match3, match4, match5, null, null, null]);
        }
    }, [match1, match2, match3, match4, match5, selectedEvent]);

    useEffect(() => {
        resetForm();
    }, []);

    useEffect(() => {
        resetForm();
    }, [key]);

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
                <MatchInsertion key={key} setMatch={setMatch1} teams={teams} players={players} charactersAndMoves={charactersAndMoves} matchNumber={1}/>
            </div>
            <div className="comp-card">
                <MatchInsertion key={key} setMatch={setMatch2} teams={teams} players={players} charactersAndMoves={charactersAndMoves} matchNumber={2}/>
            </div>
            <div className="comp-card">
                <MatchInsertion key={key} setMatch={setMatch3} teams={teams} players={players} charactersAndMoves={charactersAndMoves} matchNumber={3}/>
            </div>
            <div className="comp-card">
                <MatchInsertion key={key} setMatch={setMatch4} teams={teams} players={players} charactersAndMoves={charactersAndMoves} matchNumber={4}/>
            </div>
            <div className="comp-card">
                <MatchInsertion key={key} setMatch={setMatch5} teams={teams} players={players} charactersAndMoves={charactersAndMoves} matchNumber={5}/>
            </div>
        </div>
    );
}

// Match insertion form for a set (Used in SetInsertion)
function MatchInsertion({ key, setMatch, teams, players, charactersAndMoves, matchNumber }) {
    const [comp1, setComp1] = useState(null);
    const [comp2, setComp2] = useState(null);
    const [matchWinner, setMatchWinner] = useState(null);

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
    }, [key]);

    return (
        <div id="match-insertion">
            <h3>Match {matchNumber}</h3>
            <div className="set-comp-content">
                <CompInsertion 
                    key={key} 
                    setComp={setComp1} 
                    teams={teams} 
                    players={players} 
                    charactersAndMoves={charactersAndMoves}
                />
                <CompInsertion 
                    key={key} 
                    setComp={setComp2} 
                    teams={teams} 
                    players={players} 
                    charactersAndMoves={charactersAndMoves}
                />
            </div>
            {/* Match Winner Dropdown */}
            <div className="match-winner-dropdown">
                <select value={matchWinner} onChange={(e) => setMatchWinner(e.target.value)}>
                    <option value="">Winner Select</option>
                    <option value="1">Team 1</option>
                    <option value="2">Team 2</option>
                </select>
            </div>
        </div>
    )
}

// Comp insertion form for a match (Used in SetInsertion)
function CompInsertion({ key, setComp, teams, players, charactersAndMoves }) {
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
            setComp([selectedTeam.team_name, selectedTeam.team_region, teamIsFirstPick, ban1, ban2, pokemon1, pokemon2, pokemon3, pokemon4, pokemon5, pokemon1move1, pokemon1move2, pokemon2move1, pokemon2move2, pokemon3move1, pokemon3move2, pokemon4move1, pokemon4move2, pokemon5move1, pokemon5move2, player1, player2, player3, player4, player5]);
        } else {
            setComp([null, null, teamIsFirstPick, ban1, ban2, pokemon1, pokemon2, pokemon3, pokemon4, pokemon5, pokemon1move1, pokemon1move2, pokemon2move1, pokemon2move2, pokemon3move1, pokemon3move2, pokemon4move1, pokemon4move2, pokemon5move1, pokemon5move2, player1, player2, player3, player4, player5]);
        }
    }, [selectedTeam, teamIsFirstPick, ban1, ban2, pokemon1, pokemon2, pokemon3, pokemon4, pokemon5, pokemon1move1, pokemon1move2, pokemon2move1, pokemon2move2, pokemon3move1, pokemon3move2, pokemon4move1, pokemon4move2, pokemon5move1, pokemon5move2, player1, player2, player3, player4, player5]);

    useEffect(() => {
        resetForm();
    }, []);

    useEffect(() => {
        resetForm();
    }, [key]);

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
                    options={[...new Set(charactersAndMoves.map(char => char.pokemon_name))]}
                    placeholder="Ban 1 Select"
                    disabled={false}
                    path="/assets/Draft/headshots"
                />
                <CustomDropdown
                    value={ban2}
                    onChange={setBan2}
                    options={[...new Set(charactersAndMoves.map(char => char.pokemon_name))]}
                    placeholder="Ban 2 Select"
                    disabled={false}
                    path="/assets/Draft/headshots"
                />
            </div>
            <div className="team-comp">
                {/* Pokemon / Players */}
                <CharacterPlayer 
                    key={key}
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
                />
                <CharacterPlayer 
                    key={key}
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
                />
                <CharacterPlayer 
                    key={key}
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
                />
                <CharacterPlayer 
                    key={key}
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
                />
                <CharacterPlayer 
                    key={key}
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
                />
            </div>
        </div>
    )
}

// Custom dropdown component
function CustomDropdown({ value, onChange, options, placeholder, disabled, path, character_name }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function getImagePath(name) {
        if (character_name) {
            const formattedName = name.replace(/\s+/g, '_');
            return `${path}/${character_name}_${formattedName}.png`;
        }
        return `${path}/${name}.png`;
    }

    return (
        <div className="custom-dropdown" ref={dropdownRef}>
            <button 
                className="dropdown-button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
            >
                {value ? (
                    <div className="selected-option">
                        <img 
                            src={getImagePath(value)} 
                            alt={value}
                            className="dropdown-icon"
                        />
                        <span>{value}</span>
                    </div>
                ) : (
                    <span>{placeholder}</span>
                )}
            </button>
            {isOpen && (
                <div className="dropdown-options">
                    {options.map((option) => (
                        <div
                            key={option}
                            className="dropdown-option"
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                        >
                            <img 
                                src={getImagePath(option)} 
                                alt={option}
                                className="dropdown-icon"
                            />
                            <span>{option}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Character and player insertion form for a comp (Used in SetInsertion)
function CharacterPlayer({ key, character, move1, move2, player, setCharacter, setMove1, setMove2, setPlayer, charactersAndMoves, players }) {
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

    const availableMoves = character ? getPokemonMoves(character) : [];
    const uniquePokemon = [...new Set(charactersAndMoves.map(char => char.pokemon_name))];

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
                options={uniquePokemon}
                placeholder="Character Select"
                path="/assets/Draft/headshots"
            />
            {/* Move 1 Dropdown */}
            <CustomDropdown
                value={move1}
                onChange={setMove1}
                options={availableMoves.map(move => move.move_name)}
                placeholder="Move 1 Select"
                disabled={!character}   
                path="/assets/Draft/moves"
                character_name={character}  
            />
            {/* Move 2 Dropdown */}
            <CustomDropdown
                value={move2}
                onChange={setMove2}
                options={availableMoves.map(move => move.move_name)}
                placeholder="Move 2 Select"
                disabled={!character}   
                path="/assets/Draft/moves"
                character_name={character}  
            />
            {/* Player Dropdown */}
            <select value={player} onChange={(e) => setPlayer(e.target.value)}>
                <option value="">Player Select</option>
                {players.map(player => (
                    <option key={player.player_id} value={player.player_name}>
                        {player.player_name}
                    </option>
                ))}
            </select>
        </div>
    )
}

// Creation form for JUST event
function EventCreation({ key, setEventInsertion }) {
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
    }, [key]);

    return (
        <div id="event-creation">
            {/* Event Name */}
            <input type="text" value={eventName} placeholder="Event Name" onChange={(e) => setEventName(e.target.value)} />
            {/* Event Date */}
            <input type="text" value={eventDate} placeholder="Event Date" onChange={(e) => setEventDate(e.target.value)} />
            {/* Event VOD URL */}
            <input type="text" value={eventVodUrl} placeholder="Event VOD URL" onChange={(e) => setEventVodUrl(e.target.value)} />
        </div>
    )
}

// Creation form for JUST a team
function TeamCreation({ key, setTeamInsertion }) {
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
    }, [key]);

    return (
        <div id="team-creation">
            {/* Team Name */}
            <input type="text" value={teamName} placeholder="Team Name" onChange={(e) => setTeamName(e.target.value)} />
            {/* Team Region */}
            <input type="text" value={teamRegion} placeholder="Team Region" onChange={(e) => setTeamRegion(e.target.value)} />
        </div>
    );
}

// Creation form for JUST a player
function PlayerCreation({ key, setPlayerInsertion }) {
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
    }, [key]);

    return (
        <div id="player-creation">
            {/* Player Name */}
            <input type="text" value={playerName} placeholder="Player Name" onChange={(e) => setPlayerName(e.target.value)} />
        </div>
    );
}

export default SubmitSetModal;
