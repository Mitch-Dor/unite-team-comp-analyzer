import React from 'react';
import '../css/draftHover.css';

function DraftHover() {
    return (
        <div id="miniPopupContainer">
            <div id="miniPopup">
                <div id="synergies">
                    <h4>Synergies: </h4>
                    <button className="characterPortrait"></button>
                    <button className="characterPortrait"></button>
                    <button className="characterPortrait"></button>
                    <button className="characterPortrait"></button>
                    <button className="characterPortrait"></button>
                </div>
                <div id="counters">
                    <h4>Counters: </h4>
                    <button className="characterPortrait"></button>
                    <button className="characterPortrait"></button>
                    <button className="characterPortrait"></button>
                    <button className="characterPortrait"></button>
                    <button className="characterPortrait"></button>
                </div>
                <div id="compOrRecommend">
                    <h4>Comp In Mind: </h4> 
                    {/* THIS WILL BE EITHER Comp In Mind or Reccommended Comp based on if it's on the AI's side or player's side */}
                    <button className="characterPortrait"></button>
                    <button className="characterPortrait"></button>
                    <button className="characterPortrait"></button>
                    <button className="characterPortrait"></button>
                    <button className="characterPortrait"></button>
                </div>
            </div>
        </div>
    )
}

export default DraftHover;