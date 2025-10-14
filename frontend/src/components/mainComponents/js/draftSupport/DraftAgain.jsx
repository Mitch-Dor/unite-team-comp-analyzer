import { useState } from 'react';
import "../../css/draftSupport/draftAgain.css";

function DraftAgain({draftAgain}){
    const [coverScreen, setCoverScreen] = useState(true);
    
    return (
        <>
        { coverScreen ? (
            <div id="draft-draft-again-screen-cover">
                <div id="draft-draft-again-done-screen-container">
                    <h1>Draft Complete</h1>
                    <button className="draft-draft-again-done-screen-button" onClick={() => draftAgain()}>Draft Again</button>
                    <button className="draft-draft-again-done-screen-button" onClick={() => setCoverScreen(false)}>Return To Draft</button>
                </div>
            </div>
        ) : (
            <div id="draft-draft-again-return-to-restart-screen-container">
                <button id="draft-draft-again-show-draft-again-pop-up" onClick={() => setCoverScreen(true)}>Return To Restart</button>
            </div>
        )}
        </>
    )
}

export default DraftAgain;