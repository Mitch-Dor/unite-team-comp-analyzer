import CompDisplay from './CompDisplay';

function MatchDisplay({ match, advancedDataMode }) {

    return (
        <div className="comp-card">
            <div className="comp-content">
            {/* Team 1 */}
            <CompDisplay match={match} teamData={match.team1} teamNumber={1} hasAdvanced={match.has_advanced_data} advancedDataMode={advancedDataMode} />
            
            {/* Team 2 */}
            <CompDisplay match={match} teamData={match.team2} teamNumber={2} hasAdvanced={match.has_advanced_data} advancedDataMode={advancedDataMode} />
            </div>
            
            <div className="comp-footer">
            <div className="winner-label">
                Match Winner: <span className="winner-name">{match[`team${match.winningTeam}`].name}</span>
            </div>
            </div>
        </div>
    );
}

export default MatchDisplay;