import React, { useEffect, useState } from 'react';
import { rateComp } from './common/http.js';
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
    <div id="score-main-container">
        <TraitDisplay characters={characters} charactersAndTraits={characterAttributes} character={selectedCharacter1} setSelectedCharacter={setSelectedCharacter1} />
        <TraitDisplay characters={characters} charactersAndTraits={characterAttributes} character={selectedCharacter2} setSelectedCharacter={setSelectedCharacter2} />
        <TraitDisplay characters={characters} charactersAndTraits={characterAttributes} character={selectedCharacter3} setSelectedCharacter={setSelectedCharacter3} />
        <TraitDisplay characters={characters} charactersAndTraits={characterAttributes} character={selectedCharacter4} setSelectedCharacter={setSelectedCharacter4} />
        <div id="score-legend-and-comp-score-container">
            <div id="score-legend">
                <h2>Legend</h2>
                <div className="score-legend-row">
                    <p className="S">0-200 = S</p>
                    <p className="A">201-250 = A</p>
                </div>
                <div className="score-legend-row">
                    <p className="B">251-300 = B</p>
                    <p className="C">301-350 = C</p>
                </div>
                <div className="score-legend-row">
                    <p className="D">351-400 = D</p>
                    <p className="F">401+ = F</p>
                </div>
            </div>
            <div id="score-comp-score">
                <h2>Comp Score</h2>
                <p id="totalScore" className={`${compScore.totalScore <= 200 ? 'S' : compScore.totalScore <= 250 ? 'A' : compScore.totalScore <= 300 ? 'B' : compScore.totalScore <= 350 ? 'C' : compScore.totalScore <= 400 ? 'D' : 'F'}`}>Total: {compScore.totalScore}</p>
                <p id="tierScore">Tier Score: {compScore.tierScore}</p>
                <p id="synergyScore">Synergy Score: {compScore.synergyScore}</p>
            </div>
        </div>
        <TraitDisplay characters={characters} charactersAndTraits={characterAttributes} character={selectedCharacter5} setSelectedCharacter={setSelectedCharacter5} />
        <Home />
    </div>
  );
}

export default Score;