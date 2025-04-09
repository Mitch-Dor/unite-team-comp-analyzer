import React, { useState, useEffect } from 'react';
import '../css/comps.css';
import { fetchAllComps } from './backendCalls/http';

function Comps() {
  const [compsData, setCompsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data - In a real app, this would come from an API
  useEffect(() => {
    fetchAllComps().then(data => {
      let finalFormattedData = [];
      for (const comp of data) {
        const team1Data = {
          pokemon: [comp.team1_pokemon1, comp.team1_pokemon2, comp.team1_pokemon3, comp.team1_pokemon4, comp.team1_pokemon5],
          pokemon_moves: [comp.team1_pokemon1_move1, comp.team1_pokemon1_move2, comp.team1_pokemon2_move1, comp.team1_pokemon2_move2, comp.team1_pokemon3_move1, comp.team1_pokemon3_move2, comp.team1_pokemon4_move1, comp.team1_pokemon4_move2, comp.team1_pokemon5_move1, comp.team1_pokemon5_move2],
          bans: [comp.team1_ban1, comp.team1_ban2],
          name: comp.team1_name,
          region: comp.team1_region,
          players: [comp.team1_player1, comp.team1_player2, comp.team1_player3, comp.team1_player4, comp.team1_player5],
          firstPick: comp.team1_first_pick === 1
        }
        const team2Data = {
          pokemon: [comp.team2_pokemon1, comp.team2_pokemon2, comp.team2_pokemon3, comp.team2_pokemon4, comp.team2_pokemon5],
          pokemon_moves: [comp.team2_pokemon1_move1, comp.team2_pokemon1_move2, comp.team2_pokemon2_move1, comp.team2_pokemon2_move2, comp.team2_pokemon3_move1, comp.team2_pokemon3_move2, comp.team2_pokemon4_move1, comp.team2_pokemon4_move2, comp.team2_pokemon5_move1, comp.team2_pokemon5_move2],
          bans: [comp.team2_ban1, comp.team2_ban2],
          name: comp.team2_name,
          region: comp.team2_region,
          players: [comp.team2_player1, comp.team2_player2, comp.team2_player3, comp.team2_player4, comp.team2_player5],
          firstPick: comp.team2_first_pick === 1
        }
        const finalData = {
          team1: team1Data,
          team2: team2Data,
          winningTeam: comp.team1_win === 1 ? 1 : 2,
          event: comp.event_name,
          matchDate: comp.event_date,
          set_description: comp.set_descriptor,
          vod: comp.vod_url
        }
        finalFormattedData.push(finalData);
      }
      console.log(finalFormattedData);
      setCompsData(finalFormattedData);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const mainContainer = document.getElementById("mainContainer");
      if (mainContainer) {
        mainContainer.style.backgroundImage = `url("/assets/landingPageBackgrounds/Blurred/UNITE_Theia_Sky_Ruins.png")`;
        mainContainer.style.backgroundSize = "cover";
        mainContainer.style.backgroundPosition = "center";
        mainContainer.style.backgroundAttachment = "fixed";
      } else {
        console.error("mainContainer not found");
      }
    }, 0);
  }, [loading]);

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div id="mainContainer" className="main-container">
      <div id="compsContainer">
        <div className="comps-list">
          <h1 className="page-title">Team Compositions</h1>
          
          {compsData.map((match, index) => (
            <div key={index} className="comp-card">
              <div className="comp-header">
                <div className="comp-event">{match.event}</div>
                <div className="comp-date">{match.matchDate}</div>
              </div>
              
              <div className="comp-content">
                {/* Team 1 */}
                <div className={`team-side ${match.winningTeam === 1 ? 'winning-team' : ''}`}>
                  <div className="team-header">
                    <div className="team-name">{match.team1.name}</div>
                    <div className="team-region">{match.team1.region}</div>
                    {match.team1.firstPick && <div className="first-pick">First Pick</div>}
                  </div>
                  
                  <div className="team-bans">
                    <div className="ban-label">Bans:</div>
                    {match.team1.bans.map((ban, i) => (
                      <div key={i} className="ban-pokemon">
                        <img 
                          src={`/assets/Draft/headshots/${ban}.png`} 
                          alt={ban} 
                          className="pokemon-icon ban"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="team-comp">
                    {match.team1.pokemon.map((pokemon, i) => (
                      <div key={i} className="draft-row">
                        <div className="draft-number">{i + 1}</div>
                        <img 
                          src={`/assets/Draft/headshots/${pokemon}.png`} 
                          alt={pokemon} 
                          className="pokemon-icon"
                        />
                        <div className="pokemon-name">{pokemon}</div>
                        <div className="player-name">{match.team1.players[i] || '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Team 2 */}
                <div className={`team-side ${match.winningTeam === 2 ? 'winning-team' : ''}`}>
                  <div className="team-header">
                    <div className="team-name">{match.team2.name}</div>
                    <div className="team-region">{match.team2.region}</div>
                    {match.team2.firstPick && <div className="first-pick">First Pick</div>}
                  </div>
                  
                  <div className="team-bans">
                    <div className="ban-label">Bans:</div>
                    {match.team2.bans.map((ban, i) => (
                      <div key={i} className="ban-pokemon">
                        <img 
                          src={`/assets/Draft/headshots/${ban}.png`} 
                          alt={ban} 
                          className="pokemon-icon ban"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="team-comp">
                    {match.team2.pokemon.map((pokemon, i) => (
                      <div key={i} className="draft-row">
                        <div className="draft-number">{i + 1}</div>
                        <img 
                          src={`/assets/Draft/headshots/${pokemon}.png`} 
                          alt={pokemon} 
                          className="pokemon-icon"
                        />
                        <div className="pokemon-name">{pokemon}</div>
                        <div className="player-name">{match.team2.players[i] || '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="comp-footer">
                <div className="winner-label">
                  Winner: <span className="winner-name">{match[`team${match.winningTeam}`].name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Comps;
