import React from 'react';
import '../css/score.css';

function Score() {
  return (
    <div id="scoreContainer">
        <div id="characterSlots">
            <button id="character1" className="characterPortrait"></button>
            <button id="character2" className="characterPortrait"></button>
            <button id="character3" className="characterPortrait"></button>
            <button id="character4" className="characterPortrait"></button>
            <button id="character5" className="characterPortrait"></button>
        </div>
        <div id="characterTraits">
            <div id="character1Traits" className="traitsContainer">
                <button className="trait">Trait</button>
                <button className="trait">Trait</button>
                <button className="trait">Trait</button>
            </div>
            <div id="character2Traits" className="traitsContainer">
                <button className="trait">Trait</button>
                <button className="trait">Trait</button>
                <button className="trait">Trait</button>
            </div>
            <div id="character3Traits" className="traitsContainer">
                <button className="trait">Trait</button>
                <button className="trait">Trait</button>
                <button className="trait">Trait</button>
            </div>
            <div id="character4Traits" className="traitsContainer">
                <button className="trait">Trait</button>
                <button className="trait">Trait</button>
                <button className="trait">Trait</button>
            </div>
            <div id="character5Traits" className="traitsContainer">
                <button className="trait">Trait</button>
                <button className="trait">Trait</button>
                <button className="trait">Trait</button>
            </div>
        </div>
        <div id="bottomContainer">
            <div id="legend">
                <h2>Legend</h2>
                1000+ = S<br></br>600-999 = A<br></br>other...
            </div>
            <div id="compScore">
                <h2>Comp Score</h2>
                <p id="score">1000</p>
            </div>
        </div>
    </div>
  );
}

export default Score;