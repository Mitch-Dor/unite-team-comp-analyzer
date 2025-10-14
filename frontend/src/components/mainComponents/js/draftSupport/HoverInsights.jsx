import React from 'react';
import "../../css/draftSupport/hoverInsights.css";

const HoverInsights = ({ pokemon, idealTeam }) => {
    return (
        <div className="draft-hover-insights-container">
            <h3>{pokemon.pokemon_name}</h3>
            <p>Class: {pokemon.pokemon_class}</p>
            {idealTeam && (
                <div className="draft-hover-insights-ideal-team-container">
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    <p>AI's Ideal Team:</p>
                    <div className="draft-hover-insights-ideal-team-pokemon-container">
                    {idealTeam && idealTeam.map((pokemon, index) => (
                        <div key={index} className="draft-hover-insights-ideal-team-pokemon">
                            <img className={`${pokemon.pokemon_class} draft-character-portrait`} src={`/assets/Draft/headshots/${pokemon.pokemon_name}.png`} alt={pokemon.pokemon_name} />
                        </div>
                    ))}
                    </div>
                </div>
            )}
        </div>  
    )
};

export default HoverInsights;