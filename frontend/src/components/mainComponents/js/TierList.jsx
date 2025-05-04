import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/tierList.css';
import { fetchCharacterDraftInfo, fetchAllTierListEntries, insertTierListEntry } from './backendCalls/http.js';
import Home from '../../sideComponents/js/Home.jsx';

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
  const isAdmin = user && user.user_email === 'pokemonunitedrafter@gmail.com';
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCharacterListing() {
        try {
            const listing = await fetchCharacterDraftInfo();
            updatePokemonList(listing);
        } catch (error) {
            console.error("Error fetching Pokemon Data:", error);
        }
    }

    fetchCharacterListing();
    setBackground();
  }, []); 

  useEffect(() => {
    if (isAdmin) {
      applyDefaultTiers();
    }
  }, [pokemonList]);

  useEffect(() => {
    if (pokemonList.length > 0) {
      setItems(prevItems => ({
        ...prevItems,
        unassigned: pokemonList.map((pokemon, index) => ({
          id: pokemon.pokemon_id,
          tier: 'unassigned',
          pokemon_name: pokemon.pokemon_name,
          pokemon_class: pokemon.pokemon_class
        }))
      }));
    }
  }, [pokemonList]);

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

    if (isAdmin) {
      insertTierListEntry(targetTier, itemData.id, user.user_google_id);
    }
  };

  const tiers = ['S', 'A', 'B', 'C', 'D', 'E', 'F'];
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
      setItems(prevItems => {
        // Create a new state object with empty tier arrays
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
        
        return newItems;
      });
    }
  }

  return (
    <div id="mainContainer">
    {isAdmin && (
      <div className="admin-warning">
        Warning: As an admin user, your changes will update the database.
      </div>
    )}
    <div id="tierListContainer">
      <div className="tier-list-section">
        {tiers.map(tier => (
          <div key={tier} className="tier-row">
            <div className="tier-label">{tier}</div>
            <div
              className="tier-content"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, tier)}
            >
              {items[tier].map(item => (
                <div
                  key={item.id}
                  className={`draggable-item ${item.pokemon_class}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
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
      
      <div className="unassigned-section">
        {classSections.map(({ class: className, title }) => (
          <div key={className} className="class-section">
            <div className="class-section-title">{title}</div>
            <div
              className="tier-content"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'unassigned')}
            >
              {getUnassignedByClass(className).map(item => (
                <div
                  key={item.id}
                  className={`draggable-item ${item.pokemon_class}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
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