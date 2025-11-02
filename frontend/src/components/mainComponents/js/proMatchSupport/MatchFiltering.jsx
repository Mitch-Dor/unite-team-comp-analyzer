import { useState, useEffect } from "react";
import CustomDropdown from "./CustomDropdown";
import Home from "../../../sideComponents/js/Home";
import "../../css/proMatchSupport/matchFiltering.css";

function MatchFiltering({ events, teams, players, charactersAndMoves, coreData, setFilteredData, expandShrinkAllMatches, setExpandShrinkAllMatches }) {
    const [regions, setRegions] = useState([]);
    const [characters, setCharacters] = useState([]);
    const baseData = coreData;
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
      const filteredData = baseData.map(set => {
        // Filter through matches in sets
        const filteredMatches = set.matches.filter(comp => {
          return (eventFilter === defaultEvent || set.event_name === eventFilter)
            && (characterFilter === defaultCharacter || comp.team1_picks.some(pick => pick.pokemon_name === characterFilter.pokemon_name) || comp.team2_picks.some(pick => pick.pokemon_name === characterFilter.pokemon_name))
            && (regionFilter === defaultRegion || comp.team1_region === regionFilter || comp.team2_region === regionFilter)
            && (teamFilter === defaultTeam || comp.team1_name === teamFilter || comp.team2_name === teamFilter)
            && (playerFilter === defaultPlayer || comp.team1_picks.some(pick => pick.player_name === playerFilter) || comp.team2_picks.some(pick => pick.player_name === playerFilter));
        });
  
        // If no matches are left after filtering, exclude this set
        if (filteredMatches.length === 0) {
          return null;
        }
  
        // Return the set with filtered matches
        return {
          ...set,
          matches: filteredMatches
        };
      }).filter(set => set !== null); // Remove null sets
  
      setFilteredData(filteredData);
    }
  
    useEffect(() => {
      filterComps();
    }, [eventFilter, characterFilter, regionFilter, teamFilter, playerFilter]);
  
    return (
      <div className="pro-match-filtering-container">
        {/* Sort by Event */}
        <select id='pro-match-filtering-event-dropdown' className="pro-match-filtering-dropdown" onChange={(e) => setEventFilter(e.target.value)}>
          <option value={defaultEvent}>{defaultEvent}</option>
          {events.map((event, index) => (
            <option key={index} value={event.event_name}>{event.event_name}</option>
          ))}
        </select>
        <div className="pro-match-filtering-custom-dropdown-container">
          {/* Sort by Pokemon */}
          <CustomDropdown
            value={characterFilter}
            onChange={setCharacterFilter}
            options={characters}
            placeholder={defaultCharacter}
            disabled={false}
            path="/assets/Draft/headshots"
          />
        </div>
        {/* Sort by Region */}
        <select id='pro-match-filtering-region-dropdown' className="pro-match-filtering-dropdown" onChange={(e) => setRegionFilter(e.target.value)}>
          <option value={defaultRegion}>{defaultRegion}</option>
          {regions.map((region, index) => (
            <option key={index} value={region}>{region}</option>
          ))}
        </select>
        {/* Sort by Team */}
        <select id='pro-match-filtering-team-dropdown' className="pro-match-filtering-dropdown" onChange={(e) => setTeamFilter(e.target.value)}>
          <option value={defaultTeam}>{defaultTeam}</option>
          {teams.map((team, index) => (
            <option key={index} value={team.team_name}>{team.team_name}</option>
          ))}
        </select>
        {/* Sort by Player */}
        <select id='pro-match-filtering-player-dropdown' className="pro-match-filtering-dropdown" onChange={(e) => setPlayerFilter(e.target.value)}>
          <option value={defaultPlayer}>{defaultPlayer}</option>
          {players.map((player, index) => (
            <option
              key={index}
              value={
                player.player_name.replace(
                  player.other_names ? ` (${player.other_names})` : "",
                  ""
                )
              }
            >
              {player.player_name}
            </option>
          ))}
        </select>
        <button className="pro-match-expand-shrink-all-matches-button" onClick={() => setExpandShrinkAllMatches(prev => !prev)}>
            {expandShrinkAllMatches ? "Shrink All" : "Expand All"}
        </button>
        <Home />
      </div>
    )
  }

  export default MatchFiltering;