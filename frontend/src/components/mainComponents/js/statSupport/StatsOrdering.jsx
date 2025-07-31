function StatsOrdering({ setOrderBy, orderingArray, setBattleMode }) {
    
    return (
        <div id="orderingContainer">
            <h3>Order By</h3>
            {orderingArray[1].value==='ban' && (
                <div id="orderInfo" title="
                Filter descriptions:

                Player: Cuts all picks to picks played specifically by that player. Bans are any bans made by the team the player was on.

                Team: Cuts all picks to picks played by that team. Bans are any bans made by that team.

                Region: Cuts all picks to picks made by teams belonging to that region. Bans are any bans made by a team belonging to that region.

                Event: Cuts all picks and bans to picks/bans that happened at that particular event.

                Date: Limits the search to events that happened within the specified time range.
                ">?
                </div>
            )}
            {orderingArray[1].value==='kills' && (
                <select name="battleMode" id="battleModeSelector" onChange={(e) => setBattleMode(e.target.value)}>
                    <option value='allPokemon'>All Pokemon</option>
                    <option value='individual'>Individual</option>
                </select>
            )}
            <select name="orderBy" id="orderBy" onChange={(e) => setOrderBy(e.target.value)}>
                {orderingArray.map((element) => (
                    <option key={element.value} value={element.value}>{element.title}</option>
                ))}
            </select>
        </div>
    )
}

export default StatsOrdering;