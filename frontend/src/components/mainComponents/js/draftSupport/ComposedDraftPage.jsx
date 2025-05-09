import DraftListing from './DraftListing';
import TeamDisplay from './TeamDisplay.jsx';
import Filtering from './Filtering.jsx';

function ComposedDraftPage({ team1Bans, team1Picks, team2Bans, team2Picks, pokemonList, updateFilteredList, targetPokemon, setTargetPokemon, lockIn, updatePokemonStatus, draftProgression, numUsers, settings, filteredList, stateRef, idealTeams1, idealTeams2, setPosition }) {
    return (
        <>
        <div id="purpleDraftContainer" className="draftContainer">
            <TeamDisplay team={'purple'} bans={team1Bans} picks={team1Picks} idealTeams={idealTeams1} side={'purple'} setPosition={setPosition} targetPokemon={targetPokemon} ></TeamDisplay>
        </div>
        <div id="middlePartsContainer">
            <div id="timerContainer">
                <button id="timer">{lockIn ? 'Waiting for draft to start...' : 'No Timer'}</button> 
            </div>
            <div id="draftBoardContainer">
                <Filtering pokemonList={pokemonList} updateFilteredList={updateFilteredList} ></Filtering>
                <div className="characterSelect">
                    <DraftListing pokemonList={filteredList} team1Bans={team1Bans} team2Bans={team2Bans} team1Picks={team1Picks} team2Picks={team2Picks} draftState={stateRef ? stateRef.current : null} updateDraftState={(newState) => { stateRef.current = newState; }} updatePokemonStatus={updatePokemonStatus} draftProgression={draftProgression} numUsers={numUsers} settings={settings} targetPokemon={targetPokemon} setTargetPokemon={setTargetPokemon} />
                </div>
            </div>
            <div id="lockInContainer">
                {lockIn ? (
                    <button id="lockInBTN" className={targetPokemon !== null ? 'active' : ''} onClick={lockIn}>Lock In</button>
                ) : (
                    <button id="lockInBTN">Sandbox: Select Pokemon then Select Position</button>
                )}
            </div>
        </div>
        <div id="orangeDraftContainer" className="draftContainer">
            <TeamDisplay team={'orange'} bans={team2Bans} picks={team2Picks} idealTeams={idealTeams2} side={'orange'} setPosition={setPosition} targetPokemon={targetPokemon} ></TeamDisplay>
        </div>
        </>
    );
}

export default ComposedDraftPage;