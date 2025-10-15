import "../../css/proMatchSupport/compDisplay.css";

import { FaCrown } from "react-icons/fa";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SlickCompDisplay({ picks, bans, team_name, team_region, did_win, team1_name, team2_name, side }) {
    const totalDealt = picks.reduce((acc, pick) => acc + pick.dealt, 0);
    const totalTaken = picks.reduce((acc, pick) => acc + pick.taken, 0);
    const totalHealed = picks.reduce((acc, pick) => acc + pick.healed, 0);

    return (
        <div className={`comp-display-team-side ${side}`}>
            <div className="comp-display-team-header">
                <div className="comp-display-team-header-left-side">
                    <div className={`comp-display-team-name ${team_name === team1_name ? 'team-1' : 'team-2'}`}>{team_name}</div>
                    <div className="comp-display-team-region">{team_region}</div>
                    {did_win && <FaCrown title="Winner" className="comp-display-crown" />}
                </div>
                <div className="comp-display-team-header-right-side">
                    {picks.some(pick => pick.pick_position === 1) && <div className="comp-display-first-pick" title="First Pick">FP</div>}
                </div>
            </div>
            
            <div className="comp-display-team-bans">
            <div className="comp-display-ban-label">Bans:</div>
            {bans.map((ban, i) => (
                <div key={i} className="comp-display-ban-pokemon">
                <img 
                    src={`/assets/Draft/headshots/${ban.pokemon_name}.png`} 
                    alt={ban.pokemon_name} 
                    className="comp-display-pokemon-icon ban"
                />
                </div>
            ))}
            </div>
            
            <div className="comp-display-team-comp">
            {picks.map((pick, i) => (
                <div className="comp-display-draft-row" key={i}>
                <div className="comp-display-base-data">
                    <div className="comp-display-draft-row-number-headshot-container">
                        <div className="comp-display-draft-number">{pick.pick_position}</div>
                        <img 
                            src={`/assets/Draft/headshots/${pick.pokemon_name}.png`} 
                            alt={pick.pokemon_name} 
                            className="comp-display-pokemon-icon"
                        />
                    </div>
                    <div className="comp-display-pokemon-name">
                        {pick.pokemon_name}
                        <div className="comp-display-move-icons">
                        <img 
                            src={`/assets/Draft/moves/${pick.pokemon_name}_${pick.move_1_name.replace(/ /g, '_')}.png`}
                            alt={pick.move_1_name}
                            className="comp-display-move-icon"
                        />
                        <img 
                            src={`/assets/Draft/moves/${pick.pokemon_name}_${pick.move_2_name.replace(/ /g, '_')}.png`}
                            alt={pick.move_2_name}
                            className="comp-display-move-icon"
                        />
                        </div>
                    </div>
                    <div className="comp-display-player-name" title={
                        pick.player_name
                            ? pick.player_other_names
                                ? `${pick.player_name} (${pick.player_other_names})`
                                : pick.player_name
                            : '—'
                    }>
                        {pick.player_name
                            ? pick.player_other_names
                                ? `${pick.player_name} (${pick.player_other_names})`
                                : pick.player_name
                            : '—'
                        }
                    </div>
                </div>
                {pick.dealt && /* pick.dealt not being 0 indicates that nothing else is 0 */
                    <div className="comp-display-stats-row">
                        <div className="comp-display-statNumber kills">{pick.kills}</div>
                        <div className="comp-display-statNumber assists">{pick.assists}</div>
                        <div className="comp-display-statNumber scored">{pick.scored}</div>
                        <div className="comp-display-statBar">
                            <div className="comp-display-statBarFill red" style={{ width: `${(pick.dealt / totalDealt) * 100}%` }}></div>
                            <span>{pick.dealt} <br /> {((pick.dealt / totalDealt) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="comp-display-statBar">
                            <div className="comp-display-statBarFill blue" style={{ width: `${(pick.taken / totalTaken) * 100}%` }}></div>
                            <span>{pick.taken} <br /> {((pick.taken / totalTaken) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="comp-display-statBar">
                            <div className="comp-display-statBarFill green" style={{ width: `${(pick.healed / totalHealed) * 100}%` }}></div>
                            <span>{pick.healed} <br /> {((pick.healed / totalHealed) * 100).toFixed(1)}%</span>
                        </div>
                        <div className={`comp-display-positionIndicator ${pick.position_played}`}></div>
                    </div>
                }
                </div>
            ))}
            </div>
        </div>
    );
}

export default SlickCompDisplay;
