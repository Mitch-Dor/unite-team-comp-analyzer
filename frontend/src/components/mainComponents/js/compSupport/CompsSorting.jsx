import { useState, useEffect } from "react";
import CustomDropdown from "./CustomDropdown";
import Home from "../../../sideComponents/js/Home";

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
      const filteredComps = baseData.map(set => {
        // Filter matches within each set
        const filteredMatches = set.matches.filter(comp => {
          return (eventFilter === defaultEvent || comp.event === eventFilter)
            && (characterFilter === defaultCharacter || comp.team1.pokemon.includes(characterFilter.pokemon_name) || comp.team2.pokemon.includes(characterFilter.pokemon_name))
            && (regionFilter === defaultRegion || comp.team1.region === regionFilter || comp.team2.region === regionFilter)
            && (teamFilter === defaultTeam || comp.team1.name === teamFilter || comp.team2.name === teamFilter)
            && (playerFilter === defaultPlayer || comp.team1.players.includes(playerFilter) || comp.team2.players.includes(playerFilter));
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
        <Home />
      </div>
    )
  }

  export default CompsSorting;