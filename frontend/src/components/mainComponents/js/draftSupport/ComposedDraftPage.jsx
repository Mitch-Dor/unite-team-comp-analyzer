import DraftListing from './DraftListing';
import TeamDisplay from './TeamDisplay.jsx';
import Filtering from './Filtering.jsx';

function ComposedDraftPage({ team1Bans, team1Picks, team2Bans, team2Picks, pokemonList, updateFilteredList, targetPokemon, setTargetPokemon, lockIn, updatePokemonStatus, draftProgression, numUsers, settings, filteredList, stateRef, idealTeams1, idealTeams2 }) {
    return (
        <>
        <div id="purpleDraftContainer" className="draftContainer">
            <TeamDisplay team={'purple'} bans={team1Bans} picks={team1Picks} idealTeams={idealTeams1} side={'purple'} ></TeamDisplay>
        </div>
        <div id="middlePartsContainer">
            <div id="timerContainer">
                <button id="timer"></button> 
            </div>
            <div id="draftBoardContainer">
                <Filtering pokemonList={pokemonList} updateFilteredList={updateFilteredList} ></Filtering>
                <div className="characterSelect">
                    <DraftListing pokemonList={filteredList} team1Bans={team1Bans} team2Bans={team2Bans} team1Picks={team1Picks} team2Picks={team2Picks} draftState={stateRef.current} updateDraftState={(newState) => { stateRef.current = newState; }} updatePokemonStatus={updatePokemonStatus} draftProgression={draftProgression} numUsers={numUsers} settings={settings} targetPokemon={targetPokemon} setTargetPokemon={setTargetPokemon} />
                </div>
            </div>
            <div id="lockInContainer">
                <button id="lockInBTN" className={targetPokemon !== null ? 'active' : ''} onClick={lockIn}>Lock In</button>
            </div>
        </div>
        <div id="orangeDraftContainer" className="draftContainer">
            <TeamDisplay team={'orange'} bans={team2Bans} picks={team2Picks} idealTeams={idealTeams2} side={'orange'} ></TeamDisplay>
        </div>
        </>
    );
}

export default ComposedDraftPage;