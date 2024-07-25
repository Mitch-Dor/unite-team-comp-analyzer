import React from 'react';
import CharacterList from './draftSupport/CharacterList';
import '../css/draft.css';

function Draft() {
  return (
    <div id="draftContainer">
        <div id="purpleDraftContainer" class="draftContainer">
            <div id="purpleBans">
                <image id="ban1P" class="characterPortrait banDisplay"></image>
                <image id="ban2P" class="characterPortrait banDisplay"></image>
            </div>
            < CharacterList />
            <div id="pick1" class="characterSelection purpleSelection">
                <h3>Character</h3>
                <image class="characterPortrait"></image>
            </div>
            <div id="pick2" class="characterSelection purpleSelection">
                <h3>Character</h3>
                <image class="characterPortrait"></image>
            </div>
            <div id="pick3" class="characterSelection purpleSelection">
                <h3>Character</h3>
                <image class="characterPortrait"></image>
            </div>
            <div id="pick4" class="characterSelection purpleSelection">
                <h3>Character</h3>
                <image class="characterPortrait"></image>
            </div>
            <div id="pick5" class="characterSelection purpleSelection">
                <h3>Character</h3>
                <image class="characterPortrait"></image>
            </div>
            {/* These five would be made in a for loop */}
        </div>
        <div id="middlePartsContainer">
            <div id="timerContainer">
                <button id="timer"></button> 
                {/* Timer will not actually do anything on-click */}
            </div>
            <div id="draftBoardContainer">
                <input type="text" id="searchBar" placeholder="Search..."></input>
                <div class="characterSelect">
                    {
                        
                    }
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait ban"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait selected"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait selected"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait selected"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                    <div class="draftCharacter">
                        <image class="characterPortrait"></image>
                        <h4>Character</h4>
                    </div>
                </div>
            </div>
            <div id="lockInContainer">
                <button id="lockInBTN"></button>
            </div>
        </div>
        <div id="orangeDraftContainer" class="draftContainer">
            <div id="orangeBans">
                <image id="ban1O" class="characterPortrait banDisplay"></image>
                <image id="ban2O" class="characterPortrait banDisplay"></image>
            </div>
            <div id="pick1" class="characterSelection orangeSelection">
                <image class="characterPortrait"></image>
                <h3>Character</h3>
            </div>
            <div id="pick2" class="characterSelection orangeSelection">
                <image class="characterPortrait"></image>
                <h3>Character</h3>
            </div>
            <div id="pick3" class="characterSelection orangeSelection">
                <image class="characterPortrait"></image>
                <h3>Character</h3>
            </div>
            <div id="pick4" class="characterSelection orangeSelection">
                <image class="characterPortrait"></image>
                <h3>Character</h3>
            </div>
            <div id="pick5" class="characterSelection orangeSelection">
                <image class="characterPortrait"></image>
                <h3>Character</h3>
            </div>
        </div>
    </div>
  );
}

export default Draft;