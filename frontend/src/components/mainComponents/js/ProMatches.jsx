import React, { useState, useEffect } from 'react';
import '../css/proMatches.css';
import { fetchAllSets, fetchAllEvents, fetchAllTeams, fetchAllPlayers, fetchAllCharactersAndMoves, isVerifiedUser } from './common/http';
import ProDataInsertModal from './proMatchSupport/ProDataInsertModal';
import MatchFiltering from './proMatchSupport/MatchFiltering';
import SlickSetDisplay from './proMatchSupport/SlickSetDisplay';
import Disclaimer from '../../sideComponents/js/Disclaimer';
import { useLocation } from 'react-router-dom';

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
  const [expandShrinkAllMatches, setExpandShrinkAllMatches] = useState(false);

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
          setEvents(fetchedEvents);
          setTeams(fetchedTeams);
          setPlayers(fetchedPlayers);
          // Doesn't need to be sorted. Is already in order of creation / proper move order
          setCharactersAndMoves(fetchedCharactersAndMoves);
          setCoreData(fetchedSets);
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
    return <div className="pro-matches-loading-container">Loading...</div>;
  }

  return (
    <div id="pro-matches-main-container" className="pro-matches-main-container">
      {showSubmitForm && <ProDataInsertModal setShowSubmitForm={setShowSubmitForm} setCoreData={setCoreData} events={events} teams={teams} players={players} charactersAndMoves={charactersAndMoves} setEvents={setEvents} setTeams={setTeams} setPlayers={setPlayers} />}
      <div id="pro-matches-matches-container">
        <MatchFiltering events={events} teams={teams} players={players} charactersAndMoves={charactersAndMoves} coreData={coreData} setFilteredData={setFilteredData} expandShrinkAllMatches={expandShrinkAllMatches} setExpandShrinkAllMatches={setExpandShrinkAllMatches} />
        <div className="pro-matches-match-list">
          { filteredData && filteredData.length > 0 ? filteredData.map((set, index) => (
            <SlickSetDisplay key={`pro-matches-${index}`} set={set} expandShrinkAllMatches={expandShrinkAllMatches} />
          )) : (
            <div className="pro-matches-no-matches-found">No matches found</div>
          )}
        </div>
      </div>
      {verifiedUser ? (
        <div id="pro-matches-open-pro-data-insert-form" className="pro-matches-open-pro-data-insert-form" onClick={() => {setShowSubmitForm(true); setFilteredData(coreData)}}>+</div>
      ) : (
        <Disclaimer />
      )}
    </div>
  );
}

export default ProMatches;
