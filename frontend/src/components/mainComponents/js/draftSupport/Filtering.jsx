import React, { useEffect, useState } from 'react';

const Filtering = ({ pokemonList, updateFilteredList }) => {
    const [laneFilters, updateLaneFilters] = useState([]);
    const [classFilter, updateClassFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState('');

    const possibleLanes = ["top", "jungle", "bot", "EXPShare"];
    const possibleClasses = ["all-rounder", "supporter", "speedster", "attacker", "defender"];

    useEffect(() => {
        applyFilters();
    }, [laneFilters, classFilter, searchTerm]);

    const applyFilters = () => {
        // First filter by the search bar
        let searchMatches = pokemonList.filter(pokemon => pokemon.pokemon_name.toLowerCase().includes(searchTerm.toLowerCase()));
        // Filter by role
        if (classFilter !== ""){
            searchMatches = searchMatches.filter(pokemon => pokemon.pokemon_class.toLowerCase() === classFilter.toLowerCase());
        }
        // Filter by lane
        searchMatches = searchMatches.filter(pokemon => laneFilters.every(filter => pokemon.attributes.includes(filter))); // Checks that all the pokemon left in searchMatches have attributes that show they can go to EVERY selected lane 
        updateFilteredList(searchMatches);
    }

    const doUpdateLaneFilters = (lane) => {
        if(laneFilters.includes(lane)){
            // Remove Filter
            updateLaneFilters(prevFilters => prevFilters.filter(filter => filter !== lane));
        } else {
            // Add Filter
            updateLaneFilters(prevFilters => [...prevFilters, lane]);
        }
    }

    const doUpdateClassFilter = (charClass) => {
        if(classFilter === charClass){
            updateClassFilter("");
        } else {
            updateClassFilter(charClass);
        }
    }

    return (
        <div className="filtering">
            <div className="laneFilters">
                {possibleLanes.map((lane, index) => {
                    return (
                        <>
                            <img key={index} title={`${lane}`} src={`./assets/Draft/filterIcons/${lane}.png`} className={`filterIcon ${laneFilters.includes(lane) ? 'active' : ''}`} onClick={() => {doUpdateLaneFilters(lane)}}></img>
                        </>
                    );
                })}
            </div>
            <input type="text" id="searchBar" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)}></input>
            <div className="classFilters">
                {possibleClasses.map((charClass, index) => {
                    return (
                        <>
                            <img key={index} title={`${charClass}`} src={`./assets/Draft/filterIcons/${charClass}.png`} className={`filterIcon ${classFilter === charClass ? 'active' : ''}`} onClick={() => {doUpdateClassFilter(charClass)}}></img>
                        </>
                    );
                })}
            </div>
        </div>
    );
};

export default Filtering;