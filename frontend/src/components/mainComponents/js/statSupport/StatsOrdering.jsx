import React, { useEffect, useState } from 'react';

function StatsOrdering({ setOrderBy }) {
    
    return (
        <div id="orderingContainer">
            <h3>Order By</h3>
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