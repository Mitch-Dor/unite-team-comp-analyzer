import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/traits.css';
import { updateCharacterAttributes, fetchAllCharacterAttributes } from './backendCalls/http.js';
import Home from '../../sideComponents/js/Home.jsx';

function Traits() {
  const [columnOptions, setColumnOptions] = useState({});
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
    assumed_move_2: { width: '150px' }
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

    return 'text-none';
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
        if (!loading){
          // If the page is still loading mainContainer is expected to not be found
          console.error("mainContainer not found");
        }
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
      updateCharacterAttributes(newData[rowIndex].pokemon_id, newData[rowIndex], user.user_google_id);
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
                      <div className="select-wrapper">
                        <select
                          value={row[column] || ''}
                          onChange={(e) => handleCellChange(rowIndex, column, e.target.value)}
                          className={getTextClass(column, row[column], row)}
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
                  ))}
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