import { useEffect } from 'react';
import SlickCompDisplay from './SlickCompDisplay';
import { FaCaretDown } from 'react-icons/fa';
import { FaCaretUp } from 'react-icons/fa';
import { useState } from 'react';

function SlickMatchDisplay({ match, team1_name, team2_name, expandShrinkAllMatches }) {
    const allPicks = [...match.team1_picks, ...match.team2_picks].sort((a, b) => a.pick_position - b.pick_position);
    const allBans = [...match.team1_bans, ...match.team2_bans].sort((a, b) => a.ban_position - b.ban_position);
    const row1Picks = allPicks.filter(pick => pick.pick_position % 2 === 1);
    const row2Picks = allPicks.filter(pick => pick.pick_position % 2 === 0);
    const row1Bans = allBans.filter(ban => ban.ban_position % 2 === 1);
    const row2Bans = allBans.filter(ban => ban.ban_position % 2 === 0);
    const [advancedDataMode, setAdvancedDataMode] = useState(false);

    allPicks.map(pick => {
        if (match.team1_picks.includes(pick)) {
            pick.team_name = match.team1_name === team1_name ? 'team1' : 'team2';
        } else {
            pick.team_name = match.team2_name === team2_name ? 'team2' : 'team1';
        }
    })

    allBans.map(ban => {
        if (match.team1_bans.includes(ban)) {
            ban.team_name = match.team1_name === team1_name ? 'team1' : 'team2';
        } else {
            ban.team_name = match.team2_name === team2_name ? 'team2' : 'team1';
        }
    })

    useEffect(() => {
        if (expandShrinkAllMatches) {
            setAdvancedDataMode(true);
        } else {
            setAdvancedDataMode(false);
        }
    }, [expandShrinkAllMatches]);

    return (
        <div className='slick-match-container'>
            <div className="slick-match-base-info-container">
                <div className="slick-match-information">
                    <div className='slick-match-winner slick-match-label'>Winner:
                        <div className={`slick-match-winner-text ${match.match_winner_text === team1_name ? 'team-1' : 'team-2'}`}>{match.match_winner_text}</div>
                    </div>
                    <div className='slick-match-vod'>
                        <a href={match.match_url} target="_blank" rel="noopener noreferrer">
                            <img src="/assets/icons/youtube.png" alt="VOD" />
                        </a>
                    </div>
                </div>
                <div className='slick-match-picks-bans-container'>
                    <div className='slick-match-bans'>
                        <div className='slick-match-bans-team1 slick-match-label'>
                            <div className='slick-match-bans-label'>Bans:</div>
                            {row1Bans.map((ban, i) => (
                                <div key={i} className={`slick-match-bans-pick ${ban.team_name === 'team1' ? 'slick-set-team1' : 'slick-set-team2'}`}>
                                    <img src={`/assets/Draft/headshots/${ban.pokemon_name}.png`} alt={ban.pokemon_name} />
                                    <div className='slick-match-ban-position-label'>{ban.ban_position}</div>
                                </div>
                            ))}
                        </div>
                        <div className='slick-match-bans-team2 slick-match-label'>
                            <div className='slick-match-bans-label'>Bans:</div>
                            {row2Bans.map((ban, i) => (
                                <div key={i} className={`slick-match-bans-pick ${ban.team_name === 'team1' ? 'slick-set-team1' : 'slick-set-team2'}`}>
                                    <img src={`/assets/Draft/headshots/${ban.pokemon_name}.png`} alt={ban.pokemon_name} />
                                    <div className='slick-match-ban-position-label'>{ban.ban_position}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='slick-match-draft'>
                        <div className='slick-match-draft-row draft-row-1'>
                            {row1Picks.map((pick, i) => (
                                <div key={i} className={`slick-match-draft-pick ${pick.team_name === 'team1' ? 'slick-set-team1' : 'slick-set-team2'}`}>
                                    <img src={`/assets/Draft/headshots/${pick.pokemon_name}.png`} alt={pick.pokemon_name} />
                                    <div className='slick-match-draft-position-label'>{pick.pick_position}</div>
                                </div>
                            ))}
                        </div>
                        <div className='slick-match-draft-row draft-row-2'>
                            {row2Picks.map((pick, i) => (
                                <div key={i} className={`slick-match-draft-pick ${pick.team_name === 'team1' ? 'slick-set-team1' : 'slick-set-team2'}`}>
                                    <img src={`/assets/Draft/headshots/${pick.pokemon_name}.png`} alt={pick.pokemon_name} />
                                    <div className='slick-match-draft-position-label'>{pick.pick_position}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='slick-match-expand' onClick={() => setAdvancedDataMode(prev => !prev)}>
                    {advancedDataMode ? <FaCaretDown /> : <FaCaretUp />}
                </div>
            </div>
            {advancedDataMode && 
                <div className="slick-match-expanded-container">
                    <SlickCompDisplay picks={match.team1_picks} bans={match.team1_bans} team_name={match.team1_name} team_region={match.team1_region} did_win={match.match_winner_text === match.team1_name} team1_name={team1_name} team2_name={team2_name} side="side1" />
                    <SlickCompDisplay picks={match.team2_picks} bans={match.team2_bans} team_name={match.team2_name} team_region={match.team2_region} did_win={match.match_winner_text === match.team2_name} team1_name={team1_name} team2_name={team2_name} side="side2" />
                </div>
            }
        </div>
    );
}

export default SlickMatchDisplay;