import CompDisplay from './CompDisplay';

function MatchDisplay({ match }) {

    return (
        <div className="comp-card">
            <div className="comp-content">
            {/* Team 1 */}
            <CompDisplay match={match} teamData={match.team1} teamNumber={1} />
            
            {/* Team 2 */}
            <CompDisplay match={match} teamData={match.team2} teamNumber={2} />
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