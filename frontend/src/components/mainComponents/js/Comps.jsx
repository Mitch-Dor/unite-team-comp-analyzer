import React, { useState, useEffect } from 'react';
import '../css/comps.css';
import { fetchAllComps, fetchAllEvents, fetchAllTeams, fetchAllPlayers, fetchAllCharactersAndMoves } from './backendCalls/http';
import SubmitSetModal from './compSupport/SubmitSetModal';
import MatchDisplay from './compSupport/MatchDisplay';
import CustomDropdown from './compSupport/CustomDropdown';

function Comps() {
  const [compsData, setCompsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [charactersAndMoves, setCharactersAndMoves] = useState([]);
  const [filteredComps, setFilteredComps] = useState([]);

  // Sample data - In a real app, this would come from an API
  useEffect(() => {
    fetchAllComps().then(data => {
      let finalFormattedData = [];
      for (const comp of data) {
        const team1Data = {
          pokemon: [comp.team1_pokemon1, comp.team1_pokemon2, comp.team1_pokemon3, comp.team1_pokemon4, comp.team1_pokemon5],
          pokemon_moves: [comp.team1_pokemon1_move1, comp.team1_pokemon1_move2, comp.team1_pokemon2_move1, comp.team1_pokemon2_move2, comp.team1_pokemon3_move1, comp.team1_pokemon3_move2, comp.team1_pokemon4_move1, comp.team1_pokemon4_move2, comp.team1_pokemon5_move1, comp.team1_pokemon5_move2],
          bans: [comp.team1_ban1, comp.team1_ban2],
          name: comp.team1_name,
          region: comp.team1_region,
          players: [comp.team1_player1, comp.team1_player2, comp.team1_player3, comp.team1_player4, comp.team1_player5],
          firstPick: comp.team1_first_pick === 1
        }
        const team2Data = {
          pokemon: [comp.team2_pokemon1, comp.team2_pokemon2, comp.team2_pokemon3, comp.team2_pokemon4, comp.team2_pokemon5],
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
          vod: comp.vod_url
        }
        finalFormattedData.push(finalData);
      }
      setCompsData(finalFormattedData);

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
      {showSubmitForm && <SubmitSetModal setShowSubmitForm={setShowSubmitForm} setCompsData={setCompsData} compsData={compsData} events={events} teams={teams} players={players} charactersAndMoves={charactersAndMoves} setEvents={setEvents} setTeams={setTeams} setPlayers={setPlayers} />}
      <div id="compsContainer">
        <div className="comps-list">
          <h1 className="page-title">Team Compositions</h1>
          <CompsSorting events={events} teams={teams} players={players} charactersAndMoves={charactersAndMoves} compsData={compsData} setCompsData={setCompsData} setFilteredComps={setFilteredComps} />
          { filteredComps && filteredComps.length > 0 ? filteredComps.map((match, index) => (
            <MatchDisplay key={index} match={match} />
          )) : compsData.map((match, index) => (
            <MatchDisplay key={index} match={match} />
          ))}
        </div>
      </div>
      <div id="open-set-submit-form" className="open-set-submit-form" onClick={() => {setShowSubmitForm(true); setFilteredComps([])}}>+</div>
    </div>
  );
}

function CompsSorting({ events, teams, players, charactersAndMoves, compsData, setCompsData, setFilteredComps }) {
  const [regions, setRegions] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [baseData, setBaseData] = useState(compsData);
  const [eventFilter, setEventFilter] = useState("");
  const [characterFilter, setCharacterFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [playerFilter, setPlayerFilter] = useState("");
  const defaultEvent = "Event Select";
  const defaultCharacter = "Pokemon Select";
  const defaultRegion = "Region Select";
  const defaultTeam = "Team Select";
  const defaultPlayer = "Player Select";

  useEffect(() => {
    // Only add unique regions
    const fetchedRegions = [...new Set(teams.map((team) => team.team_region))];
    setRegions(fetchedRegions.sort((a, b) => a.localeCompare(b)));

    // Get unique pokemon_name and pokemon_id combinations
    const uniquePokemon = [...new Set(charactersAndMoves.map(char => JSON.stringify({pokemon_name: char.pokemon_name, pokemon_id: char.pokemon_id})))].map(str => JSON.parse(str)); 
    setCharacters(uniquePokemon);
    // Set default values
    setEventFilter(defaultEvent);
    setCharacterFilter(defaultCharacter);
    setRegionFilter(defaultRegion);
    setTeamFilter(defaultTeam);
    setPlayerFilter(defaultPlayer);
  }, [charactersAndMoves, teams]);

  function filterComps() {
    const filteredComps = baseData.filter((comp) => {
      return (eventFilter === defaultEvent || comp.event === eventFilter)
       && (characterFilter === defaultCharacter || comp.team1.pokemon.includes(characterFilter.pokemon_name) || comp.team2.pokemon.includes(characterFilter.pokemon_name))
       && (regionFilter === defaultRegion || comp.team1.region === regionFilter || comp.team2.region === regionFilter)
       && (teamFilter === defaultTeam || comp.team1.name === teamFilter || comp.team2.name === teamFilter) 
       && (playerFilter === defaultPlayer || comp.team1.players.includes(playerFilter) || comp.team2.players.includes(playerFilter));
    });
    setFilteredComps(filteredComps);
  }

  useEffect(() => {
    filterComps();
  }, [eventFilter, characterFilter, regionFilter, teamFilter, playerFilter]);

  return (
    <div className="comps-sorting-container">
      <h3>Sorting</h3>
      <div className="comps-sorting-dropdown-container">
        {/* Sort by Event */}
        <select className="comps-sorting-dropdown" onChange={(e) => setEventFilter(e.target.value)}>
          <option value={defaultEvent}>{defaultEvent}</option>
        {events.map((event, index) => (
          <option key={index} value={event.event_name}>{event.event_name}</option>
        ))}
        </select>
        <div className="custom-dropdown-container">
          {/* Sort by Pokemon */}
          <div id="sorting-pokemon-dropdown">
            <CustomDropdown
              value={characterFilter}
              onChange={setCharacterFilter}
              options={characters}
              placeholder={defaultCharacter}
              disabled={false}
              path="/assets/Draft/headshots"
              defaultOption={defaultCharacter}
            />
          </div>
        </div>
        {/* Sort by Region */}
        <select className="comps-sorting-dropdown" onChange={(e) => setRegionFilter(e.target.value)}>
          <option value={defaultRegion}>{defaultRegion}</option>
          {regions.map((region, index) => (
            <option key={index} value={region}>{region}</option>
          ))}
        </select>
        {/* Sort by Team */}
        <select className="comps-sorting-dropdown" onChange={(e) => setTeamFilter(e.target.value)}>
          <option value={defaultTeam}>{defaultTeam}</option>
          {teams.map((team, index) => (
            <option key={index} value={team.team_name}>{team.team_name}</option>
          ))}
        </select>
        {/* Sort by Player */}
        <select className="comps-sorting-dropdown" onChange={(e) => setPlayerFilter(e.target.value)}>
          <option value={defaultPlayer}>{defaultPlayer}</option>
          {players.map((player, index) => (
            <option key={index} value={player.player_name}>{player.player_name}</option>
            ))}
        </select>
      </div>
    </div>
  )
}

export default Comps;
