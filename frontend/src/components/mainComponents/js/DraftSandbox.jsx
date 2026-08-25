import React, { useEffect, useState } from 'react';
import ComposedDraftPage from './draftSupport/ComposedDraftPage.jsx';
import { fetchCharacterDraftInfo } from './common/http.js';
import '../css/draft.css';
import '../css/classBackgrounds.css';

function DraftSandbox() {
    const [pokemonList, updatePokemonList] = useState([]);
    const [filteredList, updateFilteredList] = useState([]);
    const [purpleTeamDraft, setPurpleTeamDraft] = useState({bans: [], picks: []});
    const [orangeTeamDraft, setOrangeTeamDraft] = useState({bans: [], picks: []});
    const [settings, setSettings] = useState({
        numUsers: 2,
        disallowedCharacters: [],
    })
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
    }, []); // Empty dependency array ensures this runs once when the component mounts

    function resetDraft() {
        setPurpleTeamDraft({bans: [], picks: []});
        setOrangeTeamDraft({bans: [], picks: []});
    }
    

    // Loading message while we're waiting on pokemonList
    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <ComposedDraftPage mode={'sandbox'} purpleTeamDraft={purpleTeamDraft} orangeTeamDraft={orangeTeamDraft} setPurpleTeamDraft={setPurpleTeamDraft} setOrangeTeamDraft={setOrangeTeamDraft} pokemonList={pokemonList} updatePokemonList={updatePokemonList} updateFilteredList={updateFilteredList} lockIn={null} settings={settings} setSettings={setSettings} filteredList={filteredList} draftState={null} resetDraft={resetDraft} />
    );
}

export default DraftSandbox;