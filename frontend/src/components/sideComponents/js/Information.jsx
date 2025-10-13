import React from 'react';
import { useState } from 'react';
import '../css/information.css';
import { IoIosInformationCircle } from 'react-icons/io';
import ReactDOM from 'react-dom';

function Information() {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <>
            {showInfo && (
                ReactDOM.createPortal(
                    <div id="information-screen-cover" onClick={() => setShowInfo(false)}>
                        <div id="information-content" onClick={(e) => e.stopPropagation()}>
                            <div id="information-bullets">
                                <h3>Information</h3>
                                <p>The Pokemon Unite-Pro Draft Buddy & Stat Tracker is a tool designed to help users practice drafting in Pokemon Unite, and to help them learn by analyzing pro stats.</p>
                                <p>The tool is still in development, and will be updated regularly.</p>
                                <p>If you have any feedback, please use the report button in the top left of the main screen, or if that is inadequate, contact me at <a href="mailto:pokemonunitedrafter@gmail.com">pokemonunitedrafter@gmail.com</a>. Inqueries sent to this email are not guranteed to receive a response quickly.</p>
                                <p>DISCLAIMER: I can only access data from matches that were publicly streamed. The data is entered by hand. Because of this, some data may be missing.</p>
                                <p>This project is a fan-made web app for Pokémon Unite and is not affiliated with, endorsed by, or associated with The Pokémon Company, Nintendo, Game Freak, or TiMi Studio Group in any official capacity. All trademarks, game content, and intellectual property are the property of their respective owners. This project is not intended for commercial use.</p>
                            </div>
                        </div>
                    </div>, document.body
                )
            )}
            <button className="information-button" onClick={() => setShowInfo(true)}>
                <IoIosInformationCircle />
            </button>
        </>
    );
}

export default Information;