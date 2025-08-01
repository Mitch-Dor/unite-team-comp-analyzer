import React, { useState, useEffect } from 'react';
import '../css/comps.css';
import { fetchAllComps, fetchAllEvents, fetchAllTeams, fetchAllPlayers, fetchAllCharactersAndMoves, isVerifiedUser } from './backendCalls/http';
import SubmitSetModal from './compSupport/SubmitSetModal';
import CompsSorting from './compSupport/CompsSorting';
import SetDisplay from './compSupport/SetDisplay';
import Disclaimer from '../../sideComponents/js/Disclaimer';
import { useLocation } from 'react-router-dom';

export function formatSet(formattedData) {
  // Create an array of set objects. Each set object is an array of matches with the same set_id
  const setData = formattedData.reduce((acc, comp) => {
    const setId = comp.set_id;
    if (!acc[setId]) {
      acc[setId] = [];
    }
    acc[setId].push(comp);
    return acc;
  }, {});
  // Go through each set and count how many times each team won. The team with more wins is the winner of the set. Add this to the set object
  const setWinnerData = Object.keys(setData).map(setId => {
    const set = setData[setId];
    // Which team is team1 and team2 can change so we need to count wins relative to team_name
    const team1 = set[0].team1.name;
    const team2 = set[0].team2.name;
    let team1Wins = 0;
    let team2Wins = 0;
    for (const match of set) {
      if ((match.team1.name === team1 && match.winningTeam === 1) || (match.team2.name === team1 && match.winningTeam === 2)) {
        team1Wins++;
      } else if ((match.team1.name === team2 && match.winningTeam === 1) || (match.team2.name === team2 && match.winningTeam === 2)) {
        team2Wins++;
      }
    }
    return {
      matches: set, // Remove event, matchData, set_description, vod, set_id from each match object
      winner: team1Wins > team2Wins ? team1 : team2,
      team1_wins: team1Wins,
      team2_wins: team2Wins,
      set_description: set[0].set_description,
      vod: set[0].vod,
      set_event: set[0].event,
      set_date: set[0].matchDate,
      set_id: set[0].set_id
    }
  })

  return setWinnerData;
}

function Comps() {
  const [compsData, setCompsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [charactersAndMoves, setCharactersAndMoves] = useState([]);
  const [filteredComps, setFilteredComps] = useState([]);
  const { user } = useLocation().state || {};
  const [verifiedUser, setVerifiedUser] = useState(false);
  const [advancedDataMode, setAdvancedDataMode] = useState(false);

  useEffect(() => {
    fetchAllComps().then(data => {
      let formattedData = [];
      for (const comp of data) {
        const team1Data = {
          pokemon: [comp.team1_pokemon1, comp.team1_pokemon2, comp.team1_pokemon3, comp.team1_pokemon4, comp.team1_pokemon5],
          pokemon_data: [
          [comp.team1_pokemon1_kills, comp.team1_pokemon1_assists, comp.team1_pokemon1_scored, comp.team1_pokemon1_dealt, comp.team1_pokemon1_taken, comp.team1_pokemon1_healed, comp.team1_pokemon1_position],
          [comp.team1_pokemon2_kills, comp.team1_pokemon2_assists, comp.team1_pokemon2_scored, comp.team1_pokemon2_dealt, comp.team1_pokemon2_taken, comp.team1_pokemon2_healed, comp.team1_pokemon2_position],
          [comp.team1_pokemon3_kills, comp.team1_pokemon3_assists, comp.team1_pokemon3_scored, comp.team1_pokemon3_dealt, comp.team1_pokemon3_taken, comp.team1_pokemon3_healed, comp.team1_pokemon3_position],
          [comp.team1_pokemon4_kills, comp.team1_pokemon4_assists, comp.team1_pokemon4_scored, comp.team1_pokemon4_dealt, comp.team1_pokemon4_taken, comp.team1_pokemon4_healed, comp.team1_pokemon4_position],
          [comp.team1_pokemon5_kills, comp.team1_pokemon5_assists, comp.team1_pokemon5_scored, comp.team1_pokemon5_dealt, comp.team1_pokemon5_taken, comp.team1_pokemon5_healed, comp.team1_pokemon5_position],
          ],
          pokemon_moves: [comp.team1_pokemon1_move1, comp.team1_pokemon1_move2, comp.team1_pokemon2_move1, comp.team1_pokemon2_move2, comp.team1_pokemon3_move1, comp.team1_pokemon3_move2, comp.team1_pokemon4_move1, comp.team1_pokemon4_move2, comp.team1_pokemon5_move1, comp.team1_pokemon5_move2],
          bans: [comp.team1_ban1, comp.team1_ban2],
          name: comp.team1_name,
          region: comp.team1_region,
          players: [comp.team1_player1, comp.team1_player2, comp.team1_player3, comp.team1_player4, comp.team1_player5],
          firstPick: comp.team1_first_pick === 1
        }
        const team2Data = {
          pokemon: [comp.team2_pokemon1, comp.team2_pokemon2, comp.team2_pokemon3, comp.team2_pokemon4, comp.team2_pokemon5],
          pokemon_data: [
          [comp.team2_pokemon1_kills, comp.team2_pokemon1_assists, comp.team2_pokemon1_scored, comp.team2_pokemon1_dealt, comp.team2_pokemon1_taken, comp.team2_pokemon1_healed, comp.team2_pokemon1_position],
          [comp.team2_pokemon2_kills, comp.team2_pokemon2_assists, comp.team2_pokemon2_scored, comp.team2_pokemon2_dealt, comp.team2_pokemon2_taken, comp.team2_pokemon2_healed, comp.team2_pokemon2_position],
          [comp.team2_pokemon3_kills, comp.team2_pokemon3_assists, comp.team2_pokemon3_scored, comp.team2_pokemon3_dealt, comp.team2_pokemon3_taken, comp.team2_pokemon3_healed, comp.team2_pokemon3_position],
          [comp.team2_pokemon4_kills, comp.team2_pokemon4_assists, comp.team2_pokemon4_scored, comp.team2_pokemon4_dealt, comp.team2_pokemon4_taken, comp.team2_pokemon4_healed, comp.team2_pokemon4_position],
          [comp.team2_pokemon5_kills, comp.team2_pokemon5_assists, comp.team2_pokemon5_scored, comp.team2_pokemon5_dealt, comp.team2_pokemon5_taken, comp.team2_pokemon5_healed, comp.team2_pokemon5_position],
          ],
          pokemon_moves: [comp.team2_pokemon1_move1, comp.team2_pokemon1_move2, comp.team2_pokemon2_move1, comp.team2_pokemon2_move2, comp.team2_pokemon3_move1, comp.team2_pokemon3_move2, comp.team2_pokemon4_move1, comp.team2_pokemon4_move2, comp.team2_pokemon5_move1, comp.team2_pokemon5_move2],
          bans: [comp.team2_ban1, comp.team2_ban2],
          name: comp.team2_name,
          region: comp.team2_region,
          players: [comp.team2_player1, comp.team2_player2, comp.team2_player3, comp.team2_player4, comp.team2_player5],
          firstPick: comp.team2_first_pick === 1
        }
        const finalData = {
          team1: team1Data,
          team2: team2Data,
          winningTeam: comp.team1_win === 1 ? 1 : 2,
          event: comp.event_name,
          matchDate: comp.event_date,
          set_description: comp.set_descriptor,
          vod: comp.vod_url,
          set_id: comp.set_id,
          has_advanced_data: team1Data.pokemon_data[0][3] ? true : false // This is damage dealt. You're never gonna have a comp match where you deal 0 damage so this is safe to check. If one data point is present, they all are.
        }
        formattedData.push(finalData);
      }
      
      const setWinnerData = formatSet(formattedData);
      setCompsData(setWinnerData);

      async function fetchAllData() {
        try {
            // Fetch all data to prepopulate dropdowns
            const fetchedEvents = await fetchAllEvents();
            const fetchedTeams = await fetchAllTeams();
            const fetchedPlayers = await fetchAllPlayers();
            const fetchedCharactersAndMoves = await fetchAllCharactersAndMoves();  
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

    // Fetch all data to prepopulate dropdowns
    fetchAllData();

    setLoading(false);
    });
  }, []);

  useEffect(() => {
    async function checkVerifiedUser() {
      if (user) {
        const isVerified = await isVerifiedUser(user.user_google_id);
        setVerifiedUser(isVerified);
      }
    }
    checkVerifiedUser();
  }, [user]);

  useEffect(() => {
    setFilteredComps(compsData);
  }, [compsData]);

  useEffect(() => {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const mainContainer = document.getElementById("mainContainer");
      if (mainContainer) {
        mainContainer.style.backgroundImage = `url("/assets/landingPageBackgrounds/Blurred/UNITE_Theia_Sky_Ruins.png")`;
        mainContainer.style.backgroundSize = "cover";
        mainContainer.style.backgroundPosition = "center";
        mainContainer.style.backgroundAttachment = "fixed";
      } else {
        if (!loading) {
          // If the page is still loading mainContainer is expected to not be found
          console.error("mainContainer not found");
        }
      }
    }, 0);
  }, [loading]);

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div id="mainContainer" className="main-container">
      {showSubmitForm && <SubmitSetModal setShowSubmitForm={setShowSubmitForm} setCompsData={setCompsData} compsData={compsData} events={events} teams={teams} players={players} charactersAndMoves={charactersAndMoves} setEvents={setEvents} setTeams={setTeams} setPlayers={setPlayers} user={user} />}
      <div id="compsContainer">
        <CompsSorting events={events} teams={teams} players={players} charactersAndMoves={charactersAndMoves} compsData={compsData} setFilteredComps={setFilteredComps} advancedDataMode={advancedDataMode} setAdvancedDataMode={setAdvancedDataMode} />
        <div className="comps-list">
          { filteredComps && filteredComps.length > 0 ? filteredComps.map((set, index) => (
            <SetDisplay key={index} set={set} advancedDataMode={advancedDataMode} />
          )) : (
            <div className="no-matches-found">No matches found</div>
          )}
        </div>
      </div>
      {verifiedUser ? (
        <div id="open-set-submit-form" className="open-set-submit-form" onClick={() => {setShowSubmitForm(true); setFilteredComps(compsData)}}>+</div>
      ) : (
        <Disclaimer />
      )}
    </div>
  );
}

export default Comps;
