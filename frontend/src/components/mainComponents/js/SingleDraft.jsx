import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ComposedDraftPage from './draftSupport/ComposedDraftPage.jsx';
import { fetchCharacterDraftInfo, runAStarAlgorithm, fetchAllTierListEntries } from './backendCalls/http.js';
import Home from '../../sideComponents/js/Home.jsx';
import Settings from '../../sideComponents/js/Settings.jsx';
import '../css/draft.css';
import DraftAgain from './draftSupport/DraftAgain.jsx';
import { genRandomPokemon, checkIfSpecialCase } from './draftSupport/draftFunctions.js';

function SingleDraft() {
    const location = useLocation();
    const [draftingActive, setDraftingActive] = useState(false);
    const [numUsers, setNumUsers] = useState(location.state.numUsers);
    const [settings, setSettings] = useState(location.state.settings);
    const [pokemonList, updatePokemonList] = useState([]);
    const [filteredList, updateFilteredList] = useState([]);
    const [targetPokemon, setTargetPokemon] = useState(null);
    const [team1Bans, updateTeam1Bans] = useState([]);
    const [team2Bans, updateTeam2Bans] = useState([]);
    const [team1Picks, updateTeam1Picks] = useState([]);
    const [team2Picks, updateTeam2Picks] = useState([]);
    const stateRef = useRef("");
    const [loading, setLoading] = useState(true); // Handles while we're loading pokemonList
    const targetPokemonRef = useRef(null); // Ref to track the latest targetPokemon
    const timerRef = useRef(null); // Ref to store the timer timeout ID
    const aiPickTimeoutRef = useRef(null);
    const aiBanTimeoutRef = useRef(null);
    const [disallowedCharacters, updateDisallowedCharacters] = useState([]);
    const [idealTeams1, updateIdealTeams1] = useState([]);
    const [idealTeams2, updateIdealTeams2] = useState([]);
    const tierList = useRef([]);

    // Update the ref whenever targetPokemon changes
    useEffect(() => {
        targetPokemonRef.current = targetPokemon;
    }, [targetPokemon]);

    const draftProgression = ['team1Ban1', 'team2Ban1', 'team1Ban2', 'team2Ban2', 'team1Pick1', 'team2Pick1', 'team2Pick2', 'team1Pick2', 'team1Pick3', 'team2Pick3', 'team2Pick4', 'team1Pick4', 'team1Pick5', 'team2Pick5', 'done'];
    const firstTurns = ['team1Pick1', 'team2Pick1', 'team1Pick2', 'team2Pick3', 'team1Pick4', 'team2Pick5']
    
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

        async function fetchTierList(){
            try {
                const foundTierList = await fetchAllTierListEntries();
                // Create an array that has an array of each tier (S, A-F) and fill it with the pokemon_id's that are in that tier
                const tierListFilled = [];
                foundTierList.forEach(entry => {
                    if (!tierListFilled[entry.tier_name]) {
                        tierListFilled[entry.tier_name] = [];
                    }
                    tierListFilled[entry.tier_name].push(entry.pokemon_id);
                });
                tierList.current = tierListFilled;
            } catch (error) {
                console.error("Error fetching Tier List:", error);
            }
        }

        fetchCharacterListing(); // Call the fetch function to populate pokemonList
        fetchTierList();
        updateDisallowedCharacters(settings.disallowedCharacters);
    }, []); // Empty dependency array ensures this runs once when the component mounts

    useEffect(() => {
        if (!loading && draftingActive) {
            if(stateRef.current !== 'done'){
                const timerElement = document.getElementById("timer");
                if (timerElement) {
                    timerElement.innerHTML = settings.timer;
                    countdownTimer();
                }
            } else {
                const timerElement = document.getElementById("timer");
                if (timerElement) {
                    timerElement.innerHTML = 'Done';
                }
            }
        }
        
        // Cleanup function to clear the timeout when component unmounts or draft state changes
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [stateRef.current, loading, draftingActive]); // reset the timer any time stateRef.current changes. Loading and draftingActive are to make sure the timer only starts once the component is mounted and the settings have been selected

    useEffect(() => {
        if (draftingActive){
            stateRef.current = "team1Ban1";
        }
    }, [draftingActive]);

    // Lock in the AI pick once it has made it
    useEffect(() => {
        if (targetPokemon !== null && stateRef.current !== 'done'){
            // Determine if it's AI's turn
            const isAITurn = 
                numUsers === 0 || // All AI
                (numUsers === 1 && (
                    (settings.userTurn === "first" && stateRef.current.includes("team2")) || 
                    (settings.userTurn === "second" && stateRef.current.includes("team1"))
                ));
                
            if (isAITurn) {
                // Auto lock-in for AI turns (both picks and bans)
                lockIn();
            }
        }
    }, [targetPokemon]);

    // Handle the AI's turn
    useEffect(() => {
        if (!draftingActive){
            return;
        }
        if (!stateRef.current.includes("Ban") && !stateRef.current.includes("done")){ // Don't generate during ban phase
            if (numUsers == 2){
                // It is a user turn so generate an ideal team each time
                genIdealTeam();
            } else if (numUsers == 1) {
                if ((settings.userTurn === "first" && stateRef.current.includes("team1")) || (settings.userTurn === "second" && stateRef.current.includes("team2"))){
                    // It is a user turn so generate an ideal team each time
                    genIdealTeam();
                } else {
                    // It is the AI's turn so generate an ideal team
                    genIdealTeam();
                }
            } else if (firstTurns.includes(stateRef.current)){
                // AI branch
                // These are the start of a team's turn to pick either one or two pokemon, so gen the best team
                genIdealTeam();
            }
        }
        
        // Handle AI bans
        if (stateRef.current.includes("Ban") && !loading && pokemonList.length > 0){
            // Determine if it's AI's turn to ban
            const isAIBanTurn = 
                numUsers === 0 || // All AI
                (numUsers === 1 && (
                    (settings.userTurn === "first" && stateRef.current.includes("team2")) || 
                    (settings.userTurn === "second" && stateRef.current.includes("team1"))
                ));
                
            if (isAIBanTurn) {
                // Ban some random highest tier pokemon
                aiBanTimeoutRef.current = setTimeout(() => {
                    function genRandomSTierPokemon(){
                        // Get the S tier pokemon from the tier list
                        let sTier = tierList.current.S;
                        // Choose a random S tier pokemon
                        const randomPokemon = sTier[Math.floor(Math.random() * sTier.length)];
                        // Fill out the pokemon object
                        // sTier is an array of pokemon_id's, so we need to find the pokemon in pokemonList that has that pokemon_id
                        const sTierPokemon = pokemonList.find(p => p.pokemon_id === randomPokemon);
                        // Make sure it is not something already banned or special case
                        if (!team1Bans.includes(sTierPokemon) && !team2Bans.includes(sTierPokemon) && !disallowedCharacters.includes(sTierPokemon) && !checkIfSpecialCase(sTierPokemon, team1Bans, team2Bans, team1Picks, team2Picks)) {
                            setTargetPokemon(sTierPokemon);
                        } else {
                            // If it is something already banned or special case, try again
                            genRandomSTierPokemon();
                        }
                    }
                    genRandomSTierPokemon();
                }, 3000);

                // Cleanup function to destroy timeout if user leaves the page
                return () => {
                    if (aiBanTimeoutRef.current) {
                        clearTimeout(aiBanTimeoutRef.current);
                    }
                };
            }
        }
    }, [stateRef.current, pokemonList, loading, disallowedCharacters, draftingActive]);

    useEffect(() => {
        if (idealTeams1.length > 0 || idealTeams2.length > 0){
            if (numUsers == 0 || (numUsers == 1 && stateRef.current.includes("team1") && settings.userTurn === "second") || (numUsers == 1 && stateRef.current.includes("team2") && settings.userTurn === "first")){
                // If it is AI's turn, pick the next pokemon from their latest ideal team after a delay
                // Set a timeout for 3 seconds before executing AI pick
                
                aiPickTimeoutRef.current = setTimeout(() => {
                    // Choose the first Pokemon
                    if (numUsers == 1) {
                        if (settings.userTurn === "second" && stateRef.current.includes("team1")) {
                            if (idealTeams1.length > 0) {
                                const nextPokemon = pickAI(idealTeams1[idealTeams1.length - 1]);
                                setTargetPokemon(nextPokemon);
                            }
                        } else if (settings.userTurn === "first" && stateRef.current.includes("team2")) {
                            if (idealTeams2.length > 0) {
                                const nextPokemon = pickAI(idealTeams2[idealTeams2.length - 1]);
                                setTargetPokemon(nextPokemon);
                            }
                        }
                    } else if (numUsers == 0) {
                        if (stateRef.current.includes("team1")) {
                            if (idealTeams1.length > 0) {
                                const nextPokemon = pickAI(idealTeams1[idealTeams1.length - 1]);
                                setTargetPokemon(nextPokemon);
                            }
                        } else if (stateRef.current.includes("team2")) {
                            if (idealTeams2.length > 0) {
                                const nextPokemon = pickAI(idealTeams2[idealTeams2.length - 1]);
                                setTargetPokemon(nextPokemon);
                            }
                        }
                    }
                }, 3000);
                
                // Cleanup function to destroy timeouts if user leaves the page
                return () => {
                    if (aiPickTimeoutRef.current) {
                        clearTimeout(aiPickTimeoutRef.current);
                    }
                };
            }
        }
    }, [idealTeams1, idealTeams2]);

    // Handle the case where the AI needs to pick twice in a row
    useEffect(() => {
        const isAITurn = 
                numUsers === 0 || // All AI
                (numUsers === 1 && (
                    (settings.userTurn === "first" && stateRef.current.includes("team2")) || 
                    (settings.userTurn === "second" && stateRef.current.includes("team1"))
                ));
        if (isAITurn){
            const currIndex = draftProgression.indexOf(stateRef.current);
            if (currIndex > 0){
                const prevState = draftProgression[currIndex - 1];
                if ((prevState.includes("team1") && stateRef.current.includes("team1")) || (prevState.includes("team2") && stateRef.current.includes("team2"))){
                    // Ai needs to pick again, add the most recent ideal team to the list again
                    if (stateRef.current.includes("team1")){
                        updateIdealTeams1(prevTeams => [...prevTeams, idealTeams1[idealTeams1.length - 1]]);
                    } else {
                        updateIdealTeams2(prevTeams => [...prevTeams, idealTeams2[idealTeams2.length - 1]]);
                    }
                }
            }
        }
    }, [stateRef.current]);

    async function genIdealTeam(){
        // Create arrays of objects from the ban and team states
        // Just treat disallowed characters as bans, makes no difference in the algorithm
        const allBans = [...team1Bans, ...team2Bans, ...disallowedCharacters];
        
        let targetTeam = [];
        let opposingTeam = [];
        
        if (stateRef.current.startsWith('team1')) {
            targetTeam = team1Picks;
            opposingTeam = team2Picks;
        } else {
            targetTeam = team2Picks;
            opposingTeam = team1Picks;
        }
        
        // Save the current state
        const currentState = stateRef.current;

        // Call the imported runAStarAlgorithm function
        const idealTeam = await runAStarAlgorithm(targetTeam, opposingTeam, allBans);
        // Append the team to the side that is picking
        if (currentState.startsWith('team1')){
            updateIdealTeams1(prevTeams => [...prevTeams, idealTeam]);
        } else {
            updateIdealTeams2(prevTeams => [...prevTeams, idealTeam]);
        }
    }

    // Picks the AI's pokemon
    function pickAI(idealTeam){
        try {
            // If the algorithm returned a recommended team, choose the first pokemon 
            // that isn't already picked or banned
            if (idealTeam && idealTeam.length > 0) {
                // Find a pokemon from idealTeam that isn't already picked or banned
                for (const recommendedPokemon of idealTeam) {
                    const pokemonExists = pokemonList.find(p => 
                        p.pokemon_name.toLowerCase() === recommendedPokemon.pokemon_name.toLowerCase()
                    );
                    
                    if (pokemonExists) {
                        const alreadySelected = [...team1Picks, ...team2Picks, ...team1Bans, ...team2Bans]
                            .some(p => p.pokemon_name.toLowerCase() === pokemonExists.pokemon_name.toLowerCase());
                            
                        if (!alreadySelected) {
                            return pokemonExists;
                        }
                    }
                }
            }
            
            // Fallback to random selection if no valid recommendation
            return genRandomPokemon(pokemonList, team1Bans, team2Bans, team1Picks, team2Picks, disallowedCharacters);
        } catch (error) {
            console.error("Error in AI pick:", error);
            return genRandomPokemon(pokemonList, team1Bans, team2Bans, team1Picks, team2Picks, disallowedCharacters);
        }
    }

    function countdownTimer() {
        if(stateRef.current !== 'done'){
            const timer = document.getElementById("timer");
            if (!timer) return; // Exit if timer element doesn't exist
            
            const currTime = Number(timer.innerHTML);
            if(currTime > 0){
                timer.innerHTML = currTime - 1;
                timerRef.current = setTimeout(() => {
                    countdownTimer(); // Continue countdown
                }, 1000);
            } else {
                if(Number.isNaN(currTime)){
                    return;
                }
                ranOutOfTime();
            }
        }
    }

    function ranOutOfTime() {
        // Can just move to next index in draftProgression to keep track of draft state
        const currentIndex = draftProgression.indexOf(stateRef.current);
        // Ensure it's not the last state
        if (currentIndex >= 0 && currentIndex < draftProgression.length - 1) {
            // Get the next state
            const none = {pokemon_name: 'none', pokemon_class: 'none'};

            let actionPokemon = none;
            if (targetPokemonRef.current !== null){
                actionPokemon = targetPokemonRef.current;
            } else if (stateRef.current.startsWith('team1Pick') || stateRef.current.startsWith('team2Pick')){
                actionPokemon = genRandomPokemon(pokemonList, team1Bans, team2Bans, team1Picks, team2Picks, disallowedCharacters);
            } else if (stateRef.current.startsWith('team1Ban') || stateRef.current.startsWith('team2Ban')){
                actionPokemon = none;
            }
            // Perform the action based on the current state
            switch (stateRef.current) {
                case 'team1Ban1':
                case 'team1Ban2':
                    updatePokemonStatus(actionPokemon, 'ban1');
                    break;
                case 'team2Ban1':
                case 'team2Ban2':
                    updatePokemonStatus(actionPokemon, 'ban2');
                    break;
                case 'team1Pick1':
                case 'team1Pick2':
                case 'team1Pick3':
                case 'team1Pick4':
                case 'team1Pick5':
                    updatePokemonStatus(actionPokemon, 'team1');
                    break;
                case 'team2Pick1':
                case 'team2Pick2':
                case 'team2Pick3':
                case 'team2Pick4':
                case 'team2Pick5':
                    updatePokemonStatus(actionPokemon, 'team2');
                    break;
                default:
                    console.error('Unhandled draft state:', stateRef.current);
            }
        } else {
            console.warn('Draft is already at the final state or invalid state.');
        }
    }

    function lockIn(){
        if(targetPokemon === null){
            console.warn("Cannot lock in: No Pokemon selected");
            return;
        }
        
        switch (stateRef.current) {
            case 'team1Ban1':
            case 'team1Ban2':
                updatePokemonStatus(targetPokemon, 'ban1');
                break;
            case 'team2Ban1':
            case 'team2Ban2':
                updatePokemonStatus(targetPokemon, 'ban2');
                break;
            case 'team1Pick1':
            case 'team1Pick2':
            case 'team1Pick3':
            case 'team1Pick4':
            case 'team1Pick5':
                updatePokemonStatus(targetPokemon, 'team1');
                break;
            case 'team2Pick1':
            case 'team2Pick2':
            case 'team2Pick3':
            case 'team2Pick4':
            case 'team2Pick5':
                updatePokemonStatus(targetPokemon, 'team2');
                break;
            default:
                console.error('Unhandled draft state:', stateRef.current);
        }
    }

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
        // Move the draft to the next state
        const currentIndex = draftProgression.indexOf(stateRef.current);
        if (currentIndex >= 0 && currentIndex < draftProgression.length - 1) {
            const nextState = draftProgression[currentIndex + 1];
            stateRef.current = nextState;
        }
        // Reset the targetPokemon
        setTargetPokemon(null);
    };

    // Loading message while we're waiting on pokemonList
    if (loading) {
        return <div>Loading...</div>
    }

    function draftAgain(){
        stateRef.current = 'team1Ban1';
        setTargetPokemon(null);
        updateTeam1Bans([]);
        updateTeam2Bans([]);
        updateTeam1Picks([]);
        updateTeam2Picks([]);
        updateIdealTeams1([]);
        updateIdealTeams2([]);
    }

  return (
    <div id="draftContainer">
        {!draftingActive && (
            <div id="settingsScreenCover">
                <div id="setSettings" onClick={(e) => e.stopPropagation()}>
                < Settings numUsers={numUsers} setNumUsers={setNumUsers} settings={settings} updateSettings={setSettings} startDraft={setDraftingActive} ></Settings>
            </div>
          </div>
        )}
        {stateRef.current === 'done' && (
            <DraftAgain draftAgain={draftAgain} />
        )}
        <ComposedDraftPage team1Bans={team1Bans} team1Picks={team1Picks} team2Bans={team2Bans} team2Picks={team2Picks} pokemonList={pokemonList} updateFilteredList={updateFilteredList} targetPokemon={targetPokemon} setTargetPokemon={setTargetPokemon} lockIn={lockIn} numUsers={numUsers} settings={settings} filteredList={filteredList} stateRef={stateRef} idealTeams1={idealTeams1} idealTeams2={idealTeams2} setTeam1Picks={updateTeam1Picks} setTeam2Picks={updateTeam2Picks} />
        <Home />
    </div>
  );
}

export default SingleDraft;