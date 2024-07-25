import React from 'react';
import '../css/score.css';

function Score() {
  return (
    <div id="scoreContainer">
        <div id="characterSlots">
            <button id="character1" class="characterPortrait"></button>
            <button id="character2" class="characterPortrait"></button>
            <button id="character3" class="characterPortrait"></button>
            <button id="character4" class="characterPortrait"></button>
            <button id="character5" class="characterPortrait"></button>
        </div>
        <div id="characterTraits">
            <div id="character1Traits" class="traitsContainer">
                <button class="trait">Trait</button>
                <button class="trait">Trait</button>
                <button class="trait">Trait</button>
            </div>
            <div id="character2Traits" class="traitsContainer">
                <button class="trait">Trait</button>
                <button class="trait">Trait</button>
                <button class="trait">Trait</button>
            </div>
            <div id="character3Traits" class="traitsContainer">
                <button class="trait">Trait</button>
                <button class="trait">Trait</button>
                <button class="trait">Trait</button>
            </div>
            <div id="character4Traits" class="traitsContainer">
                <button class="trait">Trait</button>
                <button class="trait">Trait</button>
                <button class="trait">Trait</button>
            </div>
            <div id="character5Traits" class="traitsContainer">
                <button class="trait">Trait</button>
                <button class="trait">Trait</button>
                <button class="trait">Trait</button>
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