import React from 'react';
import '../css/information.css';

function Information() {
    return (
        <div id="miniPopupContainer">
        <div id="miniPopup">
            {/* Have one popup component that has just this shell that is just the black box. Then have it build something specific based off what was clicked */}
            <p id="information"></p>
        </div>
    </div>
    )
}

export default Information;