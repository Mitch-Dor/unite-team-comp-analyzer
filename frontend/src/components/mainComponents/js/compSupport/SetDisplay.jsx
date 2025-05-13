import MatchDisplay from './MatchDisplay';

function SetDisplay({ set }) {



    return (
        <div className="set-card">
            <div className="set-header">
                <div className="set-descriptor">{set.set_description}</div>
                <div className="set-event-name-vod-container">
                    <div className="set-event">{set.set_event}</div>
                    <div className="event-vod">
                    <a href={set.vod} target="_blank" rel="noopener noreferrer">
                        <img src="/assets/icons/youtube.png" alt="VOD" />
                        </a>
                    </div>
                </div>
                <div className="set-date">{set.set_date}</div>
            </div>
            
            <div className="set-content">
            {set.matches.map((match, index) => (
                <div key={index} className="set-match-container">
                    <MatchDisplay match={match} />
                </div>
            ))}
            </div>
            
            <div className="set-footer">
                <div className="winner-label">
                    Set Winner: <span className="winner-name">{set.winner} {set.team1_wins > set.team2_wins ? `(${set.team1_wins} - ${set.team2_wins})` : `(${set.team2_wins} - ${set.team1_wins})`}</span>
                </div>
            </div>
        </div>
    );
}

export default SetDisplay;