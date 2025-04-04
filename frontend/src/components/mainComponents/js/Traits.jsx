import React, { useState, useEffect } from 'react';
import '../css/traits.css';
import { updateCharacterAttributes, fetchAllCharacterAttributes } from './backendCalls/http.js';
function Traits() {
  const [traitsData, setTraitsData] = useState([]);
  const [columnOptions, setColumnOptions] = useState({});
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Define column order and widths
  const columnConfig = {
    pokemon_name: { width: '150px' },
    classification: { width: '120px' },
    early_game: { width: '100px' },
    mid_game: { width: '100px' },
    late_game: { width: '100px' },
    mobility: { width: '100px' },
    range: { width: '100px' },
    bulk: { width: '100px' },
    damage: { width: '100px' },
    damage_type: { width: '120px' },
    damage_affect: { width: '120px' },
    cc: { width: '100px' },
    play_style: { width: '120px' },
    other_attr: { width: '120px' },
    can_exp_share: { width: '130px' },
    can_top_lane_carry: { width: '130px' },
    can_jungle_carry: { width: '130px' },
    can_bottom_lane_carry: { width: '130px' },
    best_lane: { width: '130px' },
    assumed_move_1: { width: '150px' },
    assumed_move_2: { width: '150px' }
  };

  useEffect(() => {
    // Get unique values for each column
    async function fetchAttributes(){
      try {
        const attributes = await fetchAllCharacterAttributes();
        
        // Generate column options from attributes data
        const options = {};
        Object.keys(columnConfig).forEach(header => {
          options[header] = [...new Set(attributes.map(row => row[header]))].filter(Boolean);
        });
        
        setTraitsData(attributes);
        setColumnOptions(options);
        setTableData(attributes);
        setLoading(false);
        
        return attributes;
      } catch (error) {
        console.error("Error fetching attributes:", error);
        setLoading(false);
      }
    }

    fetchAttributes();
  }, []);

  useEffect(() => {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const mainContainer = document.getElementById("mainContainer");
      if (mainContainer) {
        mainContainer.style.backgroundImage = `url("/assets/landingPageBackgrounds/Blurred/UNITE_Theia_Sky_Ruins.png")`;
      } else {
        console.error("mainContainer not found");
      }
    }, 0);
  }, [loading]);

  const handleCellChange = (rowIndex, column, value) => {
    setTableData(prevData => {
      const newData = [...prevData];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [column]: value
      };
      updateCharacterAttributes(newData[rowIndex].pokemon_name, newData[rowIndex]);
      return newData;
    });
  };

  const filteredData = tableData.filter(row => 
    Object.values(row).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  const columns = Object.keys(columnConfig);

  return (
    <div id="mainContainer" className="main-container">
      <div id="traitsContainer">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Pokémon or traits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="table-container">
          <table className="traits-table">
            <thead>
              <tr>
                {columns.map(column => (
                  <th key={column} style={{ width: columnConfig[column].width }}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map(column => (
                    <td key={column}>
                      <select
                        value={row[column] || ''}
                        onChange={(e) => handleCellChange(rowIndex, column, e.target.value)}
                      >
                        {columnOptions[column]?.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Traits;