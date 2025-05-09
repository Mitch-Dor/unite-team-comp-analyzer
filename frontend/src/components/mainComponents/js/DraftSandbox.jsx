import React, { useEffect, useState, useRef } from 'react';
import ComposedDraftPage from './draftSupport/ComposedDraftPage.jsx';
import { fetchCharacterDraftInfo, runAStarAlgorithm } from './backendCalls/http.js';
import Home from '../../sideComponents/js/Home.jsx';
import Settings from '../../sideComponents/js/Settings.jsx';
import '../css/draft.css';

function DraftSandbox() {
    const [pokemonList, updatePokemonList] = useState([]);
    const [filteredList, updateFilteredList] = useState([]);
    const [targetPokemon, setTargetPokemon] = useState(null);
    const [team1Bans, updateTeam1Bans] = useState([]);
    const [team2Bans, updateTeam2Bans] = useState([]);
    const [team1Picks, updateTeam1Picks] = useState([]);
    const [team2Picks, updateTeam2Picks] = useState([]);
    const [loading, setLoading] = useState(true); // Handles while we're loading pokemonList
    
    // Populates pokemonList with the return data from fetchCharacterDraftInfo() like name, class, id (status is initialized to none but will be changed to team1, team2, ban1, or ban2 to know where to place it and to gray it out) when the component first mounts.
    useEffect(() => {
        async function fetchCharacterListing() {
            try {
                const listing = await fetchCharacterDraftInfo();
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

    function setBackground(){
        const mainContainer = document.getElementById("root");
        if (mainContainer) {
            let backgroundPath = "/assets/Draft/Background.png";
            mainContainer.style.backgroundImage = `url(${backgroundPath})`;
            mainContainer.style.backgroundSize = "cover";
        }
    }

    function setPosition(pokemon, team, position){
        switch(team){
            case 'purple': // Team 1
                if(position.includes('ban')){
                    updateTeam1Bans(prevBans => {
                        // Remove any existing pokemon with the same position
                        const filtered = prevBans.filter(item => item.position !== position);
                        return [...filtered, {pokemon, position: position}];
                    });
                } else if(position.includes('pick')){
                    updateTeam1Picks(prevPicks => {
                        // Remove any existing pokemon with the same position
                        const filtered = prevPicks.filter(item => item.position !== position);
                        console.log(prevPicks, filtered);
                        return [...filtered, {pokemon, position: position}];
                    });
                }
                break; // Add break to prevent fall-through
            case 'orange': // Team 2
                if(position.includes('ban')){
                    updateTeam2Bans(prevBans => {
                        // Remove any existing pokemon with the same position
                        const filtered = prevBans.filter(item => item.position !== position);
                        return [...filtered, {pokemon, position: position}];
                    });
                } else if(position.includes('pick')){
                    updateTeam2Picks(prevPicks => {
                        // Remove any existing pokemon with the same position
                        const filtered = prevPicks.filter(item => item.position !== position);
                        return [...filtered, {pokemon, position: position}];
                    });
                }
                break; // Add break to prevent fall-through
        }
        setTargetPokemon(null);
    }
    

    // Loading message while we're waiting on pokemonList
    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div id="draftContainer">
            <ComposedDraftPage team1Bans={team1Bans} team1Picks={team1Picks} team2Bans={team2Bans} team2Picks={team2Picks} pokemonList={pokemonList} updateFilteredList={updateFilteredList} targetPokemon={targetPokemon} setTargetPokemon={setTargetPokemon} setPosition={setPosition} filteredList={filteredList} />
            <Home />
        </div>
    );
}

export default DraftSandbox;