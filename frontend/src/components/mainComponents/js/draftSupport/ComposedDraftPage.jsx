import DraftListing from './DraftListing';
import TeamDisplay from './TeamDisplay.jsx';
import DraftFiltering from './DraftFiltering.jsx';
import Home from "../../../sideComponents/js/Home";
import Settings from '../../../sideComponents/js/Settings.jsx';
import "../../css/draftSupport/composedDraftPage.css";
import { MdOutlineRestartAlt } from "react-icons/md";

function ComposedDraftPage({ team1Bans, team1Picks, team2Bans, team2Picks, pokemonList, updatePokemonList, updateFilteredList, targetPokemon, setTargetPokemon, lockIn, settings, setSettings, filteredList, stateRef, setPosition, setTeam1Picks, setTeam2Picks, resetDraft }) {
    return (
        <div id="draft-page-container">
            <div id="draft-left-column-container" className="draft-side-container">
                <div className="draft-corner-information-container">
                    <div id="draft-timer">{lockIn ? 'Waiting for draft to start...' : 'No Timer'}</div> 
                    <div id="draft-page-logo">Unite-Pro</div>
                </div>
                <div id="purple-team-container" className="draft-team-container">
                    <TeamDisplay team={'purple'} bans={team1Bans} picks={team1Picks} setPosition={setPosition} targetPokemon={targetPokemon} setTeam={setTeam1Picks} pokemonList={pokemonList} settings={settings} ></TeamDisplay>
                </div>
            </div>
            <div id="draft-middle-parts-container">
                <DraftFiltering pokemonList={pokemonList} updateFilteredList={updateFilteredList} updatePokemonList={updatePokemonList} />
                <DraftListing pokemonList={filteredList} team1Bans={team1Bans} team2Bans={team2Bans} team1Picks={team1Picks} team2Picks={team2Picks} draftState={stateRef ? stateRef.current : null} settings={settings} targetPokemon={targetPokemon} setTargetPokemon={setTargetPokemon} />
            </div>
            <div id="draft-right-column-container"  className="draft-side-container">
                <div className="draft-corner-information-container">
                    <Home />
                    <Settings pokemonList={pokemonList} settings={settings} updateSettings={setSettings} />
                    <button id="draft-restart-button" onClick={() => {resetDraft()}}><MdOutlineRestartAlt /></button>
                </div>
                <div id="orange-team-container" className="draft-team-container">
                    <TeamDisplay team={'orange'} bans={team2Bans} picks={team2Picks} setPosition={setPosition} targetPokemon={targetPokemon} setTeam={setTeam2Picks} pokemonList={pokemonList} settings={settings} ></TeamDisplay>
                </div>
            </div>
        </div>
    )
}

export default ComposedDraftPage;