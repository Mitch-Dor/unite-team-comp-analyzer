import React from 'react';

const HoverInsights = ({ pokemon, index, idealTeam }) => {
    return (
        <div className="hoverInsights">
            <h3>{pokemon.pokemon_name}</h3>
            <p>Class: {pokemon.pokemon_class}</p>
            {idealTeam && (
                <div className="idealTeamInsights">
                    <p>AI's Ideal Team:</p>
                    <div className="idealTeamPokemonContainer">
                    {idealTeam &&idealTeam.map((pokemon, index) => (
                        <div key={index} className="idealTeamPokemon">
                        <img className={`${pokemon.pokemon_class} characterPortrait`} src={`/assets/Draft/headshots/${pokemon.pokemon_name}.png`} alt={pokemon.pokemon_name} />
                        </div>
                    ))}
                    </div>
                </div>
            )}
        </div>  
    )
};

export default HoverInsights;