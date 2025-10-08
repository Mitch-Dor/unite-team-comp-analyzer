import SlickMatchDisplay from './SlickMatchDisplay';
import '../../css/proMatchSupport/slickProMatchDisplay.css';

function SlickSetDisplay({ set, expandShrinkAllMatches }) {

    return (
        <div className="slick-set-container">
            <div className='slick-set-header'>
                <div className='slick-set-team-indicator-container'>
                    <div className='slick-set-team-indicator slick-set-team1'></div>
                    <div className='slick-set-team-indicator-name'>{set.set_score[0].team_name}</div>
                </div>
                <div className='slick-set-event-name'>{set.event_name}</div>
                <div className='slick-set-team-indicator-container'>
                    <div className='slick-set-team-indicator slick-set-team2'></div>
                    <div className='slick-set-team-indicator-name'>{set.set_score[1].team_name}</div>
                </div>
            </div>
            <div className='slick-set-content'>
                {set.matches.map((match, index) => (
                    <SlickMatchDisplay key={index} match={match} team1_name={set.set_score[0].team_name} team2_name={set.set_score[1].team_name} expandShrinkAllMatches={expandShrinkAllMatches} />
                ))}
            </div>
            <div className='slick-set-footer'>
                <div className='slick-set-descriptor'>{set.set_descriptor}</div>
                <div className='slick-set-match-winner'>Winner: <span className={`slick-set-winner-name ${set.set_winner.team_name === set.set_score[0].team_name ? 'team-1' : 'team-2'}`}>{set.set_winner.team_name}</span> ({set.set_score[0].wins > set.set_score[1].wins ? `${set.set_score[0].wins} - ${set.set_score[1].wins}` : `${set.set_score[1].wins} - ${set.set_score[0].wins}`})</div>
                <div className='slick-set-date'>{new Date(set.event_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    })}
                </div>
            </div>
        </div>
    );
}

export default SlickSetDisplay;