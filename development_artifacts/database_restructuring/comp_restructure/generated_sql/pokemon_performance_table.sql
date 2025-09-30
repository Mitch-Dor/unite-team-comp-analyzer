-- Create pokemon_performance table if it doesn't exist
CREATE TABLE IF NOT EXISTS pokemon_performance (
    comp_id int NOT NULL,
    pokemon_id int NOT NULL,
    kills int DEFAULT 0,
    assists int DEFAULT 0,
    points_scored int DEFAULT 0,
    damage_dealt int DEFAULT 0,
    damage_taken int DEFAULT 0,
    damage_healed int DEFAULT 0,
    PRIMARY KEY (comp_id, pokemon_id),
    FOREIGN KEY (comp_id) REFERENCES comps (comp_id),
    FOREIGN KEY (pokemon_id) REFERENCES playable_characters (pokemon_id)
);

