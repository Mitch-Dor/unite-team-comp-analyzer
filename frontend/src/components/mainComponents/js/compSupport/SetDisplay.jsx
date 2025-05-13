import MatchDisplay from './MatchDisplay';

function SetDisplay({ set }) {

    return (
        <div className="set-card">
            <div className="set-header">
            <div className="set-descriptor-event-name-vod-container">
                <div className="set-descriptor">{set.descriptor}</div>
                <div className="set-event">{set.matches[0].event}</div>
                <div className="event-vod">
                <a href={set.vod} target="_blank" rel="noopener noreferrer">
                    <img src="/assets/icons/youtube.png" alt="VOD" />
                </a>
                </div>
            </div>
            <div className="set-date">{set.matches[0].matchDate}</div>
            </div>
            
            <div className="set-content">
            {set.matches.map((match, index) => (
                <MatchDisplay key={index} match={match} />
            ))}
            </div>
            
            <div className="set-footer">
            <div className="winner-label">
                Winner: <span className="winner-name">{set.winner} \t {set.team1_wins} - {set.team2_wins}</span>
            </div>
            </div>
        </div>
    );
}

export default SetDisplay;