function BlockCompDisplay({ picks, bans, team_name, team_region, did_win, advancedDataMode }) {
    const totalDealt = picks.reduce((acc, pick) => acc + pick.dealt, 0);
    const totalTaken = picks.reduce((acc, pick) => acc + pick.taken, 0);
    const totalHealed = picks.reduce((acc, pick) => acc + pick.healed, 0);

    return (
        <div className={`team-side ${did_win ? 'winning-team' : ''}`}>
            <div className="team-header">
                <div className="team-header-left-side">
                    <div className="team-name">{team_name}</div>
                    <div className="team-region">{team_region}</div>
                </div>
                <div className="team-header-right-side">
                    {picks.some(pick => pick.pick_position === 1) && <div className="first-pick" title="First Pick">FP</div>}
                </div>
            </div>
            
            <div className="team-bans">
            <div className="ban-label">Bans:</div>
            {bans.map((ban, i) => (
                <div key={i} className="ban-pokemon">
                <img 
                    src={`/assets/Draft/headshots/${ban.pokemon_name}.png`} 
                    alt={ban.pokemon_name} 
                    className="pokemon-icon ban"
                />
                </div>
            ))}
            </div>
            
            <div className="team-comp">
            {picks.map((pick, i) => (
                <div className="draft-row" key={i}>
                <div className="base-data">
                    <div className="draft-row-number-headshot-container">
                        <div className="draft-number">{pick.pick_position}</div>
                        <img 
                            src={`/assets/Draft/headshots/${pick.pokemon_name}.png`} 
                            alt={pick.pokemon_name} 
                            className="pokemon-icon"
                        />
                    </div>
                    <div className="pokemon-name">
                        {pick.pokemon_name}
                        <div className="move-icons">
                        <img 
                            src={`/assets/Draft/moves/${pick.pokemon_name}_${pick.move_1_name.replace(/ /g, '_')}.png`}
                            alt={pick.move_1_name}
                            className="move-icon"
                        />
                        <img 
                            src={`/assets/Draft/moves/${pick.pokemon_name}_${pick.move_2_name.replace(/ /g, '_')}.png`}
                            alt={pick.move_2_name}
                            className="move-icon"
                        />
                        </div>
                    </div>
                    <div className="player-name" title={
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
                {pick.dealt && advancedDataMode && /* pick.dealt not being 0 indicates that nothing else is 0 */
                    <div className="stats-row">
                        <div className="statNumber kills">{pick.kills}</div>
                        <div className="statNumber assists">{pick.assists}</div>
                        <div className="statNumber scored">{pick.scored}</div>
                        <div className="statBar dealt">
                            <div className="statBarFill red" style={{ width: `${(pick.dealt / totalDealt) * 100}%` }}></div>
                            <span>{pick.dealt} <br /> {((pick.dealt / totalDealt) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="statBar taken">
                            <div className="statBarFill blue" style={{ width: `${(pick.taken / totalTaken) * 100}%` }}></div>
                            <span>{pick.taken} <br /> {((pick.taken / totalTaken) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="statBar healed">
                            <div className="statBarFill green" style={{ width: `${(pick.healed / totalHealed) * 100}%` }}></div>
                            <span>{pick.healed} <br /> {((pick.healed / totalHealed) * 100).toFixed(1)}%</span>
                        </div>
                        <div className={`positionIndicator ${pick.position_played}`}></div>
                    </div>
                }
                </div>
            ))}
            </div>
        </div>
    );
}

export default BlockCompDisplay;
