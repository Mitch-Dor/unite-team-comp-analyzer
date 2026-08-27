import { useState, useEffect } from "react";
import "../css/insights.css";
import "../css/classBackgrounds.css";
import { fetchAllCharacterTraits } from "./common/http";
import Home from "../../sideComponents/js/Home";
import LevelStrengthChart from "./insightsSupport/LevelStrengthChart";
import NotesDisplay from "./insightsSupport/NotesDisplay.jsx";

export default function Inights() {
    const [characterTraits, setCharacterTraits] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [currentCharacter, setCurrentCharacter] = useState(null);

    useEffect(() => {
        async function fetchAllData() {
            try {
                const fetchedCharacterTraits = await fetchAllCharacterTraits();
                setCharacterTraits(convertToTraitsTags(fetchedCharacterTraits));
                // Get unique pokemon_name and pokemon_id combinations
                const uniquePokemon = [...new Set(fetchedCharacterTraits.map(char => JSON.stringify({pokemon_name: char.pokemon_name, pokemon_id: char.pokemon_id, pokemon_class: char.pokemon_class})))].map(str => JSON.parse(str)); 
                setCharacters(uniquePokemon);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchAllData();
    }, []);

    useEffect(() => {
        console.log(characterTraits)
    }, [characterTraits])

    function setFullCharacterData(character) {
        const index = characterTraits.findIndex(trait => trait.pokemon_id === character.pokemon_id);
        setCurrentCharacter(characterTraits[index]);
    }

    function convertToTraitsTags(fetchedData) {
        console.log(fetchedData);
        return fetchedData.map((character) => {
            const traits = [];
            if (character.bulk !== null) {
                if (character.bulk <= 2) {
                    traits.push("squishy");
                } else if (character.bulk >= 4) {
                    traits.push("tanky");
                }
            }
            if (character.cc !== null) {
                if(character.cc >= 4) {
                    traits.push("high_CC");
                }
                if(character.cc <= 2) {
                    traits.push("low_CC");
                }
            }
            if (character.classification !== null) {
                traits.push(character.classification);
            }
            if (character.damage_consistency !== null) {
                if (character.damage_consistency >= 4) {
                    traits.push("burst_damage");
                } else if (character.damage_consistency <= 3) {
                    traits.push("consistent_damage");
                }
                if (character.damage_consistency >= 8) {
                    traits.push("long_CDs");
                }
            }
            if(character.damage >= 4) {
                traits.push("high_damage");
            }
            if (character.mobility !== null) {
                if(character.mobility <= 1) {
                    traits.push("immobile");
                } else if (character.mobility >= 4) {
                    traits.push("high_mobility");
                }
            }
            if (character.play_style !== null) {
                traits.push(character.play_style);
            }
            if (character.range !== null) {
                if (character.range <= 1) {
                    traits.push("low_range");
                } else if (character.range >= 4) {
                    traits.push("high_range");
                }
            } 
            if (character.damage_area !== null) {
                traits.push(character.damage_area + "_damage");
            }

            return {
                good_teammates: character.good_teammates,
                level_strength: character.level_strength, 
                match_link: character.match_link, 
                match_title: character.match_title, 
                pokemon_class: character.pokemon_class, 
                pokemon_id: character.pokemon_id, 
                pokemon_name: character.pokemon_name, 
                release_date: character.release_date, 
                text: character.text, 
                traits: traits
            }

        })
    }

    const getYTEmbedSrc = (raw) => {
        if (!raw) return null;
        try {
            const u = new URL(raw);
            const host = u.hostname.replace(/^www\./, '');
            const path = u.pathname;

            // playlist?
            const list = u.searchParams.get('list');

            // video id from multiple formats
            let id = null;
            if (host === 'youtu.be') {
            id = path.slice(1); // /VIDEO_ID
            } else if (host.endsWith('youtube.com')) {
            if (path === '/watch') id = u.searchParams.get('v');
            else if (path.startsWith('/shorts/')) id = path.split('/')[2];
            else if (path.startsWith('/live/')) id = path.split('/')[2];
            else if (path.startsWith('/embed/')) return raw; // already embed form
            }

            if (list && !id) return `https://www.youtube.com/embed/videoseries?list=${list}`;
            if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
            return null;
        } catch {
            return null;
        }
    };

    return (
        <div id="insights-main-container">
            <div id="insights-content-container">
                <div id="insights-pokemon-select-container">
                    <div id="insights-home-container">< Home /></div>
                    {characters.map(character => (
                        <div 
                            key={character.pokemon_name} 
                            className="insights-pokemon-select" 
                            onClick={() => setFullCharacterData(character)}
                        >
                            <img 
                                className={`insights-pokemon-select-image ${character.pokemon_class}`} 
                                src={`/assets/Draft/headshots/${character.pokemon_name}.png`} 
                                alt={character.pokemon_name} 
                            />
                        </div>
                    ))}
                </div>
                <div className="insights-data-container">
                    <div className="insights-data-notes">
                        <div className="insights-data-title">Notes</div>
                        <div className="insights-data-text">
                            < NotesDisplay noteData={currentCharacter} characters={characters} />
                        </div>        
                    </div>
                    <div className="insights-data-center">
                        <div className="insights-data-graph">
                            <LevelStrengthChart data={currentCharacter?.level_strength} />
                        </div>
                        <div className="insights-data-pokemon-image">
                            <div className="insights-data-title">{currentCharacter ? currentCharacter.pokemon_name : "Placeholder"}</div>
                            {currentCharacter ? (<img className="insights-data-pokemon-model" src={`/assets/models/${currentCharacter.pokemon_name}.png`} />) : null}
                        </div>
                    </div>
                    <div className="insights-data-example-match">
                        <a className="insights-data-title" href={`${currentCharacter && currentCharacter.match_link ? currentCharacter.match_link : ""}`} target="_blank" rel="noopener noreferrer">{currentCharacter && currentCharacter.match_title ? currentCharacter.match_title : "No Match Found"}</a>
                        {currentCharacter && currentCharacter.match_link ? (
                            <iframe
                                src={`${getYTEmbedSrc(currentCharacter?.match_link)}?modestbranding=1&rel=0&playsinline=1&origin=${window.location.origin}`}
                                width="80%"
                                height="60%"
                                style={{ aspectRatio: "16 / 9" }}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                referrerPolicy="origin-when-cross-origin"
                            />
                        ) : (null)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}