import React, { useEffect, useState } from 'react';

function StatsOrdering({ setOrderBy }) {
    
    return (
        <div id="orderingContainer">
            <h3>Order By</h3>
            <div id="orderInfo" title="
            Filter descriptions:

            Player: Cuts all picks to picks played specifically by that player. Bans are any bans made by the team the player was on.

            Team: Cuts all picks to picks played by that team. Bans are any bans made by that team.

            Region: Cuts all picks to picks made by teams belonging to that region. Bans are any bans made by a team belonging to that region.

            Event: Cuts all picks and bans to picks/bans that happened at that particular event.

            Date: Limits the search to events that happened within the specified time range.
            ">?</div>
            <select name="orderBy" id="orderBy" onChange={(e) => setOrderBy(e.target.value)}>
                <option value="all">All Stats</option>
                <option value="ban">Ban Rate</option>
                <option value="pick">Pick Rate</option>
                <option value="presence">Presence</option>
                <option value="win">Win Rate</option>
                <option value="pickOrder">Pick Order</option> 
                {/* Display bar groups of the number of times a Pokemon was chosen in the 1st, 2nd, 3rd, etc rounds. Each pokemon will therefore have 6 bars. */}
            </select>
        </div>
    )
}

export default StatsOrdering;