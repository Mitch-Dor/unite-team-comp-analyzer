import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DraftListing from './draftSupport/DraftListing';
import TeamDisplay from './draftSupport/TeamDisplay.jsx';
import Filtering from './draftSupport/Filtering.jsx';
import { fetchCharacterDisplayInfo } from './backendCalls/http.js';
import '../css/draft.css';

function Draft() {
    const location = useLocation();
    const { numUsers, settings } = location.state || {};
    const [pokemonList, updatePokemonList] = useState([]);
    const [filteredList, updateFilteredList] = useState([]);
    const [team1Bans, updateTeam1Bans] = useState([]);
    const [team2Bans, updateTeam2Bans] = useState([]);
    const [team1Picks, updateTeam1Picks] = useState([]);
    const [team2Picks, updateTeam2Picks] = useState([]);
    const [draftState, updateDraftState] = useState("team1Ban1");
    const [loading, setLoading] = useState(true); // Handles while we're loading pokemonList

    // Populates pokemonList with the return data from getListOfPokemonDisplayInfo() like name, class, id (status is initialized to none but will be changed to team1, team2, ban1, or ban2 to know where to place it and to gray it out) when the component first mounts.
    useEffect(() => {
        async function fetchCharacterListing() {
            try {
                const listing = await fetchCharacterDisplayInfo();
                updatePokemonList(listing);
                updateFilteredList(listing);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching Pokemon Data:", error);
                setLoading(false);
            }
        }

        fetchCharacterListing(); // Call the fetch function to populate pokemonList
        setBackground();
    }, []); // Empty dependency array ensures this runs once when the component mounts

    function updatePokemonStatus(pokemon, newStatus) {
        switch(newStatus) {
            case 'ban1':
                updateTeam1Bans(prevBans => [...prevBans, pokemon]);
                break;
            case 'ban2':
                updateTeam2Bans(prevBans => [...prevBans, pokemon]);
                break;
            case 'team1':
                updateTeam1Picks(prevPicks => [...prevPicks, pokemon]);
                break;
            case 'team2':
                updateTeam2Picks(prevPicks => [...prevPicks, pokemon]);
                break;
        }
    };

    function setBackground(){
        const mainContainer = document.getElementById("root");
        if (mainContainer) {
            let backgroundPath = "/assets/Draft/Background.png";
            mainContainer.style.backgroundImage = `url(${backgroundPath})`;
            mainContainer.style.backgroundSize = "cover";
        }
    }

    // Loading message while we're waiting on pokemonList
    if (loading) {
        return <div>Loading...</div>
    }

  return (
    <div id="draftContainer">
        <div id="purpleDraftContainer" className="draftContainer">
            < TeamDisplay team={'purple'} bans={team1Bans} picks={team1Picks} ></TeamDisplay>
        </div>
        <div id="middlePartsContainer">
            <div id="timerContainer">
                <button id="timer"></button> 
            </div>
            <div id="draftBoardContainer">
                < Filtering pokemonList={pokemonList} updateFilteredList={updateFilteredList} ></Filtering>
                <div className="characterSelect">
                    < DraftListing pokemonList={filteredList} team1Bans={team1Bans}  team2Bans={team2Bans}  team1Picks={team1Picks}  team2Picks={team2Picks} draftState={draftState} updateDraftState={updateDraftState} updatePokemonStatus={updatePokemonStatus} />
                </div>
            </div>
            <div id="lockInContainer">
                <button id="lockInBTN"></button>
            </div>
        </div>
        <div id="orangeDraftContainer" className="draftContainer">
        < TeamDisplay team={'orange'} bans={team2Bans} picks={team2Picks} ></TeamDisplay>
        </div>
    </div>
  );
}

export default Draft;