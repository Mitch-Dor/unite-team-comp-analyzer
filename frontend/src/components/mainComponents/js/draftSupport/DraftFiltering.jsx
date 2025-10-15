import React, { useEffect, useState } from 'react';
import "../../css/draftSupport/draftFiltering.css";

const DraftFiltering = ({ pokemonList, updateFilteredList, updatePokemonList }) => {
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
            sortedArray.sort((a, b) => (a.pokedex_number - b.pokedex_number));
        } else if (orderBy === "release") {
            sortedArray.sort((a, b) => {
                const diff = new Date(a.release_date) - new Date(b.release_date);
                if (diff !== 0) {
                    return diff; // primary sort: release_date
                }
                return a.pokemon_id - b.pokemon_id; // secondary sort: pokemon_id
            });
        }
        updatePokemonList(sortedArray);
    }

    return (
        <div className="draft-filtering-container">
            <div className="draft-filtering-row">
                <div className="draft-filtering-lane-filters">
                    {possibleLanes.map(lane => {
                        return (
                            <img key={"lane-"+lane} title={`${lane}`} src={`./assets/Draft/filterIcons/${lane}.png`} className={`draft-filtering-filter-icon ${laneFilters.includes(lane) ? 'active' : ''}`} onClick={() => {doUpdateLaneFilters(lane)}}></img>
                        );
                    })}
                </div>
                <div className="draft-filtering-class-filters">
                    {possibleClasses.map(charClass => {
                        return (
                            <img key={"class-"+charClass} title={`${charClass}`} src={`./assets/Draft/filterIcons/${charClass}.png`} className={`draft-filtering-filter-icon ${classFilter === charClass ? 'active' : ''}`} onClick={() => {doUpdateClassFilter(charClass)}}></img>
                        );
                    })}
                </div>
            </div>
            <div className="draft-filtering-row">
                <select id="draft-filtering-order-by-select" onChange={(e) => doReorder(e.target.value)}>
                    {orderByFilters.map(orderByFilter => {
                        return (
                            <option key={orderByFilter} value={orderByFilter}>{orderByFilter}</option>
                        )
                    })}
                </select>
                <input type="text" id="draft-filtering-search-bar" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)}></input>
            </div>
        </div>
    );
};

export default DraftFiltering;