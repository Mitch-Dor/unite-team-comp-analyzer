import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import DraftListing from './draftSupport/DraftListing';
import TeamDisplay from './draftSupport/TeamDisplay.jsx';
import Filtering from './draftSupport/Filtering.jsx';
import { fetchCharacterDisplayInfo, runAStarAlgorithm } from './backendCalls/http.js';
import '../css/draft.css';

function Draft() {
    const location = useLocation();
    const { numUsers, settings } = location.state || {};
    const [pokemonList, updatePokemonList] = useState([]);
    const [filteredList, updateFilteredList] = useState([]);
    const [targetPokemon, setTargetPokemon] = useState(null);
    const [team1Bans, updateTeam1Bans] = useState([]);
    const [team2Bans, updateTeam2Bans] = useState([]);
    const [team1Picks, updateTeam1Picks] = useState([]);
    const [team2Picks, updateTeam2Picks] = useState([]);
    const [draftState, updateDraftState] = useState("team1Ban1");
    const [idealComp, updateIdealComp] = useState(null);
    const [loading, setLoading] = useState(true); // Handles while we're loading pokemonList
    const stateRef = useRef(null); // Ref to track the latest state
    const targetPokemonRef = useRef(null); // Ref to track the latest targetPokemon

    // Update the ref whenever targetPokemon changes
    useEffect(() => {
        targetPokemonRef.current = targetPokemon;
        console.log(team1Bans, team2Bans, team1Picks, team2Picks);
    }, [targetPokemon]);

    const draftProgression = ['team1Ban1', 'team2Ban1', 'team1Ban2', 'team2Ban2', 'team1Pick1', 'team2Pick1', 'team2Pick2', 'team1Pick2', 'team1Pick3', 'team2Pick3', 'team2Pick4', 'team1Pick4', 'team1Pick5', 'team2Pick5', 'done'];

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

    useEffect(() => {
        if (!loading) {
            if(draftState !== 'done'){
                document.getElementById("timer").innerHTML = settings.timer;
                stateRef.current = draftState; // Update the ref to the latest state
                countdownTimer();
            } else {
                document.getElementById("timer").innerHTML = 'Done';
            }
        }
    }, [draftState, loading]); // reset the timer any time draft state changes

    // Handles the AI's turn
    useEffect(() => {
        if (draftState !== 'done'){
            if(numUsers == 0) {
                // It's all AI just let them do their thing
                const handleAITurn = async () => {
                    const choiceAI = await pickAI();
                    setTargetPokemon(choiceAI);
                };
                handleAITurn();
            } else if (numUsers == 1) {
                if ((settings.userTurn === "first" && draftState.includes("team2")) || (settings.userTurn === "second" && draftState.includes("team1"))){
                    // There is a user but it's the AI's turn
                    const handleAITurn = async () => {
                        const choiceAI = await pickAI();
                        setTargetPokemon(choiceAI);
                    };
                    handleAITurn();
                }
            }
        }
    }, [draftState]);


    // Lock in the AI pick once it has made it
    useEffect(() => {
        if (targetPokemon !== null){
            if (draftState !== 'done'){
                if(numUsers == 0) {
                    // It's all AI just let them do their thing
                    lockIn();
                } else if (numUsers == 1) {
                    if ((settings.userTurn === "first" && draftState.includes("team2")) || (settings.userTurn === "second" && draftState.includes("team1"))){
                        // There is a user but it's the AI's turn
                        lockIn();
                    }
                }
            }
        }
    }, [targetPokemon]);

    // Picks the AI's pokemon
    const pickAI = async () => {
        try {
            // Create arrays of objects from the ban and team states
            const allBans = [...team1Bans, ...team2Bans];
            
            let targetTeam = [];
            let opposingTeam = [];
            
            if (draftState.startsWith('team1')) {
                targetTeam = team1Picks;
                opposingTeam = team2Picks;
            } else {
                targetTeam = team2Picks;
                opposingTeam = team1Picks;
            }
            
            // Call the imported runAStarAlgorithm function
            const idealTeam = await runAStarAlgorithm(targetTeam, opposingTeam, allBans);
            console.log("AI recommended team:", idealTeam);
            updateIdealComp(idealTeam);
            
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
            return genRandomPokemon();
        } catch (error) {
            console.error("Error in AI pick:", error);
            return genRandomPokemon();
        }
    }

    function genRandomPokemon() {
        const randIndex = Math.floor(Math.random() * pokemonList.length);
        const pokemon = pokemonList[randIndex];
        if (!team1Bans.includes(pokemon) && !team2Bans.includes(pokemon) && !team1Picks.includes(pokemon) && !team2Picks.includes(pokemon)) {
            return pokemon;
        } 
        return genRandomPokemon();
    }

    function countdownTimer() {
        if(stateRef.current !== 'done'){
            const timer = document.getElementById("timer");
            const currTime = Number(timer.innerHTML);
            if(currTime > 0){
                timer.innerHTML = currTime - 1;
                setTimeout(() => {
                    if (stateRef.current === draftState) {
                        countdownTimer(); // Continue countdown
                    }
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
        const currentIndex = draftProgression.indexOf(draftState);
        // Ensure it's not the last state
        if (currentIndex >= 0 && currentIndex < draftProgression.length - 1) {
            // Get the next state
            const nextState = draftProgression[currentIndex + 1];
            // Update the draft state
            updateDraftState(nextState);
            const none = {pokemon_name: 'none', pokemon_class: 'none'};

            let actionPokemon = none;
            if (targetPokemonRef.current !== null){
                actionPokemon = targetPokemonRef.current;
            } else if (draftState.startsWith('team1Pick') || draftState.startsWith('team2Pick')){
                actionPokemon = genRandomPokemon();
            } else if (draftState.startsWith('team1Ban') || draftState.startsWith('team2Ban')){
                actionPokemon = none;
            }
            // Perform the action based on the current state
            switch (draftState) {
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
                    console.error('Unhandled draft state:', draftState);
            }
        } else {
            console.warn('Draft is already at the final state or invalid state.');
        }
    }

    function lockIn(){
        if(targetPokemon !== null){
            switch (draftState) {
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
                    console.error('Unhandled draft state:', draftState);
            }
        }
    }

    function genRandomPokemon() {
        const randIndex = Math.floor(Math.random() * pokemonList.length);
        const pokemon = pokemonList[randIndex];
        if (!team1Bans.includes(pokemon) && !team2Bans.includes(pokemon) && !team1Picks.includes(pokemon) && !team2Picks.includes(pokemon)) {
            return pokemon;
        } 
        return genRandomPokemon();
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
        const currentIndex = draftProgression.indexOf(draftState);
        if (currentIndex >= 0 && currentIndex < draftProgression.length - 1) {
            const nextState = draftProgression[currentIndex + 1];
            updateDraftState(nextState);
        }
        // Reset the targetPokemon
        setTargetPokemon(null);
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
                    < DraftListing pokemonList={filteredList} team1Bans={team1Bans}  team2Bans={team2Bans}  team1Picks={team1Picks}  team2Picks={team2Picks} draftState={draftState} updateDraftState={updateDraftState} updatePokemonStatus={updatePokemonStatus} draftProgression={draftProgression} numUsers={numUsers} settings={settings} targetPokemon={targetPokemon} setTargetPokemon={setTargetPokemon} />
                </div>
            </div>
            <div id="lockInContainer">
                <button id="lockInBTN" className={targetPokemon !== null ? 'active' : ''} onClick={() => {lockIn()}}>Lock In</button>
            </div>
        </div>
        <div id="orangeDraftContainer" className="draftContainer">
        < TeamDisplay team={'orange'} bans={team2Bans} picks={team2Picks} ></TeamDisplay>
        </div>
    </div>
  );
}

export default Draft;