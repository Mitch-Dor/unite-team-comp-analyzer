import React, { useState, useEffect } from 'react';
import '../css/traits.css';
import pokemonData from './pokemonData';

function Traits() {
  const [traitsData, setTraitsData] = useState([]);
  const [columnOptions, setColumnOptions] = useState({});
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Define column order and widths
  const columnConfig = {
    Name: { width: '150px' },
    Classification: { width: '120px' },
    EarlyGame: { width: '100px' },
    MidGame: { width: '100px' },
    LateGame: { width: '100px' },
    Mobility: { width: '100px' },
    Range: { width: '100px' },
    Bulk: { width: '100px' },
    Damage: { width: '100px' },
    DamageType: { width: '120px' },
    DamageAffect: { width: '120px' },
    CC: { width: '100px' },
    PlayStyle: { width: '120px' },
    OtherAttr: { width: '120px' },
    AssumedMove1: { width: '150px' },
    AssumedMove2: { width: '150px' }
  };

  useEffect(() => {
    // Get unique values for each column
    const options = {};
    Object.keys(pokemonData[0]).forEach(header => {
      options[header] = [...new Set(pokemonData.map(row => row[header]))].filter(Boolean);
    });

    setTraitsData(pokemonData);
    setColumnOptions(options);
    setTableData(pokemonData);
    
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const mainContainer = document.getElementById("mainContainer");
      if (mainContainer) {
        mainContainer.style.backgroundImage = `url("/assets/landingPageBackgrounds/Blurred/UNITE_Theia_Sky_Ruins.png")`;
      } else {
        console.error("mainContainer not found");
      }
    }, 0);
  }, []);

  const handleCellChange = (rowIndex, column, value) => {
    setTableData(prevData => {
      const newData = [...prevData];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [column]: value
      };
      return newData;
    });
  };

  const filteredData = tableData.filter(row => 
    Object.values(row).some(value => 
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (!traitsData.length) {
    return <div>Loading...</div>;
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
                        value={row[column]}
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