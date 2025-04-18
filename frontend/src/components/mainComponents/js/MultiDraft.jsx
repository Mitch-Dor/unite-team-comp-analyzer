import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import DraftListing from './draftSupport/DraftListing';
import TeamDisplay from './draftSupport/TeamDisplay.jsx';
import Filtering from './draftSupport/Filtering.jsx';
import { fetchCharacterDraftInfo, runAStarAlgorithm, createRoom as apiCreateRoom, getAllRooms, getRoomInfo } from './backendCalls/http.js';
import '../css/draft.css';
import { Peer } from 'peerjs';
import io from 'socket.io-client';

function MultiDraft() {
    const location = useLocation();
    const { numUsers, settings } = location.state || {};
    const [pokemonList, updatePokemonList] = useState([]);
    const [filteredList, updateFilteredList] = useState([]);
    const [targetPokemon, setTargetPokemon] = useState(null);
    const [team1Bans, updateTeam1Bans] = useState([]);
    const [team2Bans, updateTeam2Bans] = useState([]);
    const [team1Picks, updateTeam1Picks] = useState([]);
    const [team2Picks, updateTeam2Picks] = useState([]);
    const [draftState, updateDraftState] = useState("team1Ban1");
    const [idealComp, updateIdealComp] = useState(null);
    const [loading, setLoading] = useState(true); // Handles while we're loading pokemonList
    const stateRef = useRef("team1Ban1"); // Ref to track the latest state
    const targetPokemonRef = useRef(null); // Ref to track the latest targetPokemon
    const timerRef = useRef(null); // Ref to store the timer timeout ID
    
    // WebRTC and Room states
    const socketRef = useRef(null);
    const roomIdRef = useRef('');
    const [isConnected, setIsConnected] = useState(false);
    const [peer, setPeer] = useState(null);
    const [connection, setConnection] = useState(null);
    const [inputRoomId, setInputRoomId] = useState('');
    const [showRoomIdInput, setShowRoomIdInput] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const peerRef = useRef(null);
    const connectionRef = useRef(null);
    const isHostRef = useRef(false);
    const isConnectedRef = useRef(false);

    const draftProgression = ['team1Ban1', 'team2Ban1', 'team1Ban2', 'team2Ban2', 'team1Pick1', 'team2Pick1', 'team2Pick2', 'team1Pick2', 'team1Pick3', 'team2Pick3', 'team2Pick4', 'team1Pick4', 'team1Pick5', 'team2Pick5', 'done'];

    // Update the ref whenever targetPokemon changes
    useEffect(() => {
        targetPokemonRef.current = targetPokemon;
        console.log('targetPokemon changed:', targetPokemon);
    }, [targetPokemon]);

    // Initialize isConnectedRef to false
    useEffect(() => {
        isConnectedRef.current = false;
    }, []);

    useEffect(() => {
        console.log('isHost1:', isHostRef.current);
    }, [isHostRef.current]);

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io('http://localhost:3001');
        socketRef.current = newSocket;

        // Socket event listeners
        newSocket.on('connect', () => {
            console.log('Connected to socket server with ID:', newSocket.id);
        });

        newSocket.on('room-created', (data) => {
            console.log('Room created:', data);
            roomIdRef.current = data.roomId;
            isHostRef.current = true;
            setConnectionStatus('Waiting for opponent...');
        });

        newSocket.on('user-joined', (data) => {
            console.log('User joined:', data);
            if (isHostRef.current) {
                // If we're the host and someone joins, initiate the WebRTC connection
                initiatePeerConnection();
            }
            setConnectionStatus('User joined: ' + data.userId);
        });

        newSocket.on('room-ready', (data) => {
            console.log('Room is ready:', data);
            setConnectionStatus('Room ready - Starting draft...');
        });

        newSocket.on('user-left', (data) => {
            console.log('User left:', data);
            setConnectionStatus('Opponent disconnected');
            // Clean up peer connection if opponent leaves
            if (connectionRef.current) {
                connectionRef.current.close();
                connectionRef.current = null;
            }
        });

        // Clean up on unmount
        return () => {
            if (peerRef.current) {
                peerRef.current.destroy();
            }
            if (connectionRef.current) {
                connectionRef.current.close();
            }
            newSocket.disconnect();
        };
    }, []);

    // Update peer ref when peer state changes
    useEffect(() => {
        peerRef.current = peer;
    }, [peer]);

    // Update connection ref when connection state changes
    useEffect(() => {
        connectionRef.current = connection;
    }, [connection]);

    // PeerJS connection handlers
    const initiatePeerConnection = () => {
        console.log('Initiating PeerJS connection as host');
        // Create a new peer with random ID
        const peerId = 'host-' + Math.random().toString(36).substring(2, 8);
        
        try {
            const newPeer = new Peer(peerId);
            
            newPeer.on('open', (id) => {
                console.log('Host PeerJS connection opened with ID:', id);
                setIsConnected(true);
                isConnectedRef.current = true;
                
                // Wait for incoming connection
                newPeer.on('connection', (conn) => {
                    console.log('Host received connection from peer:', conn);
                    
                    setupConnectionEvents(conn);
                    setConnection(conn);
                    setConnectionStatus('Connected to peer!');
                });
                
                // Inform guests of the host's peer ID through the socket
                if (socketRef.current && roomIdRef.current) {
                    console.log('Sending peer ID to guests via socket:', id);
                    socketRef.current.emit('signal', {
                        roomId: roomIdRef.current,
                        to: null,
                        signal: { type: 'peer-id', peerId: id }
                    });
                } else {
                    console.error('Cannot send peer ID: socket or roomId is missing', { socket: !!socketRef.current, roomId: roomIdRef.current });
                }
            });
            
            newPeer.on('error', (err) => {
                console.error('PeerJS error on host peer:', err);
                setConnectionStatus('Host connection error: ' + err);
            });
            
            setPeer(newPeer);
        } catch (err) {
            console.error('Error creating PeerJS object:', err);
            setConnectionStatus('Failed to create connection: ' + err.message);
        }
    };

    // Listen for peer ID from the host via socket.io
    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on('signal', (data) => {
                console.log('Received signal:', data);
                
                // Handle PeerJS signaling
                if (data.signal && data.signal.type === 'peer-id') {
                    console.log('Received peer ID:', data.signal.peerId);
                    if (!isHostRef.current) {
                        console.log('Client will connect to host with peer ID:', data.signal.peerId);
                        // If we're not the host, connect to the host using their peer ID
                        joinPeerConnection(data.signal.peerId);
                    } else {
                        console.log('Host received own peer ID signal, ignoring');
                    }
                } else {
                    console.log('Received non-peer-id signal:', data.signal);
                }
            });
        }
        
        return () => {
            if (socketRef.current) {
                socketRef.current.off('signal');
            }
        };
    }, []);

    // Modify joinPeerConnection to have better debug logs and error handling
    const joinPeerConnection = (hostPeerId) => {
        console.log('Joining PeerJS connection as guest to host with ID:', hostPeerId);
        // Create a new peer with random ID
        const peerId = 'guest-' + Math.random().toString(36).substring(2, 8);
        const newPeer = new Peer(peerId);
        
        newPeer.on('open', (id) => {
            console.log('Guest PeerJS connection opened with ID:', id);
            
            // Connect to the host
            try {
                console.log('Attempting to connect to host:', hostPeerId);
                const conn = newPeer.connect(hostPeerId);
                
                console.log('Created connection object:', conn);
                
                // Important: Need to wait for 'open' event on the conn object
                // The handler is set up in setupConnectionEvents
                setupConnectionEvents(conn);
                setConnection(conn);
            } catch (err) {
                console.error('Error connecting to host:', err);
                setConnectionStatus('Error connecting to host: ' + err.message);
            }
        });
        
        newPeer.on('error', (err) => {
            console.error('PeerJS error on guest peer:', err);
            setConnectionStatus('Connection error: ' + err);
        });
        
        setPeer(newPeer);
    };

    const setupConnectionEvents = (conn) => {
        // Make sure the connection isn't null
        if (!conn) {
            console.error('Setup called with null connection');
            return;
        }
        
        console.log('Setting up connection events for connection:', conn);
        
        conn.on('open', () => {
            console.log('Connection to peer successfully established!');
            setIsConnected(true);
            isConnectedRef.current = true;
            setConnectionStatus('Connected to peer!');
            
            // Test the connection
            try {
                conn.send({
                    type: 'connectionTest',
                    message: 'Connection successful!'
                });
                console.log('Sent test message over peer connection');
            } catch (err) {
                console.error('Error sending test message:', err);
            }
        });
        
        conn.on('data', (data) => {
            console.log('Received message from peer:', data);
            
            // Handle different types of messages
            if (data.type === 'draftAction') {
                handleRemoteDraftAction(data.action, data.data);
            } else if (data.type === 'targetPokemon') {
                // Only update targetPokemon if it's different to avoid infinite loops
                if (JSON.stringify(data.pokemon) !== JSON.stringify(targetPokemon)) {
                    console.log('Received targetPokemon from peer:', data.pokemon);
                    setTargetPokemon(data.pokemon);
                }
            } else if (data.type === 'connectionTest') {
                console.log('Connection test received:', data.message);
            }
        });
        
        conn.on('close', () => {
            console.log('Connection to peer closed');
            setIsConnected(false);
            isConnectedRef.current = false;
            setConnectionStatus('Connection closed');
            setConnection(null);
        });
        
        conn.on('error', (err) => {
            console.error('Peer connection error:', err);
            setConnectionStatus('Connection error: ' + err);
        });
    };

    // Handle draft actions received from peer
    const handleRemoteDraftAction = (action, data) => {
        console.log('Handling remote draft action:', action, data);
        
        // "pokemon-selected" or "lock-in"
        console.log(action);
        console.log(data);
        switch (action) {
            case 'pokemon-selected':
                console.log('pokemon-selected');
                setTargetPokemon(data.pokemon);
                break;
            case 'lock-in':
                lockIn();
                break;
            default:
                console.warn('Unknown draft action:', action);
        }
    };

    // Send draft actions to peer
    const sendDraftAction = (action, data) => {
        if (connection && connectionRef.current && connectionRef.current.open) {
            const message = {
                type: 'draftAction',
                action,
                data
            };
            connectionRef.current.send(message);
            console.log('Sent draft action:', action, data);
            return true;
        } else {
            console.warn('Cannot send draft action - connection not open');
            return false;
        }
    };

    // Populates pokemonList with the return data from fetchCharacterDraftInfo() like name, class, id (status is initialized to none but will be changed to team1, team2, ban1, or ban2 to know where to place it and to gray it out) when the component first mounts.
    useEffect(() => {
        async function fetchCharacterListing() {
            try {
                const listing = await fetchCharacterDraftInfo();
                updatePokemonList(listing);
                updateFilteredList(listing);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching Pokemon Data:", error);
                setLoading(false);
            }
        }

        fetchCharacterListing(); // Call the fetch function to populate pokemonList
        setBackground();
    }, []); // Empty dependency array ensures this runs once when the component mounts

    /*
    useEffect(() => {
        if (!loading) {
            if(draftState !== 'done'){
                const timerElement = document.getElementById("timer");
                if (timerElement) {
                    timerElement.innerHTML = settings.timer;
                    stateRef.current = draftState; // Update the ref to the latest state
                    countdownTimer();
                }
            } else {
                const timerElement = document.getElementById("timer");
                if (timerElement) {
                    timerElement.innerHTML = 'Done';
                }
            }
        }
        
        // Cleanup function to clear the timeout when component unmounts or draft state changes
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [draftState, loading]); // reset the timer any time draft state changes
    */

    useEffect(() => {
        // Send selected pokemon to peer if connected
        console.log("Try to target");
        console.log(isConnected);
        console.log(connectionRef.current);
        // Make sure it is the current user's turn to pick so we don't send messages in circles
        // Change later to let users pick who is first pick but for now just host is second pick
        console.log(isHostRef.current);
        console.log(stateRef.current);
        if ((isHostRef.current && stateRef.current.includes('team2')) || (!isHostRef.current && stateRef.current.includes('team1'))){
            if (targetPokemon !== null && isConnected && connectionRef.current && connectionRef.current.open) {
                console.log('sending pokemon-selected to peer');
                sendDraftAction('pokemon-selected', { pokemon: targetPokemon });
            }
        }
    }, [targetPokemon]);

    function countdownTimer() {
        if(stateRef.current !== 'done'){
            const timer = document.getElementById("timer");
            if (!timer) return; // Exit if timer element doesn't exist
            
            const currTime = Number(timer.innerHTML);
            if(currTime > 0){
                timer.innerHTML = currTime - 1;
                timerRef.current = setTimeout(() => {
                    if (stateRef.current === draftState) {
                        countdownTimer(); // Continue countdown
                    }
                }, 1000);
            } else {
                if(Number.isNaN(currTime)){
                    return;
                }
                ranOutOfTime();
            }
        }
    }

    function genRandomPokemon() {
        const randIndex = Math.floor(Math.random() * pokemonList.length);
        const pokemon = pokemonList[randIndex];
        if (!team1Bans.includes(pokemon) && !team2Bans.includes(pokemon) && !team1Picks.includes(pokemon) && !team2Picks.includes(pokemon)) {
            return pokemon;
        } 
        return genRandomPokemon();
    }

    function ranOutOfTime() {
        // Can just move to next index in draftProgression to keep track of draft state
        const currentIndex = draftProgression.indexOf(draftState);
        // Ensure it's not the last state
        if (currentIndex >= 0 && currentIndex < draftProgression.length - 1) {
            // Get the next state
            const nextState = draftProgression[currentIndex + 1];
            // Update the draft state
            updateDraftState(nextState);
            const none = {pokemon_name: 'none', pokemon_class: 'none'};

            let actionPokemon = none;
            if (targetPokemonRef.current !== null){
                actionPokemon = targetPokemonRef.current;
            } else if (draftState.startsWith('team1Pick') || draftState.startsWith('team2Pick')){
                actionPokemon = genRandomPokemon();
            } else if (draftState.startsWith('team1Ban') || draftState.startsWith('team2Ban')){
                actionPokemon = none;
            }
            // Perform the action based on the current state
            switch (draftState) {
                case 'team1Ban1':
                case 'team1Ban2':
                    updatePokemonStatus(actionPokemon, 'ban1');
                    break;
                case 'team2Ban1':
                case 'team2Ban2':
                    updatePokemonStatus(actionPokemon, 'ban2');
                    break;
                case 'team1Pick1':
                case 'team1Pick2':
                case 'team1Pick3':
                case 'team1Pick4':
                case 'team1Pick5':
                    updatePokemonStatus(actionPokemon, 'team1');
                    break;
                case 'team2Pick1':
                case 'team2Pick2':
                case 'team2Pick3':
                case 'team2Pick4':
                case 'team2Pick5':
                    updatePokemonStatus(actionPokemon, 'team2');
                    break;
                default:
                    console.error('Unhandled draft state:', draftState);
            }
        } else {
            console.warn('Draft is already at the final state or invalid state.');
        }
    }

    function lockIn(){
        if(targetPokemon !== null){
            // Send lock-in action to peer if connected
            console.log("try to lock in");
            if (isConnected && connectionRef.current && connectionRef.current.open) {
                console.log("try to lock in 2");
                sendDraftAction('lock-in', { pokemon: targetPokemon });
            }
            
            switch (draftState) {
                case 'team1Ban1':
                case 'team1Ban2':
                    updatePokemonStatus(targetPokemon, 'ban1');
                    break;
                case 'team2Ban1':
                case 'team2Ban2':
                    updatePokemonStatus(targetPokemon, 'ban2');
                    break;
                case 'team1Pick1':
                case 'team1Pick2':
                case 'team1Pick3':
                case 'team1Pick4':
                case 'team1Pick5':
                    updatePokemonStatus(targetPokemon, 'team1');
                    break;
                case 'team2Pick1':
                case 'team2Pick2':
                case 'team2Pick3':
                case 'team2Pick4':
                case 'team2Pick5':
                    updatePokemonStatus(targetPokemon, 'team2');
                    break;
                default:
                    console.error('Unhandled draft state:', draftState);
            }
        }
    }

    function updatePokemonStatus(pokemon, newStatus) {
        switch(newStatus) {
            case 'ban1':
                updateTeam1Bans(prevBans => [...prevBans, pokemon]);
                break;
            case 'ban2':
                updateTeam2Bans(prevBans => [...prevBans, pokemon]);
                break;
            case 'team1':
                updateTeam1Picks(prevPicks => [...prevPicks, pokemon]);
                break;
            case 'team2':
                updateTeam2Picks(prevPicks => [...prevPicks, pokemon]);
                break;
        }
        // Move the draft to the next state
        const currentIndex = draftProgression.indexOf(draftState);
        if (currentIndex >= 0 && currentIndex < draftProgression.length - 1) {
            const nextState = draftProgression[currentIndex + 1];
            updateDraftState(nextState);
        }
        // Reset the targetPokemon
        setTargetPokemon(null);
    };

    function setBackground(){
        const mainContainer = document.getElementById("root");
        if (mainContainer) {
            let backgroundPath = "/assets/Draft/Background.png";
            mainContainer.style.backgroundImage = `url(${backgroundPath})`;
            mainContainer.style.backgroundSize = "cover";
        }
    }

    // Loading message while we're waiting on pokemonList
    if (loading) {
        return <div>Loading...</div>
    }

    // Implementation of createRoom function to create a new draft room
    async function handleCreateRoom() {
        try {
            // Create room in backend
            const response = await apiCreateRoom();
            const randomRoomId = response.roomId;
            console.log('Room created response:', response);
            
            // Join the room in socket.io
            if (socketRef.current) {
                socketRef.current.emit('create-room', randomRoomId);
                roomIdRef.current = randomRoomId;
                setConnectionStatus(`Room created: ${randomRoomId}`);
            }
        } catch (error) {
            console.error('Error creating room:', error);
            setConnectionStatus('Error creating room');
        }
    }

    // Implementation of joinRoom function to join an existing draft room
    function handleJoinRoom() {
        if (showRoomIdInput) {
            // If room ID input is already showing, attempt to join
            if (inputRoomId && socketRef.current) {
                socketRef.current.emit('join-room', inputRoomId);
                roomIdRef.current = inputRoomId;
                setConnectionStatus(`Joining room: ${inputRoomId}`);
                setShowRoomIdInput(false);
            }
        } else {
            // Show the room ID input
            setShowRoomIdInput(true);
        }
    }

    // Handle input change for room ID
    function handleInputChange(e) {
        setInputRoomId(e.target.value);
    }

  return (
    <div id="draftContainer">
        {!isConnected ? (
            <div id="roomControls">
                <button id="createRoomBTN" onClick={handleCreateRoom}>Create Room</button>
                <button id="joinRoomBTN" onClick={handleJoinRoom}>Join Room</button>
                {showRoomIdInput && (
                    <div id="roomIdInputContainer">
                        <input 
                            id="roomInput"
                            type="text" 
                            placeholder="Enter Room ID" 
                            value={inputRoomId}
                            onChange={handleInputChange}
                            maxLength="6"
                        />
                        <button id="joinRoomBTN" onClick={handleJoinRoom}>Join</button>
                    </div>
                )}
                <div id="connectionStatus">{connectionStatus}</div>
                {roomIdRef.current && <div id="roomIdDisplay">Room ID: {roomIdRef.current}</div>}
            </div>
        ) : (
            <div id="connectionInfo">
                <div id="connectionStatus">{connectionStatus}</div>
                {roomIdRef.current && <div id="roomIdDisplay">Room ID: {roomIdRef.current}</div>}
            </div>
        )}
        <div id="purpleDraftContainer" className="draftContainer">
            <TeamDisplay team={'purple'} bans={team1Bans} picks={team1Picks} ></TeamDisplay>
        </div>
        <div id="middlePartsContainer">
            <div id="timerContainer">
                <button id="timer"></button> 
            </div>
            <div id="draftBoardContainer">
                <Filtering pokemonList={pokemonList} updateFilteredList={updateFilteredList} ></Filtering>
                <div className="characterSelect">
                    <DraftListing pokemonList={filteredList} team1Bans={team1Bans}  team2Bans={team2Bans}  team1Picks={team1Picks}  team2Picks={team2Picks} draftState={draftState} updateDraftState={updateDraftState} updatePokemonStatus={updatePokemonStatus} draftProgression={draftProgression} numUsers={numUsers} settings={settings} targetPokemon={targetPokemon} setTargetPokemon={setTargetPokemon} />
                </div>
            </div>
            <div id="lockInContainer">
                <button id="lockInBTN" className={targetPokemon !== null ? 'active' : ''} onClick={lockIn}>Lock In</button>
            </div>
        </div>
        <div id="orangeDraftContainer" className="draftContainer">
            <TeamDisplay team={'orange'} bans={team2Bans} picks={team2Picks} ></TeamDisplay>
        </div>
    </div>
  );
}

export default MultiDraft;