import '../../css/statSupport/statsOrdering.css';

function StatsOrdering({ setOrderBy, orderingArray }) {
    
    return (
        <div id="stats-ordering-container">
            <div className="stats-order-by-dropdown-container">
                <div className="stats-on-dropdown-label">Order By</div>
                <select name="orderBy" id="stats-order-by-dropdown" onChange={(e) => setOrderBy(e.target.value)}>
                    {orderingArray.map((element) => (
                        <option key={element.value} value={element.value}>{element.title}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default StatsOrdering;