create table comps (
    comp_id serial primary key not null,
    did_win boolean not null,
    first_pick boolean not null,
    team_id int not null,
    FOREIGN KEY (team_id) REFERENCES professional_teams (team_id)
);

create table matches (
    match_id serial primary key not null,
    set_id int not null,
    comp_1_id int not null,
    comp_2_id int not null,
    VOD_URL text,
    FOREIGN KEY (set_id) REFERENCES professional_sets (set_id),
    FOREIGN KEY (comp_1_id) REFERENCES comps (comp_id),
    FOREIGN KEY (comp_2_id) REFERENCES comps (comp_id)
);

create table picks (
    comp_id int not null,
    pokemon_id int not null,
    pick_position int not null,
    player_id int not null,
    position_played text,
    move_1_id int not null,
    move_2_id int not null,
    FOREIGN KEY (comp_id) REFERENCES comps (comp_id),
    FOREIGN KEY (pokemon_id) REFERENCES playable_characters (pokemon_id),
    FOREIGN KEY (player_id) REFERENCES professional_players (player_id),
    FOREIGN KEY (move_1_id) REFERENCES pokemon_moves (move_id),
    FOREIGN KEY (move_2_id) REFERENCES pokemon_moves (move_id)
);

create table bans (
    comp_id int not null,
    pokemon_id int not null,
    ban_position int not null,
    FOREIGN KEY (comp_id) REFERENCES comps (comp_id),
    FOREIGN KEY (pokemon_id) REFERENCES playable_characters (pokemon_id)
);