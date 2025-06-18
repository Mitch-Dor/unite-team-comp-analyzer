import React, { useState, useEffect } from 'react';
import Settings from '../../../sideComponents/js/Settings.jsx';
import { GoArrowLeft } from "react-icons/go";
import { GoCopy } from "react-icons/go";

function DraftRoomCreateJoin({ createRoom, joinRoom, inputRoomId, handleInputChange, roomIdRef, isConnected, settings, updateSettings, startDraft, user, opposingUser }) {
    const [joiningOrCreating, setJoiningOrCreating] = useState("");

    useEffect(() => {
        if (joiningOrCreating === "create") {
            // console.log("Creating room");
            createRoom();
        } 
    }, [joiningOrCreating]);

    return (
        <div className="screenCover">
            {joiningOrCreating === "" && (
                <div className="roomCreateJoinContainer">
                    <div className="roomCreateJoinHeader">
                        <h1>Room Create / Join</h1>
                    </div>
                    <div className="roomCreateJoinContent">
                        <button className="draftRoomBTN" onClick={() => setJoiningOrCreating("create")}>Create Draft Room</button>
                        <button className="draftRoomBTN" onClick={() => setJoiningOrCreating("join")}>Join Draft Room</button>
                    </div>
                </div>
            )}
            {joiningOrCreating === "create" && (
                <div className="roomCreateJoinContainer">
                    {!isConnected && (
                        <button className="returnToSelectBTN" onClick={() => setJoiningOrCreating("")}>
                            <GoArrowLeft />
                        </button>
                    )}
                    <div className="roomCreateJoinHeader">
                        <h1>{isConnected ? "Room Host: Set The Settings" : (
                            <div className="roomIDContainer">
                                Room ID: {roomIdRef.current}
                                <button className="copyBTN"
                                    onClick={() => navigator.clipboard.writeText(roomIdRef.current)}
                                >
                                    <GoCopy />
                                </button>
                            </div>
                        )}</h1>
                    </div>
                    <div className="roomCreateJoinContent">
                        {isConnected && (
                            <div className="userInformationContainer">
                                <p>Hosted By (You): {user ? user.user_name : "Unknown"}</p>
                                <p>Opposing User: {opposingUser ? opposingUser.user_name : "Unknown"}</p>
                            </div>
                        )}
                        <Settings settings={settings} updateSettings={updateSettings} startDraft={startDraft} isConnected={isConnected} joinCreate={joiningOrCreating} />
                    </div>
                </div>
            )}
            {joiningOrCreating === "join" && (
                <div className="roomCreateJoinContainer">
                    {!isConnected && (
                        <button className="returnToSelectBTN" onClick={() => setJoiningOrCreating("")}>
                            <GoArrowLeft />
                        </button>
                    )}
                    <div className="roomCreateJoinHeader">
                        <h1>Join Draft Room</h1>
                    </div>
                    <div className="roomCreateJoinContent">
                        {!isConnected && (
                            <>
                                <input 
                                    id="roomInput"
                                type="text" 
                                placeholder="Enter Room ID" 
                                value={inputRoomId}
                                onChange={handleInputChange}
                                maxLength="6"
                                />
                                <button id="joinRoomBTN" onClick={joinRoom}>Join</button>
                            </>
                        )}
                        {isConnected && (
                            <>
                                <div className="userInformationContainer">
                                    <p>Hosted By: {opposingUser ? opposingUser.user_name : "Unknown"}</p>
                                    <p>Opposing User (You): {user ? user.user_name : "Unknown"}</p>
                                </div>
                                <Settings settings={settings} updateSettings={updateSettings} startDraft={startDraft} isConnected={isConnected} joinCreate={joiningOrCreating} />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DraftRoomCreateJoin;
