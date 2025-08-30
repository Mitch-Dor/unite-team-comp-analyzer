import { useState, useEffect } from "react";
import "../css/insights.css";
import "../css/classBackgrounds.css";
import { fetchAllCharacterAttributes, fetchAllInsights } from "./backendCalls/http";
import Score from "./Score";
import Home from "../../sideComponents/js/Home";

export default function Inights() {
    const [characterAttributes, setCharacterAttributes] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [currentCharacter, setCurrentCharacter] = useState(null);
    const [insights, setInsights] = useState([]);
    const [currentInsight, setCurrentInsight] = useState(null);
    const [mode, setMode] = useState("descriptions");

    useEffect(() => {
        async function fetchAllData() {
            try {
                const fetchedCharacterAttributes = await fetchAllCharacterAttributes();
                setCharacterAttributes(fetchedCharacterAttributes);
                // Get unique pokemon_name and pokemon_id combinations
                const uniquePokemon = [...new Set(fetchedCharacterAttributes.map(char => JSON.stringify({pokemon_name: char.pokemon_name, pokemon_id: char.pokemon_id, pokemon_class: char.pokemon_class})))].map(str => JSON.parse(str)); 
                setCharacters(uniquePokemon);
                const fetchedInsights = await fetchAllInsights();
                setInsights(fetchedInsights);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchAllData();
    }, []);

    useEffect(() => {
        if (!currentCharacter || !insights?.length) {
            setCurrentInsight(null);
            return;
        }

        const found = insights.find(
            (insight) => parseInt(insight.pokemon_id) === currentCharacter.pokemon_id
        );

        setCurrentInsight(found || null);
    }, [currentCharacter, insights]);

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
        <div className="mainContainer">
            <div className="insightsModeSelector">
                <div className="insightsModeOption" onClick={() => {setMode("descriptions")}}>Details</div>
                <div className="insightsModeOption" onClick={() => {setMode("score")}}>Score A Comp</div>
                <div className={`insightsModeBar ${mode === "descriptions" ? "left" : "right"}`}></div>
            </div>
            {mode === "score" ? (
                <Score characterAttributes={characterAttributes} characters={characters} />
            ) : (
                <div className="insightsContainer">
                    <div className="pokemonSelection">
                        {characters.map(character => (
                            <div 
                                key={character.pokemon_name} 
                                className={`characterListDiv`} 
                                onClick={() => setCurrentCharacter(character)}
                            >
                                <img 
                                    className={`characterListImg ${character.pokemon_class}`} 
                                    src={`/assets/Draft/headshots/${character.pokemon_name}.png`} 
                                    alt={character.pokemon_name} 
                                />
                            </div>
                        ))}
                    </div>
                    <div className="insightData">
                        <div className="insightNote">
                            <div className="insightTitle">Notes</div>
                            <div className="insightText">{currentInsight && currentInsight.text ? currentInsight.text : "No insight Found"}</div>
                        </div>
                        <div className="insightPokemonModel">
                            <div className="insightTitle">{currentCharacter ? currentCharacter.pokemon_name : null}</div>
                            {currentCharacter ? (<img src={`/assets/models/${currentCharacter.pokemon_name}.png`} />) : null}</div>
                        <div className="insightExampleMatch">
                            <a className="insightTitle" href={`${currentInsight && currentInsight.match_link ? currentInsight.match_link : ""}`} target="_blank" rel="noopener noreferrer">{currentInsight && currentInsight.match_title ? currentInsight.match_title : "No Match Found"}</a>
                            {currentInsight && currentInsight.match_link ? (
                                <iframe
                                    src={`${getYTEmbedSrc(currentInsight?.match_link)}?modestbranding=1&rel=0&playsinline=1&origin=${window.location.origin}`}
                                    width="80%"
                                    height="60%"
                                    aspectRatio="16 / 9"
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
            )}
            <Home />
        </div>
    )
}