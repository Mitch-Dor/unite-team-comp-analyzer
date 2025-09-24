import CompDisplay from './CompDisplay';

function MatchDisplay({ match, advancedDataMode }) {

    return (
        <div className="comp-card">
            <div className="comp-content">
            {/* Team 1 */}
            <CompDisplay picks={match.team1_picks} bans={match.team1_bans} team_name={match.team1_name} team_region={match.team1_region} did_win={match.match_winner_text === match.team1_name} advancedDataMode={advancedDataMode} />
            
            {/* Team 2 */}
            <CompDisplay picks={match.team2_picks} bans={match.team2_bans} team_name={match.team2_name} team_region={match.team2_region} did_win={match.match_winner_text === match.team2_name} advancedDataMode={advancedDataMode} />
            </div>
            
            <div className="comp-footer">
            <div className="winner-label">
                Match Winner: <span className="winner-name">{match.match_winner_text}</span>
            </div>
            </div>
        </div>
    );
}

export default MatchDisplay;