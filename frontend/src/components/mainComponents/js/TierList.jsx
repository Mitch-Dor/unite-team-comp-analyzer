import React, { useState, useEffect } from 'react';
import '../css/tierList.css';
import { fetchCharacterDisplayInfo } from './backendCalls/http.js';

function TierList() {
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

  useEffect(() => {
    async function fetchCharacterListing() {
        try {
            const listing = await fetchCharacterDisplayInfo();
            updatePokemonList(listing);
            console.log(listing);
        } catch (error) {
            console.error("Error fetching Pokemon Data:", error);
        }
    }

    fetchCharacterListing();
    setBackground();
}, []); 

  useEffect(() => {
    if (pokemonList.length > 0) {
      setItems(prevItems => ({
        ...prevItems,
        unassigned: pokemonList.map((pokemon, index) => ({
          id: index,
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
  };

  const tiers = ['S', 'A', 'B', 'C', 'D', 'E', 'F'];
  const classSections = [
    { class: 'Attacker', title: 'Attackers' },
    { class: 'Speedster', title: 'Speedsters' },
    { class: 'Supporter', title: 'Supporters' },
    { class: 'All-Rounder', title: 'All-Rounders' },
    { class: 'Defender', title: 'Defenders' }
  ];

  const getUnassignedByClass = (className) => {
    return items.unassigned.filter(item => item.pokemon_class === className);
  };

  return (
    <div id="mainContainer">
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
    </div>
  );
}

export default TierList;