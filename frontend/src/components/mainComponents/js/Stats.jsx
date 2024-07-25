import React from 'react';
import '../css/stats.css';

function Stats() {
  return (
    <div id="mainContainer">
        <div id="filterContainer">
            <h3>Filters</h3>
            <select name="beforeAfter" id="beforeAfter">
                <option value="before">Before</option>
                <option value="after">After</option>
            </select>
            <input id="dateSelect" type="date"></input> 
            {/* Onload set this to be today by default */}
            <select name="region" id="region">
                {/* POPULATE THIS WITH JAVASCRIPT BY SEARCHING THROUGH ALL REGIONS */}
            </select>
            <select name="event" id="event">
                {/* <option value="NAIC">NAIC</option> */}
                {/* POPULATE THIS WITH JAVASCRIPT BY SEARCHING THROUGH ALL EVENTS */}
            </select>
            <select name="team" id="team">
                {/* POPULATE THIS WITH JAVASCRIPT BY SEARCHING THROUGH ALL TEAMS */}
            </select>
        </div>
        <div id="searchContainer">
            <h3>Search On</h3>
            <select name="searchOn" id="searchOn">
                <option value="all">All Stats</option>
                <option value="ban">Ban Rate</option>
                <option value="pick">Pick Rate</option>
                <option value="presence">Presence</option>
                <option value="win">Win Rate</option>
                <option value="pick">Pick Order</option> 
                {/* Display bar groups of the number of times a Pokemon was chosen in the 1st, 2nd, 3rd, etc rounds. Each pokemon will therefore have 6 bars. */}
            </select>
        </div>
        <div id="graphContainer">
            {/* Dont know how to do graphs right now. Will be something with react */}
        </div>
    </div>
  );
}

export default Stats;