import BlockMatchDisplay from './BlockMatchDisplay';
import '../../css/proMatchSupport/blockProMatchDisplay.css';

function BlockSetDisplay({ set, advancedDataMode }) {

    return (
        <div className="block-set-container">
            <div className="block-set-header">
                <div className="block-set-descriptor">{set.set_descriptor}</div>
                <div className="block-set-event">{set.event_name}</div>
                <div className="bloc-set-date">{new Date(set.event_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    })}
                </div>
            </div>
            
            <div className="block-set-matches-container">
                {set.matches.map((match, index) => (
                    <BlockMatchDisplay match={match} advancedDataMode={advancedDataMode} />
                ))}
            </div>
            
            <div className="block-set-footer">
                <div className="block-set-winner-label">
                    Set Winner: <span className="winner-name">{set.set_winner.team_name} {set.set_score[0].wins > set.set_score[1].wins ? `(${set.set_score[0].wins} - ${set.set_score[1].wins})` : `(${set.set_score[1].wins} - ${set.set_score[0].wins})`}</span>
                </div>
            </div>
        </div>
    );
}

export default BlockSetDisplay;