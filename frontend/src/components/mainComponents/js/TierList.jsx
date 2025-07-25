import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/tierList.css';
import { fetchCharacterDraftInfo, fetchAllTierListEntries, insertTierListEntry, isAdmin } from './backendCalls/http.js';
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import Home from '../../sideComponents/js/Home.jsx';

function setCookie(name, value, days = 7) {
  if (name === 'tierList') {
    // Only store the IDs for each tier so the cookie isn't too big
    const idsOnly = {};
    Object.keys(value).forEach(tier => {
      idsOnly[tier] = value[tier].map(item => item.id);
    });
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    let formulated = name + '=' + encodeURIComponent(JSON.stringify(idsOnly)) + '; expires=' + expires + '; path=/';
    document.cookie = formulated;
  } else if (name === 'tierNames') {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    let formulated = name + '=' + encodeURIComponent(JSON.stringify(value)) + '; expires=' + expires + '; path=/';
    document.cookie = formulated;
  }
}

function getCookie(name) {
  if (name === 'tierList') {
    // Decoding Object
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r
    }, '');
  } else if (name === 'tierNames') {
    // Decoding Array
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? JSON.parse(decodeURIComponent(parts[1])) : r
    }, '');
  }
}

function TierList() {
  const location = useLocation();
  const { user } = location.state || {};
  const [pokemonList, updatePokemonList] = useState([]);
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
  const [isExpanded, setIsExpanded] = useState(false);
  const tiers = ['S', 'A', 'B', 'C', 'D', 'E', 'F'];
  const [customNameTiers, setCustomNameTiers] = useState(['S', 'A', 'B', 'C', 'D', 'E', 'F']);
  const [selectedPokemon, setSelectedPokemon] = useState();

  useEffect(() => {
    async function fetchCharacterListing() {
        try {
            const listing = await fetchCharacterDraftInfo();
            updatePokemonList(listing);
        } catch (error) {
            console.error("Error fetching Pokemon Data:", error);
        }
    }

    const tierNames = getCookie('tierNames');
    if (tierNames) {
      setCustomNameTiers(tierNames);
    }

    fetchCharacterListing();
    setBackground();
  }, []); 

  useEffect(() => {
    async function checkAdmin() {
      if (user) {
        const admin = await isAdmin(user.user_google_id);
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
    const savedTiers = getCookie('tierList');
    if (savedTiers) {
      try {
        const idsByTier = JSON.parse(savedTiers);
        // Reconstruct items with full pokemon objects
        const newItems = {
          S: [], A: [], B: [], C: [], D: [], E: [], F: [], unassigned: []
        };
        const assignedIds = new Set();
        Object.keys(newItems).forEach(tier => {
          if (idsByTier[tier]) {
            newItems[tier] = idsByTier[tier].map(id => {
              const poke = pokemonList.find(p => p.pokemon_id === id);
              if (poke) {
                assignedIds.add(id);
                return {
                  id: poke.pokemon_id,
                  tier: tier,
                  pokemon_name: poke.pokemon_name,
                  pokemon_class: poke.pokemon_class
                };
              }
              return null;
            }).filter(Boolean);
          }
        });
        setItems(newItems);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // If cookie is corrupted, ignore
      }
    } else {
      // First time on tiers fully blank
      setItems(prevItems => ({
        ...prevItems,
        unassigned: pokemonList.map((pokemon) => ({
          id: pokemon.pokemon_id,
          tier: 'unassigned',
          pokemon_name: pokemon.pokemon_name,
          pokemon_class: pokemon.pokemon_class
        }))
      }));
    }
  }, [pokemonList]);

  useEffect(() => {
    if (items && Object.values(items).some(arr => arr.length > 0)) {
      setCookie('tierList', items);
    }
  }, [items]);

  useEffect(() => {
    setCookie('tierNames', customNameTiers);
  }, [customNameTiers]);

  function setBackground(){
    const mainContainer = document.getElementById("mainContainer");
    if (mainContainer) {
      mainContainer.style.backgroundImage = `url("/assets/landingPageBackgrounds/Blurred/UNITE_Theia_Sky_Ruins.png")`;
      mainContainer.style.backgroundSize = "cover";
      mainContainer.style.backgroundRepeat = "repeat-x";
    }
  }

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e, targetTier) => {
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
      insertTierListEntry(targetTier, itemData.id, user.user_google_id);
    }
  };

  const classSections = [
    { class: 'Attacker', title: 'Attackers' },
    { class: 'Speedster', title: 'Speedsters' },
    { class: 'Supporter', title: 'Supporters' },
    { class: 'All_Rounder', title: 'All-Rounders' },
    { class: 'Defender', title: 'Defenders' }
  ];

  const getUnassignedByClass = (className) => {
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
      const allCharacters = pokemonList.map(pokemon => ({
        id: pokemon.pokemon_id,
        tier: 'unassigned',
        pokemon_name: pokemon.pokemon_name,
        pokemon_class: pokemon.pokemon_class
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
      newItems.unassigned = pokemonList.map(pokemon => ({
        id: pokemon.pokemon_id,
        tier: 'unassigned',
        pokemon_name: pokemon.pokemon_name,
        pokemon_class: pokemon.pokemon_class
      }));
      setItems(newItems);
    }
  }

  function handleClickPokemon(targetTier) {
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
      insertTierListEntry(targetTier, itemData.id, user.user_google_id);
    }
  }

  return (
    <div id="mainContainer">
    {admin && (
      <div className="admin-warning">
        Warning: As an admin user, your changes will update the database.
      </div>
    )}
    <div id="tierListContainer">
      <div className={`tier-list-section ${isExpanded !== false ? 'expanded' : ''}`}>
        <button className="expandSection" onClick={() => {setIsExpanded(!isExpanded)}}>
          {isExpanded ? (
            <SlArrowLeft />
          ) : (
            <SlArrowRight />
          )}
        </button>
        {tiers.map((tier, index) => (
          <div key={tier} className="tier-row">
            <div className="tier-label" contentEditable="true" suppressContentEditableWarning onBlur={(e) => {setCustomNameTiers(prevTiers => prevTiers.map((t, i) => i === index ? e.target.textContent : t))}}>{customNameTiers[index] === tier ? tier : customNameTiers[index]}</div>
            <div
              className={`tier-content ${selectedPokemon && selectedPokemon.tier==="unassigned" ? "selectable" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, tier)}
              onClick={() => {handleClickPokemon(tier)}}
            >
              {items[tier].map(item => (
                <div
                  key={item.id}
                  className={`draggable-item ${item.pokemon_class}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onClick={(e) => {e.stopPropagation(); // prevent event from reaching parent so it doesn't reset selectedPokemon
                    setSelectedPokemon(item)
                  }}
                >
                  <img 
                    src={`/assets/Draft/headshots/${item.pokemon_name}.png`}
                    alt={item.pokemon_name}
                    className="pokemon-image"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className={`unassigned-section ${isExpanded !== false ? 'shrunk' : ''}`}>
        {classSections.map(({ class: className, title }) => (
          <div key={className} className="class-section">
            <div className="class-section-title">{title}</div>
            <div
              className={`tier-content ${selectedPokemon && selectedPokemon.tier!=="unassigned" ? "selectable" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'unassigned')}
              onClick={() => {handleClickPokemon('unassigned')}}
            >
              {getUnassignedByClass(className).map(item => (
                <div
                  key={item.id}
                  className={`draggable-item ${item.pokemon_class}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onClick={(e) => {e.stopPropagation(); // prevent event from reaching parent so it doesn't reset selectedPokemon
                    setSelectedPokemon(item)
                  }}
                >
                  <img 
                    src={`/assets/Draft/headshots/${item.pokemon_name}.png`}
                    alt={item.pokemon_name}
                    className="pokemon-image"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    <Home />
    <button 
      className="default-tiers-button" 
      onClick={applyDefaultTiers}
      disabled={loading}
    >
      {loading ? 'Loading...' : 'Apply Default Tiers'}
    </button>
    <button 
      className="empty-tiers-button" 
      onClick={emptyTiers}
      disabled={loading}
    >
      {loading ? 'Loading...' : 'Empty Tiers'}
    </button>
    </div>
  );
}

export default TierList;