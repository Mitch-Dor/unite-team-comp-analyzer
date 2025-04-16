import CompDisplay from './CompDisplay';

function MatchDisplay({ match }) {

    return (
        <div className="comp-card">
            <div className="comp-header">
            <div className="comp-event-name-vod-container">
                <div className="comp-event">{match.event}</div>
                <div className="event-vod">
                <a href={match.vod} target="_blank" rel="noopener noreferrer">
                    <img src="/assets/icons/youtube.png" alt="VOD" />
                </a>
                </div>
            </div>
            <div className="comp-date">{match.matchDate}</div>
            </div>
            
            <div className="comp-content">
            {/* Team 1 */}
            <CompDisplay match={match} teamData={match.team1} teamNumber={1} />
            
            {/* Team 2 */}
            <CompDisplay match={match} teamData={match.team2} teamNumber={2} />
            </div>
            
            <div className="comp-footer">
            <div className="winner-label">
                Winner: <span className="winner-name">{match[`team${match.winningTeam}`].name}</span>
            </div>
            </div>
        </div>
    );
}

export default MatchDisplay;