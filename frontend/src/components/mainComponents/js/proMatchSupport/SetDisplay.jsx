import MatchDisplay from './MatchDisplay';

function SetDisplay({ set, advancedDataMode }) {

    return (
        <div className="set-card">
            <div className="set-header">
                <div className="set-descriptor">{set.set_descriptor}</div>
                <div className="set-event-name-vod-container">
                    <div className="set-event">{set.event_name}</div>
                </div>
                <div className="set-date">{new Date(set.event_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    })}
                </div>
            </div>
            
            <div className="set-content">
            {set.matches.map((match, index) => (
                <div key={index} className="set-match-container">
                    <MatchDisplay match={match} advancedDataMode={advancedDataMode} />
                </div>
            ))}
            </div>
            
            <div className="set-footer">
                <div className="winner-label">
                    Set Winner: <span className="winner-name">{set.set_winner.team_name} {set.set_score[0].wins > set.set_score[1].wins ? `(${set.set_score[0].wins} - ${set.set_score[1].wins})` : `(${set.set_score[1].wins} - ${set.set_score[0].wins})`}</span>
                </div>
            </div>
        </div>
    );
}

export default SetDisplay;