import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/traits.css';
import { updateCharacterAttribute, fetchAllCharacterAttributes } from './backendCalls/http.js';
import Home from '../../sideComponents/js/Home.jsx';

function Traits() {
  const [columnOptions, setColumnOptions] = useState({});
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useLocation().state;

  // Define column order and widths
  const columnConfig = {
    pokemon_name: { width: '150px' },
    pokemon_class: {width: '120px'},
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
    assumed_move_2: { width: '150px' },
    early_spike: { width: '100px' },
    ult_level: { width: '100px' },
    key_spike: { width: '100px' },
    laning_phase: { width: '100px' },
    "8_50_to_7_30": { width: "100px" },
    "7_30_to_6_30": { width: "100px" },
    "6_30_to_4": { width: "100px" },
    "4_to_end": { width: "100px" }
  };

  // Function to get class for pokemon_name based on pokemon_class
  const getPokemonNameClass = (row) => {
    const pokemonClass = row.pokemon_class;
    if (!pokemonClass) return 'text-none';

    if (pokemonClass === "Attacker") return 'text-attacker';
    if (pokemonClass === "Defender") return 'text-defender';
    if (pokemonClass === "Supporter") return 'text-supporter';
    if (pokemonClass === "All_Rounder") return 'text-all-rounder';
    if (pokemonClass === "Speedster") return 'text-speedster';
    
    return 'text-none';
  };

  // Function to determine text class based on cell content and column
  const getTextClass = (column, value, row) => {
    // Special case for pokemon_name - use class based on pokemon_class
    if (column === 'pokemon_name') {
      return getPokemonNameClass(row);
    }

    if (!value || value === 'None') return 'text-none';
    
    // 3 version ratings
    const ratingColumns = ['early_game', 'mid_game', 'late_game', 'mobility', 'range', 'bulk', 'damage', 'cc'];
    if (ratingColumns.includes(column)) {
      if (value === 'Low' || value === 'Weak') return 'text-low';
      if (value === 'Medium') return 'text-medium';
      if (value === 'High' || value === 'Strong') return 'text-high';
    }
    
    // Special coloring for damage_type
    if (column === 'damage_type') {
      if (value === 'Consistent') return 'text-consistent';
      if (value === 'Burst') return 'text-burst';
    }
    
    // Boolean columns
    const booleanColumns = ['can_exp_share', 'can_top_lane_carry', 'can_jungle_carry', 'can_bottom_lane_carry'];
    if (booleanColumns.includes(column)) {
      if (value === 'Yes' || value === 'True' || value === 'true') return 'text-high';
      if (value === 'No' || value === 'False' || value === 'false') return 'text-low';
    }

    // Lane / Role / Classification columns
    if (column === 'best_lane' || column === 'pokemon_class' || column === 'classification') {
      if (value === "Attacker" || value === "BottomCarry" || value === "ADC" || value === "UtilityMage" || value === "BurstMage") return 'text-attacker';
      if (value === "Defender" || value === "EXPShareBot" || value === "CCTank" || value === "Engage") return 'text-defender';
      if (value === "Supporter" || value === "EXPShareTop" || value ==="Buffer" || value === "Healer") return 'text-supporter';
      if (value === "All_Rounder" || value === "TopCarry" || value ==="Bruiser" || value === "DrainTank") return 'text-all-rounder';
      if (value === "Speedster" || value === "JungleCarry" || value === "Assassin") return 'text-speedster';
    }
    
    // Target / Damage Affect columns
    if (column === 'damage_affect') {
      if (value === "SingleTarget") return 'text-single-target';
      if (value === "SmallAOE") return 'text-high';
      if (value === "MediumAOE") return 'text-medium';
      if (value === "LargeAOE") return 'text-low';
    }

    // Other Attributes
    if (column === 'other_attr') {
      return value === "None" ? 'text-none' : 'text-rare';
    }

    // Play Style
    if (column === 'play_style') {
      if (value === "Teamfight") return 'text-defender';
      if (value === "Poke") return 'text-speedster';
      if (value === "SplitMap") return 'text-all-rounder';
      if (value === "Dive") return 'text-attacker';
      if (value === "Assist") return 'text-supporter';
    }

    // 1-10
    if (column === 'laning_phase' || column === '8_50_to_7_30' || column === '7_30_to_6_30' || column === '6_30_to_4' || column === '4_to_end') {
      if (parseInt(value) <= 3) return 'text-attacker';
      if (parseInt(value) <= 7) return 'text-supporter';
      if (parseInt(value) <= 10) return 'text-defender';
    }

    // Levels (1-15)
    if (column === 'early_spike' || column === 'ult_level' || column === 'key_spike') {
      if (parseInt(value) <= 5) return 'text-attacker';
      if (parseInt(value) <= 9) return 'text-supporter';
      if (parseInt(value) <= 15) return 'text-defender';
    }

    return 'text-none';
  };

  useEffect(() => {
    // Get unique values for each column
    async function fetchAttributes(){
      try {
        const attributes = await fetchAllCharacterAttributes();
        
        // Headers that should always have options 1–15
        const fifteenHeaders = new Set([
          "early_spike",
          "ult_level",
          "key_spike"
        ]);

        // Headers that should always have options 1–10
        const tenHeaders = new Set([
          "laning_phase",
          "8_50_to_7_30",
          "7_30_to_6_30",
          "6_30_to_4",
          "4_to_end"
        ]);

        // Generate column options from attributes data
        const options = {};
        Object.keys(columnConfig).forEach(header => {
          if (fifteenHeaders.has(header)) {
            // Always force 1–15
            options[header] = Array.from({ length: 15 }, (_, i) => i + 1);
          } else if (tenHeaders.has(header)) {
            // Always force 1–10
            options[header] = Array.from({ length: 10 }, (_, i) => i + 1);
          } else {
            // Collect from attributes, sort alphabetically
            const values = [...new Set(attributes.map(row => row[header]))]
              .filter(Boolean)
              .sort((a, b) => String(a).localeCompare(String(b)));

            options[header] = values;
          }
        });

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

  const handleCellChange = (rowIndex, column, value) => {
    setTableData(prevData => {
      const newData = [...prevData];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [column]: value
      };
      updateCharacterAttribute(newData[rowIndex].pokemon_id, column, value);
      return newData;
    });
  };

  function handleHidingUnhidingColumn(column) {
    setHiddenColumns((prev) => {
      if (prev.includes(column)) {
        // remove column
        return prev.filter((col) => col !== column);
      } else {
        // add column
        return [...prev, column];
      }
    });
  }

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
      <div id="traitsFilterContainer">
        {columns.map((column) => {
          return (
            <div className="columnSelector" key={column}>
              <input name={column} type="checkbox" checked={!hiddenColumns.includes(column)} onChange={() => {handleHidingUnhidingColumn(column)}}></input>
              <label htmlFor={column}>{column}</label>
            </div>
          );
        })}
      </div>
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
                {columns.map((column) => !hiddenColumns.includes(column) ? (
                    <th key={column} style={{ width: columnConfig[column].width }}>
                      {column}
                    </th>
                  ) : null
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map(column => !hiddenColumns.includes(column) ? (
                      <td key={column}>
                        <div className="select-wrapper">
                          <select
                            value={row[column] || ''}
                            onChange={(e) => handleCellChange(rowIndex, column, e.target.value)}
                            className={getTextClass(column, row[column], row)}
                            disabled={column === "pokemon_name" || column === "pokemon_class"}
                          >
                            <option value=""></option>
                            {columnOptions[column]?.map(option => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                  ) : null
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Home />
    </div>
  );
}

export default Traits;