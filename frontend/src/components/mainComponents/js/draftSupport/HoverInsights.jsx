import React from 'react';

const HoverInsights = ({ pokemon, index }) => {

    return (
        <div className="hoverInsights">
            <h3>{pokemon.pokemon_name}</h3>
            <p>Class: {pokemon.pokemon_class}</p>
        </div>  
    )
};

export default HoverInsights;