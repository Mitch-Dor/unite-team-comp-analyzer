import React, { useState, useEffect } from 'react';
import Settings from '../../../sideComponents/js/Settings.jsx';
import { GoArrowLeft } from "react-icons/go";
import { GoCopy } from "react-icons/go";
import "../../css/draftSupport/draftRoomCreateJoin.css";

function DraftRoomCreateJoin({ createRoom, joinRoom, inputRoomId, handleInputChange, roomIdRef, isConnected, settings, updateSettings, startDraft, user, opposingUser }) {
    const [joiningOrCreating, setJoiningOrCreating] = useState("");

    useEffect(() => {
        if (joiningOrCreating === "create") {
            // console.log("Creating room");
            createRoom();
        } 
    }, [joiningOrCreating]);

    return (
        <div className="draft-drcj-screen-cover">
            {joiningOrCreating === "" && (
                <div className="draft-drcj-create-join-container">
                    <div className="draft-drcj-create-join-header">
                        <h1>Room Create / Join</h1>
                    </div>
                    <div className="draft-drcj-create-join-content">
                        <button className="draft-drcj-connect-button" onClick={() => setJoiningOrCreating("create")}>Create Draft Room</button>
                        <button className="draft-drcj-connect-button" onClick={() => setJoiningOrCreating("join")}>Join Draft Room</button>
                    </div>
                </div>
            )}
            {joiningOrCreating === "create" && (
                <div className="draft-drcj-create-join-container">
                    {!isConnected && (
                        <button className="draft-drcj-return-to-connect-button" onClick={() => setJoiningOrCreating("")}>
                            <GoArrowLeft />
                        </button>
                    )}
                    <div className="draft-drcj-create-join-header">
                        <h1>{isConnected ? "Room Host: Set The Settings" : (
                            <div className="draft-drcj-room-id-container">
                                Room ID: {roomIdRef.current}
                                <button className="draft-drcj-id-copy-button"
                                    onClick={() => navigator.clipboard.writeText(roomIdRef.current)}
                                >
                                    <GoCopy />
                                </button>
                            </div>
                        )}</h1>
                    </div>
                    <div className="draft-drcj-create-join-content">
                        {isConnected && (
                            <div className="draft-drcj-user-information-container">
                                <p>Hosted By (You): {user ? user.user_name : "Unknown"}</p>
                                <p>Opposing User: {opposingUser ? opposingUser.user_name : "Unknown"}</p>
                            </div>
                        )}
                        <Settings settings={settings} updateSettings={updateSettings} startDraft={startDraft} isConnected={isConnected} joinCreate={joiningOrCreating} />
                    </div>
                </div>
            )}
            {joiningOrCreating === "join" && (
                <div className="draft-drcj-create-join-container">
                    {!isConnected && (
                        <button className="draft-drcj-return-to-connect-button" onClick={() => setJoiningOrCreating("")}>
                            <GoArrowLeft />
                        </button>
                    )}
                    <div className="draft-drcj-create-join-header">
                        <h1>Join Draft Room</h1>
                    </div>
                    <div className="draft-drcj-create-join-content">
                        {!isConnected && (
                            <>
                                <input 
                                    id="draft-drcj-room-id-input"
                                type="text" 
                                placeholder="Enter Room ID" 
                                value={inputRoomId}
                                onChange={handleInputChange}
                                maxLength="6"
                                />
                                <button id="draft-drcj-join-room-button" onClick={joinRoom}>Join</button>
                            </>
                        )}
                        {isConnected && (
                            <>
                                <div className="draft-drcj-user-information-container">
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
