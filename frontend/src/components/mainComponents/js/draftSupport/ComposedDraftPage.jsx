import { useState } from 'react';
import DraftListing from './DraftListing';
import TeamDisplay from './TeamDisplay.jsx';
import DraftFiltering from './DraftFiltering.jsx';
import Home from "../../../sideComponents/js/Home";
import Settings from '../../../sideComponents/js/Settings.jsx';
import "../../css/draftSupport/composedDraftPage.css";
import { MdOutlineRestartAlt } from "react-icons/md";
import { FaPlay } from 'react-icons/fa'; 

function ComposedDraftPage({ mode, purpleTeamDraft, setPurpleTeamDraft, orangeTeamDraft, setOrangeTeamDraft, pokemonList, updatePokemonList, updateFilteredList, lockIn, settings, setSettings, filteredList, draftState, resetDraft, startDraft }) {
    const [targetPokemon, setTargetPokemon] = useState(null);
    
    return (
        <div id="draft-page-container">
            <div id="draft-left-column-container" className="draft-side-container">
                <div className="draft-corner-information-container">
                    <div id="draft-timer"></div> 
                    <div id="draft-page-logo">Unite-Pro</div>
                </div>
                <div id="purple-team-container" className="draft-team-container">
                    <TeamDisplay mode={mode} team={'purple'} draft={purpleTeamDraft} setDraft={setPurpleTeamDraft} targetPokemon={targetPokemon} setTargetPokemon={setTargetPokemon} pokemonList={pokemonList} settings={settings} ></TeamDisplay>
                </div>
            </div>
            <div id="draft-middle-parts-container">
                <DraftFiltering pokemonList={pokemonList} updateFilteredList={updateFilteredList} updatePokemonList={updatePokemonList} />
                <DraftListing mode={mode} pokemonList={filteredList} purpleTeamDraft={purpleTeamDraft} orangeTeamDraft={orangeTeamDraft} draftState={draftState} settings={settings} targetPokemon={targetPokemon} setTargetPokemon={setTargetPokemon} lockIn={lockIn} />
            </div>
            <div id="draft-right-column-container"  className="draft-side-container">
                <div className="draft-corner-information-container">
                    <Home />
                    <Settings pokemonList={pokemonList} settings={settings} updateSettings={setSettings} mode={mode} />
                    <button id="draft-restart-button" onClick={() => {resetDraft()}}><MdOutlineRestartAlt /></button>
                    {mode === "standard" && (
                        <button id="draft-start-button" onClick={() => {startDraft()}}>< FaPlay /></button>
                    )}
                </div>
                <div id="orange-team-container" className="draft-team-container">
                    <TeamDisplay mode={mode} team={'orange'} draft={orangeTeamDraft} setDraft={setOrangeTeamDraft} targetPokemon={targetPokemon} setTargetPokemon={setTargetPokemon} pokemonList={pokemonList} settings={settings} ></TeamDisplay>
                </div>
            </div>
        </div>
    )
}

export default ComposedDraftPage;