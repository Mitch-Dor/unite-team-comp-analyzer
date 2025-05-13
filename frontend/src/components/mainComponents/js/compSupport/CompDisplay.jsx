function CompDisplay({ match, teamData, teamNumber }) {
    const firstPickNumbers = [1, 4, 5, 8, 9];
    const secondPickNumbers = [2, 3, 6, 7, 10];

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
                <div key={i} className="draft-row">
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
                    <div className="player-name">{teamData.players[i] || '—'}</div>
                </div>
            ))}
            </div>
        </div>
    );
}

export default CompDisplay;
