import React, {useState} from 'react';
import '../css/disclaimer.css';

function Disclaimer() {
    const [showDisclaimer, setShowDisclaimer] = useState(false);

    return (
        <>
            {showDisclaimer && (
                <div className="screenCover" onClick={() => {setShowDisclaimer(false)}}>
                    <div className="disclaimerPopUp">
                        DISCLAIMER: This web-app does not have access to any information other than that which is publicly available. All of our information comes from
                        the games that Pokemon Unite streams publicly on their YouTube channel. Due to this, information may be missing and quality/quantity of information
                        may be inconsistent across matches, sets, or events. Information also must be entered by hand so please be patient as we do our best to gather as much
                        information as we can. Thank you! :)
                    </div>
                </div>
            )}
            <div id="disclaimerButton" onClick={() => {setShowDisclaimer(!showDisclaimer)}}>D</div>
        </>
    )
}

export default Disclaimer;