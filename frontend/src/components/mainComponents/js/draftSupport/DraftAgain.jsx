import { useState } from 'react';

function DraftAgain({draftAgain}){
    const [coverScreen, setCoverScreen] = useState(true);
    
    return (
        <>
        { coverScreen ? (
            <div id="doneScreenCover">
                <div id="doneScreen">
                    <h1>Draft Complete</h1>
                    <button className="doneScreenBTN" onClick={() => draftAgain()}>Draft Again</button>
                    <button className="doneScreenBTN" onClick={() => setCoverScreen(false)}>Return To Draft</button>
                </div>
            </div>
        ) : (
            <div id="returnToRestartScreen">
                <button id="returnToDraftAgain" onClick={() => setCoverScreen(true)}>Return To Restart</button>
            </div>
        )}
        </>
    )
}

export default DraftAgain;