function CompDisplay({ match, teamData, teamNumber, hasAdvanced }) {
    const firstPickNumbers = [1, 4, 5, 8, 9];
    const secondPickNumbers = [2, 3, 6, 7, 10];
    const totalDealt = teamData.pokemon_data[0][3] + teamData.pokemon_data[1][3] + teamData.pokemon_data[2][3] + teamData.pokemon_data[3][3] + teamData.pokemon_data[4][3];
    const totalTaken = teamData.pokemon_data[0][4] + teamData.pokemon_data[1][4] + teamData.pokemon_data[2][4] + teamData.pokemon_data[3][4] + teamData.pokemon_data[4][4];
    const totalHealed = teamData.pokemon_data[0][5] + teamData.pokemon_data[1][5] + teamData.pokemon_data[2][5] + teamData.pokemon_data[3][5] + teamData.pokemon_data[4][5];

    return (
        <div className={`team-side ${match.winningTeam === 1 && teamNumber === 1 ? 'winning-team' : match.winningTeam === 2 && teamNumber === 2 ? 'winning-team' : ''}`}>
            <div className="team-header">
                <div className="team-header-left-side">
                    <div className="team-name">{teamData.name}</div>
                    <div className="team-region">{teamData.region}</div>
                </div>
                <div className="team-header-right-side">
                    {teamData.firstPick && <div className="first-pick" title="First Pick">FP</div>}
                </div>
            </div>
            
            <div className="team-bans">
            <div className="ban-label">Bans:</div>
            {teamData.bans.map((ban, i) => (
                <div key={i} className="ban-pokemon">
                <img 
                    src={`/assets/Draft/headshots/${ban}.png`} 
                    alt={ban} 
                    className="pokemon-icon ban"
                />
                </div>
            ))}
            </div>
            
            <div className="team-comp">
            {teamData.pokemon.map((pokemon, i) => (
                <div className="draft-row" key={i}>
                <div className="base-data">
                    <div className="draft-row-number-headshot-container">
                        <div className="draft-number">{teamData.firstPick === true ? firstPickNumbers[i] : secondPickNumbers[i]}</div>
                        <img 
                            src={`/assets/Draft/headshots/${pokemon}.png`} 
                            alt={pokemon} 
                            className="pokemon-icon"
                        />
                    </div>
                    <div className="pokemon-name">
                        {pokemon}
                        <div className="move-icons">
                        <img 
                            src={`/assets/Draft/moves/${pokemon}_${teamData.pokemon_moves[i * 2].replace(/ /g, '_')}.png`}
                            alt={teamData.pokemon_moves[i * 2]}
                            className="move-icon"
                        />
                        <img 
                            src={`/assets/Draft/moves/${pokemon}_${teamData.pokemon_moves[i * 2 + 1].replace(/ /g, '_')}.png`}
                            alt={teamData.pokemon_moves[i * 2 + 1]}
                            className="move-icon"
                        />
                        </div>
                    </div>
                    <div className="player-name" title={teamData.players[i] || '—'}>{teamData.players[i] || '—'}</div>
                </div>
                {hasAdvanced &&
                    <div className="stats-row">
                        <div className="statNumber kills">{teamData.pokemon_data[i][0]}</div>
                        <div className="statNumber assists">{teamData.pokemon_data[i][1]}</div>
                        <div className="statNumber scored">{teamData.pokemon_data[i][2]}</div>
                        <div className="statBar dealt">
                            <div className="statBarFill red" style={{ width: `${(teamData.pokemon_data[i][3] / totalDealt) * 100}%` }}></div>
                            <span>{teamData.pokemon_data[i][3]} <br /> {((teamData.pokemon_data[i][3] / totalDealt) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="statBar taken">
                            <div className="statBarFill blue" style={{ width: `${(teamData.pokemon_data[i][4] / totalTaken) * 100}%` }}></div>
                            <span>{teamData.pokemon_data[i][4]} <br /> {((teamData.pokemon_data[i][4] / totalTaken) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="statBar healed">
                            <div className="statBarFill green" style={{ width: `${(teamData.pokemon_data[i][5] / totalHealed) * 100}%` }}></div>
                            <span>{teamData.pokemon_data[i][5]} <br /> {((teamData.pokemon_data[i][5] / totalHealed) * 100).toFixed(1)}%</span>
                        </div>
                        <div className={`positionIndicator ${teamData.pokemon_data[i][6]}`}></div>
                    </div>
                }
                </div>
            ))}
            </div>
        </div>
    );
}

export default CompDisplay;
