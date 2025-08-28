import React, { useEffect, useState } from 'react';

const Filtering = ({ pokemonList, updateFilteredList, updatePokemonList }) => {
    const [laneFilters, updateLaneFilters] = useState([]);
    const [classFilter, updateClassFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState('');

    const possibleLanes = ["top", "jungle", "bot", "EXPShare"];
    const possibleClasses = ["all_rounder", "supporter", "speedster", "attacker", "defender"];
    const orderByFilters = ["pokedex", "release"];

    useEffect(() => {
        applyFilters();
    }, [laneFilters, classFilter, searchTerm, pokemonList]);

    const applyFilters = () => {
        // First filter by the search bar
        let searchMatches = pokemonList.filter(pokemon => pokemon.pokemon_name.toLowerCase().includes(searchTerm.toLowerCase()));
        // Filter by role
        if (classFilter !== ""){
            searchMatches = searchMatches.filter(pokemon => pokemon.pokemon_class.toLowerCase() === classFilter.toLowerCase());
        }
        // Filter by lane
        // Multiple lanes can be selected at once
        if (laneFilters.length > 0){
            searchMatches = searchMatches.filter(filterByLane);
        }

        function filterByLane(pokemon){
            if (laneFilters.includes("top") && pokemon.can_top_lane_carry==="No"){
                return false;
            }
            if (laneFilters.includes("jungle") && pokemon.can_jungle_carry==="No"){
                return false;
            }
            if (laneFilters.includes("bot") && pokemon.can_bottom_lane_carry==="No"){
                return false;
            }
            if (laneFilters.includes("EXPShare") && pokemon.can_exp_share==="No"){
                return false;
            }
            return true;
        }

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

    const doReorder = (orderBy) => {
        let sortedArray = [...pokemonList]; // Deep copy
        if (orderBy === "pokedex") {
            sortedArray.sort((a, b) => (a.pokedex_number - b.pokedex_number))
        } else if (orderBy === "release") {
            sortedArray.sort((a, b) => (a.release_order - b.release_order))
        }
        updatePokemonList(sortedArray);
    }

    return (
        <div className="filtering">
            <div className="filterRow">
                <div className="laneFilters">
                    {possibleLanes.map((lane, index) => {
                        return (
                            <div key={"lane"+index} >
                                <img title={`${lane}`} src={`./assets/Draft/filterIcons/${lane}.png`} className={`filterIcon ${laneFilters.includes(lane) ? 'active' : ''}`} onClick={() => {doUpdateLaneFilters(lane)}}></img>
                            </div>
                        );
                    })}
                </div>
                <div className="classFilters">
                    {possibleClasses.map((charClass, index) => {
                        return (
                            <div key={"class"+index} >
                                <img title={`${charClass}`} src={`./assets/Draft/filterIcons/${charClass}.png`} className={`filterIcon ${classFilter === charClass ? 'active' : ''}`} onClick={() => {doUpdateClassFilter(charClass)}}></img>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="filterRow">
                <input type="text" id="searchBar" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)}></input>
                <select className="orderByFilters" onChange={(e) => doReorder(e.target.value)}>
                    {orderByFilters.map((orderByFilter, index) => {
                        return (
                            <option key={orderByFilter} value={orderByFilter}>{orderByFilter}</option>
                        )
                    })}
                </select>
            </div>
        </div>
    );
};

export default Filtering;