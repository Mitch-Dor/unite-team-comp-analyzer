function DraftAgain({draftAgain}){
    return (
        <div id="doneScreenCover">
            <div id="doneScreen">
                <h1>Draft Complete</h1>
                <button id="doneScreenBTN" onClick={() => draftAgain()}>Draft Again</button>
            </div>
        </div>
    )
}

export default DraftAgain;