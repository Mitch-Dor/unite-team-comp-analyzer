import React, { useEffect, useState, useRef } from 'react';
import ComposedDraftPage from './draftSupport/ComposedDraftPage.jsx';
import { fetchCharacterDraftInfo } from './common/http.js';
import '../css/draft.css';
import '../css/classBackgrounds.css';
import { genRandomPokemon } from './draftSupport/draftFunctions.js';
import { getInversePokemon } from './common/common.js';

function SingleDraft() {
    const [settings, setSettings] = useState({
        timer: 25,
        numUsers: 2,
        userTurn: "first",
        draftMode: 'standard',
        disallowedCharacters: []
    });
    const [pokemonList, updatePokemonList] = useState([]);
    const [filteredList, updateFilteredList] = useState([]);
    const [purpleTeamDraft, setPurpleTeamDraft] = useState({bans: [], picks: []});
    const [orangeTeamDraft, setOrangeTeamDraft] = useState({bans: [], picks: []});
    const [draftState, setDraftState] = useState("start");
    const [prevDraftState, setPrevDraftState] = useState("");
    const [timer, setTimer] = useState(String(settings.timer));
    const [loading, setLoading] = useState(true); // Handles while we're loading pokemonList
    const skipNextAdvanceRef = useRef(false);

    const draftProgression = ['team1Ban1', 'team2Ban1', 'team1Ban2', 'team2Ban2', 'team1Ban3', 'team2Ban3', 'team1Pick1', 'team2Pick1', 'team2Pick2', 'team1Pick2', 'team1Pick3', 'team2Pick3', 'team2Pick4', 'team1Pick4', 'team1Pick5', 'team2Pick5', 'done'];
    
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

        fetchCharacterListing();
    }, []); 

    useEffect(() => {
        if(draftState !== 'done' && draftState !== 'start'){
            if ((draftState.includes("team1") && prevDraftState.includes("team1")) || (draftState.includes("team2") && prevDraftState.includes("team2"))){
                if (timer === "0") {
                    // Trigger for double auto pick from running out of time
                    ranOutOfTime();
                }
            }
            setTimer(String(settings.timer));
        } else if (draftState === 'done') {
            setTimer("Done");
        } else {
            setTimer("Waiting...")
        }
    }, [draftState]); // reset the timer any time draftState changes. 

    // Computer's Turn Behavior
    useEffect(() => {
        const isCompTurn = 
            settings.numUsers === 0 || // All AI
            (settings.numUsers === 1 && (
                (settings.userTurn === "first" && draftState.includes("team2")) || 
                (settings.userTurn === "second" && draftState.includes("team1"))
            )); 
        if (isCompTurn) {
            assignPokemon();
        }
    }, [draftState]);

    useEffect(() => {
        const timerElement = document.getElementById("draft-timer");
        if (timerElement){
            timerElement.innerHTML = timer;
        }
        const parsedNumber = Number(timer);
        let timeoutId;

        if (parsedNumber > 0) {
            timeoutId = setTimeout(() => {
                setTimer(String(parsedNumber - 1));
            }, 1000);
        }

        if (parsedNumber === 0) {
            ranOutOfTime();
        }

        return () => clearTimeout(timeoutId);
    }, [timer, loading])

    useEffect(() => {
        if (skipNextAdvanceRef.current) {
            skipNextAdvanceRef.current = false;
            return;
        }
        // Any time the drafts are updated the current stage moves forward once
        if(draftState !== "start") {
            // Make sure state isn't moved when the draft objects are first initialized (page load)
            const currentIndex = draftProgression.indexOf(draftState);
            setDraftState(draftProgression[currentIndex+1]);
            setPrevDraftState(draftProgression[currentIndex]);

        }
    }, [purpleTeamDraft, orangeTeamDraft])

    // When no Pokemon provided, random
    function assignPokemon(pokemon = null) {
        const teamUpdateFunction = draftState.includes("team1")
            ? setPurpleTeamDraft
            : setOrangeTeamDraft;
        const compChoice = pokemon ? pokemon : genRandomPokemon(pokemonList, purpleTeamDraft, orangeTeamDraft, settings.disallowedCharacters);
        if(draftState.includes("Ban1")) { teamUpdateFunction(prev => ({...prev, bans: [...prev.bans, {pokemon: compChoice, position: "ban1"}]}))}
        else if(draftState.includes("Ban2")) { teamUpdateFunction(prev => ({...prev, bans: [...prev.bans, {pokemon: compChoice, position: "ban2"}]}))}
        else if(draftState.includes("Ban3")) { teamUpdateFunction(prev => ({...prev, bans: [...prev.bans, {pokemon: compChoice, position: "ban3"}]}))}
        else if(draftState.includes("Pick1")) { teamUpdateFunction(prev => ({...prev, picks: [...prev.picks, {pokemon: compChoice, position: "pick1"}]}))}
        else if(draftState.includes("Pick2")) { teamUpdateFunction(prev => ({...prev, picks: [...prev.picks, {pokemon: compChoice, position: "pick2"}]}))}
        else if(draftState.includes("Pick3")) { teamUpdateFunction(prev => ({...prev, picks: [...prev.picks, {pokemon: compChoice, position: "pick3"}]}))}
        else if(draftState.includes("Pick4")) { teamUpdateFunction(prev => ({...prev, picks: [...prev.picks, {pokemon: compChoice, position: "pick4"}]}))}
        else if(draftState.includes("Pick5")) { teamUpdateFunction(prev => ({...prev, picks: [...prev.picks, {pokemon: compChoice, position: "pick5"}]}))}
    }

    function ranOutOfTime() {
        // Can just move to next index in draftProgression to keep track of draft state
        const currentIndex = draftProgression.indexOf(draftState);
        // Ensure it's not the last state
        if (currentIndex >= 0 && currentIndex < draftProgression.length - 1) {
            assignPokemon();
        } else {
            console.warn('Draft is already at the final state or invalid state.');
        }
    }

    function lockIn(pokemon){
        assignPokemon(pokemon);
    }

    // Loading message while we're waiting on pokemonList
    if (loading) {
        return <div>Loading...</div>
    }

    function resetDraft(){
        skipNextAdvanceRef.current = true;
        setDraftState('start');
        setPrevDraftState("");
        setPurpleTeamDraft({bans: [], picks: []});
        setOrangeTeamDraft({bans: [], picks: []});
    }

    function startDraft(){
        if (draftState === "done") {
            if (settings.draftMode === "all-star") {
                purpleTeamDraft.picks.forEach(pick => {
                    setSettings((prev => ({
                        ...prev,
                        disallowedCharacters: [...prev.disallowedCharacters, pick.pokemon.pokemon_name]
                    })))
                    const inversePokemon = getInversePokemon(pick.pokemon, pokemonList);
                    if (inversePokemon) {
                        setSettings((prev => ({
                            ...prev,
                            disallowedCharacters: [...prev.disallowedCharacters, inversePokemon.pokemon_name]
                        })))
                    }
                });
                orangeTeamDraft.picks.forEach(pick => {
                    setSettings((prev => ({
                        ...prev,
                        disallowedCharacters: [...prev.disallowedCharacters, pick.pokemon.pokemon_name]
                    })))
                    const inversePokemon = getInversePokemon(pick.pokemon, pokemonList);
                    if (inversePokemon) {
                        setSettings((prev => ({
                            ...prev,
                            disallowedCharacters: [...prev.disallowedCharacters, inversePokemon.pokemon_name]
                        })))
                    }
                });
            }
            resetDraft();
        }
        setDraftState(draftProgression[0]);
        setPrevDraftState("start");
    }

  return (
    <div id="draft-main-container">
        <ComposedDraftPage mode={"standard"} purpleTeamDraft={purpleTeamDraft} orangeTeamDraft={orangeTeamDraft} setPurpleTeamDraft={setPurpleTeamDraft} setOrangeTeamDraft={setOrangeTeamDraft} pokemonList={pokemonList} updatePokemonList={updatePokemonList} updateFilteredList={updateFilteredList} lockIn={lockIn} settings={settings} setSettings={setSettings} filteredList={filteredList} draftState={draftState} resetDraft={resetDraft} startDraft={startDraft} />
    </div>
  );
}

export default SingleDraft;