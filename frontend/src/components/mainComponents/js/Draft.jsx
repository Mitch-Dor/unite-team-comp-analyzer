import React, { useEffect, useState } from 'react';
import DraftListing from './draftSupport/DraftListing';
import { fetchCharacterDisplayInfo } from './backendCalls/http.js';
import '../css/draft.css';

function Draft() {
    const [pokemonList, updatePokemonList] = useState([]); // Says pokemonList is updatable with updatePokemonList and is initialized as a blank array (because we have to wait on an async function to give us the data)
    const [loading, setLoading] = useState(true); // Handles while we're loading pokemonList

    // Populates pokemonList with the return data from getListOfPokemonDisplayInfo() like name, class, id (status is initialized to none but will be changed to team1, team2, ban1, or ban2 to know where to place it and to gray it out) when the component first mounts.
    useEffect(() => {
        async function fetchCharacterListing() {
            try {
                const listing = await fetchCharacterDisplayInfo();
                updatePokemonList(listing);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching Pokemon Data:", error);
                setLoading(false);
            }
        }

        fetchCharacterListing(); // Call the fetch function to populate pokemonListwhen d
    }, []); // Empty dependency array ensures this runs once when the component mounts

    function updatePokemonStatus(id, newStatus) {
        updatePokemonList(prevList =>
            prevList.map(pokemon =>
                pokemon.id === id ? { ...pokemon, status: newStatus } : pokemon
            )
        );
    };

    // Loading message while we're waiting on pokemonList
    if (loading) {
        return <div>Loading...</div>
    }

  return (
    <div id="draftContainer">
        <div id="purpleDraftContainer" className="draftContainer">
            <div id="purpleBans">
                <img id="ban1P" className="characterPortrait banDisplay"></img>
                <img id="ban2P" className="characterPortrait banDisplay"></img>
            </div>
            { /* Do this in another component */ }
            <div id="pick1" className="characterSelection purpleSelection">
                <h3>Character</h3>
                <img className="characterPortrait"></img>
            </div>
            <div id="pick2" className="characterSelection purpleSelection">
                <h3>Character</h3>
                <img className="characterPortrait"></img>
            </div>
            <div id="pick3" className="characterSelection purpleSelection">
                <h3>Character</h3>
                <img className="characterPortrait"></img>
            </div>
            <div id="pick4" className="characterSelection purpleSelection">
                <h3>Character</h3>
                <img className="characterPortrait"></img>
            </div>
            <div id="pick5" className="characterSelection purpleSelection">
                <h3>Character</h3>
                <img className="characterPortrait"></img>
            </div>
            {/* These five would be made in a for loop */}
        </div>
        <div id="middlePartsContainer">
            <div id="timerContainer">
                <button id="timer"></button> 
            </div>
            <div id="draftBoardContainer">
                <input type="text" id="searchBar" placeholder="Search..."></input>
                <div className="characterSelect">
                    < DraftListing pokemonList={pokemonList} updatePokemonStatus={updatePokemonStatus} />
                </div>
            </div>
            <div id="lockInContainer">
                <button id="lockInBTN"></button>
            </div>
        </div>
        <div id="orangeDraftContainer" className="draftContainer">
            <div id="orangeBans">
                <img id="ban1O" className="characterPortrait banDisplay"></img>
                <img id="ban2O" className="characterPortrait banDisplay"></img>
            </div>
            <div id="pick1" className="characterSelection orangeSelection">
                <img className="characterPortrait"></img>
                <h3>Character</h3>
            </div>
            <div id="pick2" className="characterSelection orangeSelection">
                <img className="characterPortrait"></img>
                <h3>Character</h3>
            </div>
            <div id="pick3" className="characterSelection orangeSelection">
                <img className="characterPortrait"></img>
                <h3>Character</h3>
            </div>
            <div id="pick4" className="characterSelection orangeSelection">
                <img className="characterPortrait"></img>
                <h3>Character</h3>
            </div>
            <div id="pick5" className="characterSelection orangeSelection">
                <img className="characterPortrait"></img>
                <h3>Character</h3>
            </div>
        </div>
    </div>
  );
}

export default Draft;