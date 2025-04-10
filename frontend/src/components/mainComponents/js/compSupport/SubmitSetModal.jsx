import React, { useState, useEffect, useRef } from 'react';

function SubmitSetModal({ setShowSubmitForm, setSubmitData }) {
    const [set, setSet] = useState(null);
    useEffect(() => {
        // Set an event listener for if the user clicks outside of the modal to close it
        window.addEventListener('click', (e) => {
            // Check if the clicked element is the open button or is inside the modal
            if (e.target.id === 'open-set-submit-form' || 
                e.target.closest('#set-submit-form') || 
                e.target.closest('#set-submit-form')) {
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

        // Pull out the data
        let eventData = {
            eventName: checkNull(set[5], "eventName", 0),
            eventDate: checkNull(set[6], "eventDate", 0),
            eventVodUrl: checkNull(set[7], "eventVodUrl", 0)
        }
        formattedData.push({event: eventData});
        for (let j = 0; j < 5; j++) {
            const match = set[j];
            if (match !== null) {
                let matchData = {
                    team1: match[0],
                    team2: match[1],
                    winner: match[2]
                }
                let team1Data = {
                    teamName: checkNull(matchData.team1[0], "team1TeamName", i),
                    teamRegion: checkNull(matchData.team1[1], "team1TeamRegion", i),
                    firstPick: checkNull(matchData.team1[2], "team1FirstPick", i),
                    ban1: checkNull(matchData.team1[3], "team1Ban1", i),
                    ban2: checkNull(matchData.team1[4], "team1Ban2", i),
                    pokemon1: checkNull(matchData.team1[5], "team1Pokemon1", i),
                    pokemon2: checkNull(matchData.team1[6], "team1Pokemon2", i),
                    pokemon3: checkNull(matchData.team1[7], "team1Pokemon3", i),
                    pokemon4: checkNull(matchData.team1[8], "team1Pokemon4", i),
                    pokemon5: checkNull(matchData.team1[9], "team1Pokemon5", i),
                    pokemon1move1: checkNull(matchData.team1[10], "team1Pokemon1Move1", i),
                    pokemon1move2: checkNull(matchData.team1[11], "team1Pokemon1Move2", i),
                    pokemon2move1: checkNull(matchData.team1[12], "team1Pokemon2Move1", i),
                    pokemon2move2: checkNull(matchData.team1[13], "team1Pokemon2Move2", i),
                    pokemon3move1: checkNull(matchData.team1[14], "team1Pokemon3Move1", i),
                    pokemon3move2: checkNull(matchData.team1[15], "team1Pokemon3Move2"  ),
                    pokemon4move1: checkNull(matchData.team1[16], "team1Pokemon4Move1", i), 
                    pokemon4move2: checkNull(matchData.team1[17], "team1Pokemon4Move2", i), 
                    pokemon5move1: checkNull(matchData.team1[18], "team1Pokemon5Move1", i),
                    pokemon5move2: checkNull(matchData.team1[19], "team1Pokemon5Move2", i),
                    player1: checkNull(matchData.team1[20], "team1Player1", i),
                    player2: checkNull(matchData.team1[21], "team1Player2", i),
                    player3: checkNull(matchData.team1[22], "team1Player3", i),
                    player4: checkNull(matchData.team1[23], "team1Player4", i),
                    player5: checkNull(matchData.team1[24], "team1Player5")
                }
                let team2Data = {
                    teamName: checkNull(matchData.team2[0], "team2TeamName", i),
                    teamRegion: checkNull(matchData.team2[1], "team2TeamRegion", i),
                    firstPick: checkNull(matchData.team2[2], "team2FirstPick", i),
                    ban1: checkNull(matchData.team2[3], "team2Ban1", i),
                    ban2: checkNull(matchData.team2[4], "team2Ban2", i),
                    pokemon1: checkNull(matchData.team2[5], "team2Pokemon1", i),
                    pokemon2: checkNull(matchData.team2[6], "team2Pokemon2", i),
                    pokemon3: checkNull(matchData.team2[7], "team2Pokemon3", i),
                    pokemon4: checkNull(matchData.team2[8], "team2Pokemon4", i),
                    pokemon5: checkNull(matchData.team2[9], "team2Pokemon5", i),
                    pokemon1move1: checkNull(matchData.team2[10], "team2Pokemon1Move1", i),
                    pokemon1move2: checkNull(matchData.team2[11], "team2Pokemon1Move2", i),
                    pokemon2move1: checkNull(matchData.team2[12], "team2Pokemon2Move1", i),
                    pokemon2move2: checkNull(matchData.team2[13], "team2Pokemon2Move2", i),
                    pokemon3move1: checkNull(matchData.team2[14], "team2Pokemon3Move1", i),
                    pokemon3move2: checkNull(matchData.team2[15], "team2Pokemon3Move2", i),
                    pokemon4move1: checkNull(matchData.team2[16], "team2Pokemon4Move1", i), 
                    pokemon4move2: checkNull(matchData.team2[17], "team2Pokemon4Move2", i), 
                    pokemon5move1: checkNull(matchData.team2[18], "team2Pokemon5Move1", i),
                    pokemon5move2: checkNull(matchData.team2[19], "team2Pokemon5Move2", i),
                    player1: checkNull(matchData.team2[20], "team2Player1", i),
                    player2: checkNull(matchData.team2[21], "team2Player2", i),
                    player3: checkNull(matchData.team2[22], "team2Player3", i),
                    player4: checkNull(matchData.team2[23], "team2Player4", i),
                    player5: checkNull(matchData.team2[24], "team2Player5")
                }
                checkNull(matchData.winner, "winner", i);
                // Put it all in one match object
                formattedData.push({match: {team1: team1Data, team2: team2Data, winner: matchData.winner}});
                i++;
            }
        }
        // If something is missing, don't submit
        if (errorCount > 0) {
            alert(error);
            return;
        }
        // Submit the data
        setSubmitData(formattedData);
        setShowSubmitForm(false);
    }
    
    return (
        <div id="set-submit-form">
            <SetInsertion setSet={setSet} />
            {/* Submit Button */}
            <button id="set-submit-button" onClick={submitComp}>Submit</button>
        </div>
    );
}

function SetInsertion({ setSet }) {
    const [match1, setMatch1] = useState(null);
    const [match2, setMatch2] = useState(null);
    const [match3, setMatch3] = useState(null);
    const [match4, setMatch4] = useState(null);
    const [match5, setMatch5] = useState(null);
    const [eventName, setEventName] = useState(null);
    const [eventDate, setEventDate] = useState(null);
    const [eventVodUrl, setEventVodUrl] = useState(null);

    useEffect(() => {
        setSet([match1, match2, match3, match4, match5, eventName, eventDate, eventVodUrl]);
    }, [match1, match2, match3, match4, match5, eventName, eventDate, eventVodUrl]);

    return (
        <div id="set-submit-form" className="comp-card">
            <div className="comp-header">
                {/* Event Name */}
                <input type="text" value={eventName} placeholder="Event Name" onChange={(e) => setEventName(e.target.value)} />
                {/* Event Date */}
                <input type="text" value={eventDate} placeholder="Event Date" onChange={(e) => setEventDate(e.target.value)} />
                {/* Event VOD URL */}
                <input type="text" value={eventVodUrl} placeholder="Event VOD URL" onChange={(e) => setEventVodUrl(e.target.value)} />
            </div>  
            <div className="comp-card">
                <MatchInsertion setMatch={setMatch1}/>
            </div>
            <div className="comp-card">
                <MatchInsertion setMatch={setMatch2}/>
            </div>
            <div className="comp-card">
                <MatchInsertion setMatch={setMatch3}/>
            </div>
            <div className="comp-card">
                <MatchInsertion setMatch={setMatch4}/>
            </div>
            <div className="comp-card">
                <MatchInsertion setMatch={setMatch5}/>
            </div>
        </div>
    );
}

function MatchInsertion({ setMatch }) {
    const [comp1, setComp1] = useState(null);
    const [comp2, setComp2] = useState(null);
    const [matchWinner, setMatchWinner] = useState(null);

    useEffect(() => {
        setMatch([comp1, comp2, matchWinner]);
    }, [comp1, comp2, matchWinner]);

    return (
        <div id="match-insertion">
            <div className="comp-content">
                <CompInsertion setComp={setComp1}/>
                <CompInsertion setComp={setComp2}/>
            </div>
            {/* Match Winner */}
            <input type="text" value={matchWinner} placeholder="Who Won?" onChange={(e) => setMatchWinner(e.target.value)} />
        </div>
    )
}

function CompInsertion({ setComp }) {
    const [teamName, setTeamName] = useState(null);
    const [teamRegion, setTeamRegion] = useState(null);
    const [firstPick, setFirstPick] = useState(null);
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

    useEffect(() => {
        setComp([teamName, teamRegion, firstPick, ban1, ban2, pokemon1, pokemon2, pokemon3, pokemon4, pokemon5, pokemon1move1, pokemon1move2, pokemon2move1, pokemon2move2, pokemon3move1, pokemon3move2, pokemon4move1, pokemon4move2, pokemon5move1, pokemon5move2, player1, player2, player3, player4, player5]);
    }, [teamName, teamRegion, firstPick, ban1, ban2, pokemon1, pokemon2, pokemon3, pokemon4, pokemon5, pokemon1move1, pokemon1move2, pokemon2move1, pokemon2move2, pokemon3move1, pokemon3move2, pokemon4move1, pokemon4move2, pokemon5move1, pokemon5move2, player1, player2, player3, player4, player5]);

    return (
        <div id="comp-insertion">
            <div className="team-header">
                {/* Team Name */}
                <input type="text" value={teamName} placeholder="Team Name" onChange={(e) => setTeamName(e.target.value)} />
                {/* Team Region */}
                <input type="text" value={teamRegion} placeholder="Team Region" onChange={(e) => setTeamRegion(e.target.value)} />
                {/* First Pick? */}
                <label htmlFor="first-pick">First Pick?</label>
                <select name="first-pick" id="first-pick" onChange={(e) => setFirstPick(e.target.value)}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>
            <div className="team-bans">
                {/* Bans */}
                <input type="text" value={ban1} placeholder="Ban 1" onChange={(e) => setBan1(e.target.value)} />
                <input type="text" value={ban2} placeholder="Ban 2" onChange={(e) => setBan2(e.target.value)} />
            </div>
            <div className="team-comp">
                {/* Pokemon / Players */}
                <CharacterPlayer character={pokemon1} move1={pokemon1move1} move2={pokemon1move2} player={player1} setCharacter={setPokemon1} setMove1={setPokemon1Move1} setMove2={setPokemon1Move2} setPlayer={setPlayer1} />
                <CharacterPlayer character={pokemon2} move1={pokemon2move1} move2={pokemon2move2} player={player2} setCharacter={setPokemon2} setMove1={setPokemon2Move1} setMove2={setPokemon2Move2} setPlayer={setPlayer2} />
                <CharacterPlayer character={pokemon3} move1={pokemon3move1} move2={pokemon3move2} player={player3} setCharacter={setPokemon3} setMove1={setPokemon3Move1} setMove2={setPokemon3Move2} setPlayer={setPlayer3} />
                <CharacterPlayer character={pokemon4} move1={pokemon4move1} move2={pokemon4move2} player={player4} setCharacter={setPokemon4} setMove1={setPokemon4Move1} setMove2={setPokemon4Move2} setPlayer={setPlayer4} />
                <CharacterPlayer character={pokemon5} move1={pokemon5move1} move2={pokemon5move2} player={player5} setCharacter={setPokemon5} setMove1={setPokemon5Move1} setMove2={setPokemon5Move2} setPlayer={setPlayer5} />
            </div>
        </div>
    )
}

function CharacterPlayer({ character, move1, move2, player, setCharacter, setMove1, setMove2, setPlayer }) {

    return (
        <div id="character-player">
            {/* Character */}
            <input type="text" value={character} placeholder="Character" onChange={(e) => setCharacter(e.target.value)} />
            {/* Move 1 */}
            <input type="text" value={move1} placeholder="Move 1" onChange={(e) => setMove1(e.target.value)} />
            {/* Move 2 */}
            <input type="text" value={move2} placeholder="Move 2" onChange={(e) => setMove2(e.target.value)} />
            {/* Player Name */}
            <input type="text" value={player} placeholder="Player Name" onChange={(e) => setPlayer(e.target.value)} />
        </div>
    )
}

export default SubmitSetModal;
