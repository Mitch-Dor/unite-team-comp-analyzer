import React, { useState, useEffect } from 'react';
import '../css/comps.css';
import { fetchAllComps } from './backendCalls/http';
import SubmitSetModal from './compSupport/SubmitSetModal';
import MatchDisplay from './compSupport/MatchDisplay';

function Comps() {
  const [compsData, setCompsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

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
        if (!loading) {
          // If the page is still loading mainContainer is expected to not be found
          console.error("mainContainer not found");
        }
      }
    }, 0);
  }, [loading]);

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div id="mainContainer" className="main-container">
      {showSubmitForm && <SubmitSetModal setShowSubmitForm={setShowSubmitForm} setCompsData={setCompsData} compsData={compsData} />}
      <div id="compsContainer">
        <div className="comps-list">
          <h1 className="page-title">Team Compositions</h1>
          
          {compsData.map((match, index) => (
            <MatchDisplay key={index} match={match} />
          ))}
        </div>
      </div>
      <div id="open-set-submit-form" className="open-set-submit-form" onClick={() => setShowSubmitForm(true)}>+</div>
    </div>
  );
}

export default Comps;
