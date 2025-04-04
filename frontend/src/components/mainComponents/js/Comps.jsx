import React, { useState, useEffect } from 'react';
import '../css/comps.css';

function Comps() {
  const [compsData, setCompsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data - In a real app, this would come from an API
  useEffect(() => {
    // For demo, using the sample data provided
    const sampleData = [
      {
        team1: {
          pokemon: ['Sylveon', 'Metagross', 'Mr-Mime', 'Blaziken', 'Eldegoss'],
          bans: ['Gyarados', 'Falinks'],
          name: 'Exile',
          region: 'NA',
          players: ['', '', '', '', ''],
          firstPick: true
        },
        team2: {
          pokemon: ['Crustle', 'Leafeon', 'Espeon', 'Hoopa', 'Garchomp'],
          bans: ['Trevenant', 'Tyranitar'],
          name: 'Ignorance',
          region: 'NA',
          players: ['', '', '', '', ''],
          firstPick: false
        },
        winningTeam: 1,
        event: 'NAIC 2024',
        matchDate: '06/07/2024'
      },
      {
        team1: {
          pokemon: ['Sylveon', 'Mr-Mime', 'Crustle', 'Falinks', 'Blaziken'],
          bans: ['Trevenant', 'Comfey'],
          name: 'Ignorance',
          region: 'NA',
          players: ['', '', '', '', ''],
          firstPick: true
        },
        team2: {
          pokemon: ['Metagross', 'Eldegoss', 'Cramorant', 'Umbreon', 'Scizor'],
          bans: ['Gyarados', 'Tyranitar'],
          name: 'Exile',
          region: 'NA',
          players: ['', '', '', '', ''],
          firstPick: false
        },
        winningTeam: 1,
        event: 'NAIC 2024',
        matchDate: '06/07/2024'
      },
      {
        team1: {
          pokemon: ['Tyranitar', 'Blaziken', 'Mr-Mime', 'Cramorant', 'Eldegoss'],
          bans: ['Gyarados', 'Falinks'],
          name: 'Exile',
          region: 'NA',
          players: ['', '', '', '', ''],
          firstPick: true
        },
        team2: {
          pokemon: ['Crustle', 'Leafeon', 'Machamp', 'Hoopa', 'Delphox'],
          bans: ['Trevenant', 'Sylveon'],
          name: 'Ignorance',
          region: 'NA',
          players: ['', '', '', '', ''],
          firstPick: false
        },
        winningTeam: 2,
        event: 'NAIC 2024',
        matchDate: '06/07/2024'
      },
      {
        team1: {
          pokemon: ['Leafeon', 'Mr-Mime', 'Cramorant', 'Blissey', 'Falinks'],
          bans: ['Umbreon', 'Sylveon'],
          name: 'Luminosity Gaming',
          region: 'NA',
          players: ['', '', '', '', ''],
          firstPick: true
        },
        team2: {
          pokemon: ['Snorlax', 'Hoopa', 'Inteleon', 'Meowscarada', 'Talonflame'],
          bans: ['Tyranitar', 'Trevenant'],
          name: 'Brave Birders',
          region: 'NA',
          players: ['', '', '', '', ''],
          firstPick: false
        },
        winningTeam: 1,
        event: 'NAIC 2024',
        matchDate: '06/07/2024'
      }
    ];

    setCompsData(sampleData);
    setLoading(false);
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

  // Helper function to format Pokémon name for image paths
  const formatPokemonName = (name) => {
    if (!name) return 'none';
    // Handle special cases
    if (name === 'Mr-Mime') return 'Mr_Mime';
    // Other potential special cases can be added here
    return name;
  };

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
                          src={`/assets/Draft/headshots/${formatPokemonName(ban)}.png`} 
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
                          src={`/assets/Draft/headshots/${formatPokemonName(pokemon)}.png`} 
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
                          src={`/assets/Draft/headshots/${formatPokemonName(ban)}.png`} 
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
                          src={`/assets/Draft/headshots/${formatPokemonName(pokemon)}.png`} 
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
