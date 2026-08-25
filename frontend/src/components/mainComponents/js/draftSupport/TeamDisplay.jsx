import { GoArrowSwitch } from "react-icons/go";
import "../../css/draftSupport/teamDisplay.css";
import { getInversePokemon } from '../common/common';

const TeamDisplay = ({ mode, team, draft, setDraft, targetPokemon, setTargetPokemon, pokemonList, settings }) => {

    const handleClick = (event, pokemon, pickBan, position) => {
        if(mode === 'sandbox'){
            event.preventDefault(); // Prevent default context menu
            cleanPosition(position);
            if (event.button === 0) { // Left click
                setPokemon(pokemon, pickBan, position);
            }
            setTargetPokemon(null);
        }
    };

    function cleanPosition(position){
        setDraft(draft => ({
            ...draft,
            picks: draft.picks.filter(item => item.position !== position),
            bans: draft.bans.filter(item => item.position !== position)
        }));
    }

    function setPokemon(pokemon, pickBan, position) {
        if (pickBan === 'ban'){
            setDraft(draft => ({
                ...draft,
                bans: [...draft.bans, { pokemon: pokemon, position: position }]
            }));
        } else {
            setDraft(draft => ({
                ...draft,
                picks: [...draft.picks, { pokemon: pokemon, position: position }]
            }));
        }
    }

    function specialCase(pokemon){
        if (!pokemon) {return null}
        const otherPokemon = getInversePokemon(pokemon, pokemonList);
        if (otherPokemon){
            if (settings.disallowedCharacters.includes(otherPokemon.pokemon_name)){
                return null;
            } else {
                return otherPokemon;
            }
        }
        return null;
    }

    return (
        <>
            <div className="draft-team-display-bans-container" id={`${team}Bans`}>
                {["ban1", "ban2", "ban3"].map((banPosition, index) => {
                    const currentBan = draft.bans.find(ban => ban.position === banPosition);
                    return (
                        <img 
                            key={index}
                            onClick={mode === 'sandbox' ? (e => handleClick(e, targetPokemon, 'ban', banPosition)) : null}
                            onContextMenu={mode === 'sandbox' ? (e => handleClick(e, targetPokemon, 'ban', banPosition)) : null}
                            className={`draft-character-portrait draft-team-display-bans ${mode==='sandbox' && targetPokemon ? 'selectable' : null}`} 
                            src={currentBan?.pokemon?.pokemon_name ? `/assets/Draft/headshots/${currentBan?.pokemon?.pokemon_name || ''}.png` : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'} 
                        />
                    );
                })}
            </div>
            <div className="draft-team-display-picks-container" id={`${team}Bans`}>
                {["pick1", "pick2", "pick3", "pick4", "pick5"].map((pickPosition, index) => {
                    const currentPick = draft.picks.find(pick => pick.position === pickPosition);
                    const relatedPick = currentPick ? specialCase(currentPick.pokemon) : null;
                    return (
                        <div key={index} 
                            className={`draft-team-display-character-pick ${team}-side ${currentPick?.pokemon?.pokemon_class} ${mode==='sandbox' && targetPokemon ? 'selectable' : null}`} 
                            onClick={mode === 'sandbox' ? (e) => handleClick(e, targetPokemon, 'pick', pickPosition) : null}
                            onContextMenu={mode === 'sandbox' ? (e) => handleClick(e, targetPokemon, 'pick', pickPosition) : null}
                        >
                            <h3>{currentPick?.pokemon?.pokemon_name || 'Character'}</h3>
                            {relatedPick && (
                                <button className="draft-team-display-switch-character-form-buttom" onClick={(e) => {e.stopPropagation(); setPokemon(relatedPick, 'pick', pickPosition);}}>
                                    <GoArrowSwitch />
                                </button>
                            )}
                            <img className={`class-background-smear ${team} ${currentPick?.pokemon?.pokemon_class}`}/>
                            <img 
                                className={`draft-character-model`} 
                                src={currentPick?.pokemon?.pokemon_name ? `/assets/models/${currentPick?.pokemon?.pokemon_name}.png` : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'} 
                                alt={currentPick?.pokemon?.pokemon_name || 'blank'} 
                            />
                            {currentPick?.pokemon && (
                                <img 
                                className={`draft-character-portrait ${currentPick?.pokemon?.pokemon_class}`} 
                                src={currentPick?.pokemon?.pokemon_name ? `/assets/Draft/headshots/${currentPick?.pokemon?.pokemon_name}.png` : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'} 
                                alt={currentPick?.pokemon?.pokemon_name || 'blank'} 
                            />
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default TeamDisplay;