import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/tierList.css';
import '../css/classBackgrounds.css';
import { fetchCharacterDraftInfo, fetchAllTierListEntries, insertTierListEntry, isAdmin, fetchAllCharactersAndMoves } from './common/http.js';
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { FaFilePdf } from "react-icons/fa";
import Home from '../../sideComponents/js/Home.jsx';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getCharactersMovesDictionary } from './common/common.js';

function TierList() {
  const location = useLocation();
  const { user } = location.state || {};
  const [pokemonList, updatePokemonList] = useState([]);
  const [pokemonToMoves, setPokemonToMoves] = useState([]);
  const [items, setItems] = useState({
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
    E: [],
    F: [],
    unassigned: []
  });
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [heightShiftAmount, setHeightShiftAmount] = useState(0);
  const tiers = ['S', 'A', 'B', 'C', 'D', 'E', 'F'];
  const [customNameTiers, setCustomNameTiers] = useState(['S', 'A', 'B', 'C', 'D', 'E', 'F']);
  const [selectedPokemon, setSelectedPokemon] = useState();
  const [movesMode, setMovesMode] = useState("off");
  const [setMovesPokemon, setSetMovesPokemon] = useState(null);
  const [addPokemon, setAddPokemon] = useState("none");
  const assignedRef = useRef(null);

  useEffect(() => {
    async function fetchCharacterListing() {
        try {
            const listing = await fetchCharacterDraftInfo();
            updatePokemonList(listing);
        } catch (error) {
            console.error("Error fetching Pokemon Data:", error);
        }
    }

    async function fetchCharacterMovesDict() {
      try {
        const charactersAndMoves = await fetchAllCharactersAndMoves();
        setPokemonToMoves(getCharactersMovesDictionary(charactersAndMoves));
      } catch (error) {
        console.error("Error fetching characters and moves: ", error);
      }
    }

    const tierNames = getLocalStorage('tierNames');
    if (tierNames) {
      setCustomNameTiers(tierNames);
    }

    fetchCharacterListing();
    fetchCharacterMovesDict();
  }, []); 

  useEffect(() => {
    async function checkAdmin() {
      if (user) {
        const admin = await isAdmin();
        setAdmin(admin);
      }
    }
    checkAdmin();
  }, [user]);

  useEffect(() => {
    if (admin) {
      applyDefaultTiers();
    }
  }, [pokemonList, admin]);

  useEffect(() => {
    if (pokemonList.length === 0) return;
    const savedTiers = getLocalStorage('tierList');
    if (savedTiers) {
      const newTiers = {
        S: [], A: [], B: [], C: [], D: [], E: [], F: [], unassigned: []
      };
      // Fill out cookie data and put it into proper tier
      savedTiers.forEach((item, index) => {
        const foundPokemon = pokemonList.find(p => p.pokemon_id === item.pokemon_id);
        newTiers[item.tier].push({
          id: index,
          pokemon_id: item.pokemon_id,
          pokedex_number: foundPokemon.pokedex_number,
          tier: item.tier,
          pokemon_name: foundPokemon.pokemon_name,
          pokemon_class: foundPokemon.pokemon_class,
          moves: item.moves
        });
      });
      setItems(newTiers);
    } else {
      // First time on tiers fully blank
      setItems(prevItems => ({
        ...prevItems,
        unassigned: pokemonList.map((pokemon) => ({
          id: pokemon.pokemon_id,
          pokemon_id: pokemon.pokemon_id,
          pokedex_number: pokemon.pokedex_number,
          tier: 'unassigned',
          pokemon_name: pokemon.pokemon_name,
          pokemon_class: pokemon.pokemon_class,
          moves: []
        }))
      }));
    }
  }, [pokemonList]);

  useEffect(() => {
    if (items && Object.values(items).some(arr => arr.length > 0)) {
      setLocalStorage('tierList', items);
    }
  }, [items]);

  useEffect(() => {
    setLocalStorage('tierNames', customNameTiers);
  }, [customNameTiers]);

  useEffect(() => {
    document.documentElement.style.setProperty('--height-shift-amount', `${heightShiftAmount}%`);
  }, [heightShiftAmount]);

  function handleDragStart(e, item) {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
  };

  function handleDrop(e, targetTier) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const itemData = JSON.parse(e.dataTransfer.getData('text/plain'));
    const sourceTier = itemData.tier;
    
    if (sourceTier === targetTier) return;

    setItems(prevItems => {
      const newItems = { ...prevItems };
      // Remove from source tier
      newItems[sourceTier] = newItems[sourceTier].filter(item => item.id !== itemData.id);
      // Add to target tier
      newItems[targetTier] = [...newItems[targetTier], { ...itemData, tier: targetTier }]; 
      return newItems;
    });

    if (admin) {
      insertTierListEntry(targetTier, itemData.id);
    }
  };

  const classSections = [
    { class: 'Attacker', title: 'Attackers' },
    { class: 'Speedster', title: 'Speedsters' },
    { class: 'Supporter', title: 'Supporters' },
    { class: 'All_Rounder', title: 'All-Rounders' },
    { class: 'Defender', title: 'Defenders' }
  ];

  function getUnassignedByClass(className) {
    return items.unassigned.filter(item => item.pokemon_class === className);
  };

  async function applyDefaultTiers() {
    try {
      setLoading(true);
      const tierEntries = await fetchAllTierListEntries();
      
      // Create a new items state based on default tiers
      const newItems = {
        S: [],
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: [],
        unassigned: [] // Start with empty unassigned
      };

      // First, collect all pokemon from the pokemonList to ensure we have them all
      const allCharacters = pokemonList.map((pokemon, index) => ({
        id: index,
        pokemon_id: pokemon.pokemon_id,
        tier: 'unassigned',
        pokemon_name: pokemon.pokemon_name,
        pokemon_class: pokemon.pokemon_class,
        pokedex_number: pokemon.pokedex_number,
        moves: []
      }));
      
      // Create a set of IDs for quick lookup
      const characterIdsSet = new Set(allCharacters.map(char => char.id));
      
      // Apply tier entries
      tierEntries.forEach(entry => {
        const pokemonId = entry.pokemon_id;
        const targetTier = entry.tier_name;
        
        // Find the Pokemon in our list
        const pokemonIndex = allCharacters.findIndex(p => p.id === pokemonId);
        
        if (pokemonIndex !== -1) {
          // Found the pokemon - add to appropriate tier and mark as processed
          const pokemon = allCharacters[pokemonIndex];
          newItems[targetTier].push({...pokemon, tier: targetTier});
          // Remove from our tracking set
          characterIdsSet.delete(pokemonId);
        }
      });
      
      // Any IDs still in the set need to be added to unassigned
      for (const character of allCharacters) {
        if (characterIdsSet.has(character.id)) {
          newItems.unassigned.push(character);
        }
      }
      
      setItems(newItems);
      setLoading(false);
    } catch (error) {
      console.error("Error applying default tiers:", error);
      setLoading(false);
    }
  }

  async function emptyTiers() {
    if (pokemonList.length > 0) {
      // Set every pokemon to unassigned and then set that to items
      const newItems = {
        S: [],
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: [],
        unassigned: []
      };
      
      // Move all pokemon to unassigned
      newItems.unassigned = pokemonList.map((pokemon, index) => ({
        id: index,
        pokemon_id: pokemon.pokemon_id,
        tier: 'unassigned',
        pokemon_name: pokemon.pokemon_name,
        pokemon_class: pokemon.pokemon_class,
        pokedex_number: pokemon.pokedex_number,
        moves: []
      }));
      setItems(newItems);
    }
  }

  function handleClickPokemon(targetTier) {
    if(!selectedPokemon) return;

    // Assign selected pokemon to this tier and then clear selected pokemon
    const itemData = selectedPokemon;
    setSelectedPokemon();
    const sourceTier = itemData.tier;
    
    if (sourceTier === targetTier) return;

    setItems(prevItems => {
      const newItems = { ...prevItems };
      // Remove from source tier
      newItems[sourceTier] = newItems[sourceTier].filter(item => item.id !== itemData.id);
      // Add to target tier
      newItems[targetTier] = [...newItems[targetTier], { ...itemData, tier: targetTier }]; 
      return newItems;
    });

    if (admin) {
      insertTierListEntry(targetTier, itemData.id);
    }
  }

  async function handleExportPDF() {
    const input = assignedRef.current;
    if (!input) return;
  
    // Temporarily expand the div to full height
    const originalHeight = input.style.height;
    const originalOverflow = input.style.overflow;
    input.style.height = `${input.scrollHeight}px`;
    input.style.overflow = "visible";
  
    // Load background
    const background = await new Promise((resolve, reject) => {
      const img = new Image();
      img.src = "/assets/landingPageBackgrounds/Blurred/UNITE_Theia_Sky_Ruins.png";
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  
    // Capture the div
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });
  
    // Restore original styles
    input.style.height = originalHeight;
    input.style.overflow = originalOverflow;
  
    // Combine with background
    const combinedCanvas = document.createElement("canvas");
    combinedCanvas.width = canvas.width;
    combinedCanvas.height = canvas.height;
    const ctx = combinedCanvas.getContext("2d");
    ctx.drawImage(background, 0, 0, combinedCanvas.width, combinedCanvas.height);
    ctx.drawImage(canvas, 0, 0);
  
    const imgData = combinedCanvas.toDataURL("image/png");
  
    // Generate PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (combinedCanvas.height * pdfWidth) / combinedCanvas.width;
  
    let heightLeft = pdfHeight;
    let position = 0;
  
    while (heightLeft > 0) {
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      position -= pdf.internal.pageSize.getHeight();
      if (heightLeft > 0) pdf.addPage();
    }
  
    window.open(pdf.output("bloburl"), "_blank");
  }
  

  function setLocalStorage(name, value, days = 7) {
    if (name === 'tierList') {
      // Only store the IDs for each tier so the cookie isn't too big
      const essentialsOnly = [];
      Object.keys(value).forEach(tier => {
        value[tier].forEach(item => {
          essentialsOnly.push({ pokemon_id: item.pokemon_id, tier: item.tier, moves: item.moves });
        });
      });
      localStorage.setItem('tierList', JSON.stringify(essentialsOnly));
    } else if (name === 'tierNames') {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      let formulated = name + '=' + encodeURIComponent(JSON.stringify(value)) + '; expires=' + expires + '; path=/';
      document.cookie = formulated;
    }
  }

  function getLocalStorage(name) {
    if (name === 'tierList') {
      return JSON.parse(localStorage.getItem('tierList'));
    } else if (name === 'tierNames') {
      // Decoding Array
      return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? JSON.parse(decodeURIComponent(parts[1])) : r
      }, '');
    }
  }

  function DraggableItem({item}) {
    return (
      <div
        key={item.id}
        className={`tier-list-draggable-item ${item.pokemon_class} ${selectedPokemon && item.id === selectedPokemon.id ? 'selected' : ''}`}
        draggable
        onDragStart={(e) => handleDragStart(e, item)}
        onClick={(e) => {e.stopPropagation();
          setSelectedPokemon(item)
        }}
      >
        <img 
          src={`/assets/Draft/headshots/${item.pokemon_name}.png`}
          alt={item.pokemon_name}
          className="tier-list-pokemon-image"
        />
        {movesMode==="on" && (
          <>
            <div className={`tier-list-pokemon-assign-moves-button ${setMovesPokemon === item ? 'close' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (setMovesPokemon === item) {
                  setSetMovesPokemon(null);
                } else {
                  setSetMovesPokemon(item);
                }
              }}>{setMovesPokemon === item ? '-' : '+'}
            </div>
            <div className="tier-list-pokemon-assigned-moves-container">
              {item.moves.map((move, i) => (
                <div
                  key={i}
                  className="tier-list-pokemon-assigned-moves-move"
                  style={{ '--i': i, '--j': item.moves.length }}
                >
                  <img src={`/assets/Draft/moves/${item.pokemon_name}_${move.move_name.replace(/ /g, "_")}.png`} />
                </div>
              ))}
            </div>
          </>
        )}
        {setMovesPokemon && setMovesPokemon === item && (
          <div className="tier-list-assign-moves-container">
            {pokemonToMoves[item.pokemon_name].map((move, i) => (
              <div
                key={i}
                className="tier-list-assign-moves-move-assign-button"
                style={{ '--i': i, '--j': pokemonToMoves[item.pokemon_name].length }}
                onClick={(e) => {
                  e.stopPropagation();
                  setItems((prev) => {
                    // Clone the previous state to avoid direct mutation
                    const newItems = structuredClone(prev);
        
                    // Find the correct Pokémon inside its tier by matching IDs
                    const tierArray = newItems[item.tier];
                    const targetIndex = tierArray.findIndex(p => p.id === item.id);

                    if (targetIndex === -1) return prev; // Pokémon not found, return unchanged

                    const currentMoves = tierArray[targetIndex].moves;
                    const moveIndex = currentMoves.findIndex(m => m.move_name === move.move_name);
        
                    if (moveIndex !== -1) {
                      // Remove if it exists
                      currentMoves.splice(moveIndex, 1);
                    } else {
                      // Add if it doesn't
                      currentMoves.push(move);
                    }
        
                    return newItems;
                  });
                }}
              >
                <img className={`${item.moves.some(m => m.move_name === move.move_name) ? 'disabled' : ''}`} src={`/assets/Draft/moves/${item.pokemon_name}_${move.move_name.replace(/ /g, "_")}.png`} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="tier-list-main-container">
    {admin && (
      <div className="tier-list-admin-warning">Warning: As an admin user, your changes will update the database.</div>
    )}
    <div id="tier-list-assigned-section-container" className="tier-list-section-container assigned">
      <div ref={assignedRef} className="tier-list-assigned-section">
        {tiers.map((tier, index) => (
          <div key={tier} className="tier-list-category">
            <div className="tier-list-category-label" contentEditable="true" suppressContentEditableWarning onBlur={(e) => {setCustomNameTiers(prevTiers => prevTiers.map((t, i) => i === index ? e.target.textContent : t))}}>{customNameTiers[index] === tier ? tier : customNameTiers[index]}</div>
            <div
              className={`tier-list-category-content ${selectedPokemon ? "selectable" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, tier)}
              onClick={() => {handleClickPokemon(tier)}}
            >
              {items[tier].sort((a, b) => a.pokedex_number - b.pokedex_number).map(item => (
                <DraggableItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <button 
        className="tier-list-default-tiers-button" 
        onClick={applyDefaultTiers}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Apply Default Tiers'}
      </button>
      <button 
        className="tier-list-empty-tiers-button" 
        onClick={emptyTiers}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Empty Tiers'}
      </button>
      <div className="tier-list-moves-mode-container" title="Moves Mode" onClick={() => {setMovesMode(movesMode === "off" ? "on" : "off")}}>
        <div className={`tier-list-moves-mode-slider-container ${movesMode}`}>
          <div className={`tier-list-moves-mode-slider ${movesMode}`}></div>
        </div>
      </div>
      <button className="tier-list-export-to-PDF-button" onClick={handleExportPDF}>
        <FaFilePdf/>
      </button>
      <div className="tier-list-category-height-adjust-container">
        <button className="tier-list-category-height-adjust-button" disabled={heightShiftAmount === -30} onClick={() => {setHeightShiftAmount(prev => prev !== -30 ? prev - 10 : prev);}}>
          <SlArrowUp />
        </button>
        <button className="tier-list-category-height-adjust-button" disabled={heightShiftAmount === 30} onClick={() => {setHeightShiftAmount(prev => prev !== 30 ? prev + 10 : prev);}}>
          <SlArrowDown />
        </button>
      </div>
    </div>
    
    <div id="tier-list-unassigned-section-container" className="tier-list-section-container">
      <div className={"tier-list-unassigned-section"}>
        {classSections.map(({ class: className, title }) => (
          <div key={className} className="tier-list-category">
            <div className="tier-list-category-label">
              {title}
              <div className="tier-list-category-add-pokemon-button" onClick={(e) => {
                const x = e.pageX;
                const y = e.pageY;
                setAddPokemon(title);
                document.documentElement.style.setProperty('--add-pokemon-left-amount', `${x}px`);
                document.documentElement.style.setProperty('--add-pokemon-bottom-amount', `${y}px`);
              }}>+</div>
            </div>
            {addPokemon === title && 
              <div className="tier-list-screen-cover" onClick={() => {setAddPokemon("none")}}>
                <div className="tier-list-category-add-pokemon-container" onClick={(e) => {e.stopPropagation()}}>
                  {pokemonList.filter(pokemon => pokemon.pokemon_class === className).sort((a, b) => a.pokedex_number - b.pokedex_number).map(item => (
                    <div
                      key={item.pokemon_id}
                      className={`tier-list-draggable-item ${item.pokemon_class}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setItems(prevItems => {
                          const newItems = { ...prevItems };
                    
                          // Compute new id based on max id in unassigned
                          const unassigned = newItems.unassigned;
                          const maxId = unassigned.length > 0 ? Math.max(...unassigned.map(i => i.id)) : 0;
                          const newId = maxId + 1;
                    
                          const newItem = { 
                            pokemon_id: item.pokemon_id,
                            pokemon_name: item.pokemon_name,
                            pokemon_class: item.pokemon_class,
                            pokedex_number: item.pokedex_number,
                            id: newId, 
                            tier: "unassigned",
                            moves: []
                          };
                    
                          newItems.unassigned = [...unassigned, newItem];
                    
                          return newItems;
                        });
                      }}
                    >
                      <img 
                        src={`/assets/Draft/headshots/${item.pokemon_name}.png`}
                        alt={item.pokemon_name}
                        className="tier-list-pokemon-image"
                      />
                    </div>
                  ))}
                </div>
              </div>
            }
            <div
              className={`tier-list-category-content ${selectedPokemon && selectedPokemon.tier !== "unassigned" ? "selectable" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'unassigned')}
              onClick={() => {handleClickPokemon('unassigned')}}
            >
              {getUnassignedByClass(className).sort((a, b) => a.pokedex_number - b.pokedex_number).map(item => (
                <DraggableItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    <Home />
    </div>
  );
}

export default TierList;