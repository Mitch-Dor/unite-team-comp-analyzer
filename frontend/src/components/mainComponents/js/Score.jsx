import React, { useEffect, useState } from 'react';
import { fetchAllCharacterAttributes, rateComp } from './common/http.js';
import TraitDisplay from './scoreSupport/TraitDisplay.jsx';
import Home from '../../sideComponents/js/Home.jsx';
import '../css/score.css';

function Score({ characterAttributes, characters }) {
    
    const [selectedCharacter1, setSelectedCharacter1] = useState(null);
    const [selectedCharacter2, setSelectedCharacter2] = useState(null);
    const [selectedCharacter3, setSelectedCharacter3] = useState(null);
    const [selectedCharacter4, setSelectedCharacter4] = useState(null);
    const [selectedCharacter5, setSelectedCharacter5] = useState(null);
    const [compScore, setCompScore] = useState({
        totalScore: 0,
        tierScore: 0,
        synergyScore: 0
    });

    useEffect(() => {
        async function calculateCompScore() {
            // Check if any character is selected before calling API
            if(selectedCharacter1 || selectedCharacter2 || selectedCharacter3 || selectedCharacter4 || selectedCharacter5){
                try {
                    const score = await rateComp([selectedCharacter1, selectedCharacter2, selectedCharacter3, selectedCharacter4, selectedCharacter5]);
                    setCompScore(score);
                } catch (error) {
                    console.error("Error rating comp:", error);
                }
            }
        }
        calculateCompScore();
    }, [selectedCharacter1, selectedCharacter2, selectedCharacter3, selectedCharacter4, selectedCharacter5]);
    
  return (
    <div id="scoreContainer">
        <div id="characterDisplayContainer">
            <TraitDisplay characters={characters} charactersAndTraits={characterAttributes} character={selectedCharacter1} setSelectedCharacter={setSelectedCharacter1} />
            <TraitDisplay characters={characters} charactersAndTraits={characterAttributes} character={selectedCharacter2} setSelectedCharacter={setSelectedCharacter2} />
            <TraitDisplay characters={characters} charactersAndTraits={characterAttributes} character={selectedCharacter3} setSelectedCharacter={setSelectedCharacter3} />
            <TraitDisplay characters={characters} charactersAndTraits={characterAttributes} character={selectedCharacter4} setSelectedCharacter={setSelectedCharacter4} />
            <TraitDisplay characters={characters} charactersAndTraits={characterAttributes} character={selectedCharacter5} setSelectedCharacter={setSelectedCharacter5} />
        </div>
        <div id="bottomContainer">
            <div id="legend">
                <h2>Legend</h2>
                <div className="legendItem">
                    <div className="legendRow">
                        <p>0-200 = S</p>
                        <p>201-250 = A</p>
                    </div>
                    <div className="legendRow">
                        <p>251-300 = B</p>
                        <p>301-350 = C</p>
                    </div>
                    <div className="legendRow">
                        <p>351-400 = D</p>
                        <p>401+ = E</p>
                    </div>
                </div>
            </div>
            <div id="compScore">
                <h2>Comp Score</h2>
                <p id="totalScore">Total: {compScore.totalScore}</p>
                <p id="tierScore">Tier Score: {compScore.tierScore}</p>
                <p id="synergyScore">Synergy Score: {compScore.synergyScore}</p>
            </div>
        </div>
        <Home />
    </div>
  );
}

export default Score;