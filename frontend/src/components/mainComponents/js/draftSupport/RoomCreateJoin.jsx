import React, { useState, useEffect } from 'react';
import { GoArrowLeft } from "react-icons/go";

function RoomCreateJoin({ createRoom, joinRoom, inputRoomId, handleInputChange, roomIdRef }) {
    const [joiningOrCreating, setJoiningOrCreating] = useState("");

    useEffect(() => {
        if (joiningOrCreating === "create") {
            console.log("Creating room");
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
                    <button className="returnToSelectBTN" onClick={() => setJoiningOrCreating("")}>
                        <GoArrowLeft />
                    </button>
                    <div className="roomCreateJoinHeader">
                        <h1>Room ID: {roomIdRef.current}</h1>
                    </div>
                </div>
            )}
            {joiningOrCreating === "join" && (
                <div className="roomCreateJoinContainer">
                    <button className="returnToSelectBTN" onClick={() => setJoiningOrCreating("")}>
                        <GoArrowLeft />
                    </button>
                    <div className="roomCreateJoinHeader">
                        <h1>Join Draft Room</h1>
                    </div>
                    <div className="roomCreateJoinContent">
                        <input 
                            id="roomInput"
                            type="text" 
                            placeholder="Enter Room ID" 
                            value={inputRoomId}
                            onChange={handleInputChange}
                            maxLength="6"
                        />
                        <button id="joinRoomBTN" onClick={joinRoom}>Join</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoomCreateJoin;
