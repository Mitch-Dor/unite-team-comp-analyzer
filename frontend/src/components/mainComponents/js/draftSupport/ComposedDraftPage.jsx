import DraftListing from './DraftListing';
import TeamDisplay from './TeamDisplay.jsx';
import DraftFiltering from './DraftFiltering.jsx';
import "../../css/draftSupport/composedDraftPage.css";

function ComposedDraftPage({ team1Bans, team1Picks, team2Bans, team2Picks, pokemonList, updatePokemonList, updateFilteredList, targetPokemon, setTargetPokemon, lockIn, numUsers, settings, filteredList, stateRef, idealTeams1, idealTeams2, setPosition, setTeam1Picks, setTeam2Picks }) {
    return (
        <>
        <div id="draft-composed-page-purple-team-container" className="draft-composed-page-team-draft-container">
            <TeamDisplay team={'purple'} bans={team1Bans} picks={team1Picks} idealTeams={idealTeams1} side={'purple'} setPosition={setPosition} targetPokemon={targetPokemon} setTeam={setTeam1Picks} pokemonList={pokemonList} settings={settings} ></TeamDisplay>
        </div>
        <div id="draft-composed-page-middle-parts-container">
            <div id="draft-composed-page-timer-container">
                <button id="draft-composed-page-timer">{lockIn ? 'Waiting for draft to start...' : 'No Timer'}</button> 
            </div>
            <div id="draft-composed-page-draft-board-container">
                <DraftFiltering pokemonList={pokemonList} updateFilteredList={updateFilteredList} updatePokemonList={updatePokemonList} />
                <DraftListing pokemonList={filteredList} team1Bans={team1Bans} team2Bans={team2Bans} team1Picks={team1Picks} team2Picks={team2Picks} draftState={stateRef ? stateRef.current : null} numUsers={numUsers} settings={settings} targetPokemon={targetPokemon} setTargetPokemon={setTargetPokemon} />
            </div>
            <div id="draft-composed-page-lock-in-container">
                {lockIn ? (
                    <button id="draft-composed-page-lock-in-button" className={targetPokemon !== null ? 'active' : ''} onClick={lockIn}>Lock In</button>
                ) : (
                    <button id="draft-composed-page-lock-in-button">Sandbox: Select Pokemon then Select Position</button>
                )}
            </div>
        </div>
        <div id="draft-composed-page-orange-team-container" className="draft-composed-page-team-draft-container">
            <TeamDisplay team={'orange'} bans={team2Bans} picks={team2Picks} idealTeams={idealTeams2} side={'orange'} setPosition={setPosition} targetPokemon={targetPokemon} setTeam={setTeam2Picks} pokemonList={pokemonList} settings={settings} ></TeamDisplay>
        </div>
        </>
    );
}

export default ComposedDraftPage;