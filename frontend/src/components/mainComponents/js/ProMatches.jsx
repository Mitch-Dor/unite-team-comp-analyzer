import React, { useState, useEffect } from 'react';
import '../css/proMatches.css';
import { fetchAllSets, fetchAllEvents, fetchAllTeams, fetchAllPlayers, fetchAllCharactersAndMoves, isVerifiedUser } from './backendCalls/http';
import SubmitSetModal from './proMatchSupport/SubmitSetModal';
import MatchFiltering from './proMatchSupport/MatchFiltering';
import SetDisplay from './proMatchSupport/SetDisplay';
import Disclaimer from '../../sideComponents/js/Disclaimer';
import { useLocation } from 'react-router-dom';

export function formatSet(formattedData) {
  // Create an array of set objects. Each set object is an array of matches with the same set_id
  const coreData = formattedData.reduce((acc, comp) => {
    const setId = comp.set_id;
    if (!acc[setId]) {
      acc[setId] = [];
    }
    acc[setId].push(comp);
    return acc;
  }, {});
  // Go through each set and count how many times each team won. The team with more wins is the winner of the set. Add this to the set object
  const setWinnerData = Object.keys(coreData).map(setId => {
    const set = coreData[setId];
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
      matches: set, // Remove event, coreData, set_description, vod, set_id from each match object
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

function ProMatches() {
  const [coreData, setCoreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [charactersAndMoves, setCharactersAndMoves] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { user } = useLocation().state || {};
  const [verifiedUser, setVerifiedUser] = useState(false);
  const [advancedDataMode, setAdvancedDataMode] = useState(false);

  useEffect(() => {
    async function fetchAllData() {
      try {
          // Fetch all data to prepopulate dropdowns
          const fetchedEvents = await fetchAllEvents();
          const fetchedTeams = await fetchAllTeams();
          const fetchedPlayers = await fetchAllPlayers();
          const fetchedCharactersAndMoves = await fetchAllCharactersAndMoves();  
          const fetchedSets = await fetchAllSets();
          // Sort all in alphabetical order
          setEvents(fetchedEvents.sort((a, b) => a.event_name.localeCompare(b.event_name)));
          setTeams(fetchedTeams.sort((a, b) => a.team_name.localeCompare(b.team_name)));
          setPlayers(fetchedPlayers.sort((a, b) => a.player_name.localeCompare(b.player_name)));
          // Doesn't need to be sorted. Is already in order of creation / proper move order
          setCharactersAndMoves(fetchedCharactersAndMoves);
          setCoreData(fetchedSets);
          console.log(fetchedSets);
      } catch (error) {
          console.error("Error fetching data:", error);
      }
    }

    // Fetch all data to prepopulate dropdowns
    fetchAllData();

    setLoading(false);
  }, []);

  useEffect(() => {
    async function checkVerifiedUser() {
      if (user) {
        const isVerified = await isVerifiedUser();
        setVerifiedUser(isVerified);
      }
    }
    checkVerifiedUser();
  }, [user]);

  useEffect(() => {
    setFilteredData(coreData);
  }, [coreData]);

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div id="mainContainer" className="main-container">
      {showSubmitForm && <SubmitSetModal setShowSubmitForm={setShowSubmitForm} setCoreData={setCoreData} coreData={coreData} events={events} teams={teams} players={players} charactersAndMoves={charactersAndMoves} setEvents={setEvents} setTeams={setTeams} setPlayers={setPlayers} user={user} />}
      <div id="compsContainer">
        <MatchFiltering events={events} teams={teams} players={players} charactersAndMoves={charactersAndMoves} coreData={coreData} setFilteredData={setFilteredData} advancedDataMode={advancedDataMode} setAdvancedDataMode={setAdvancedDataMode} />
        <div className="comps-list">
          { filteredData && filteredData.length > 0 ? filteredData.map((set, index) => (
            <SetDisplay key={index} set={set} advancedDataMode={advancedDataMode} />
          )) : (
            <div className="no-matches-found">No matches found</div>
          )}
        </div>
      </div>
      {verifiedUser ? (
        <div id="open-set-submit-form" className="open-set-submit-form" onClick={() => {setShowSubmitForm(true); setFilteredData(coreData)}}>+</div>
      ) : (
        <Disclaimer />
      )}
    </div>
  );
}

export default ProMatches;
