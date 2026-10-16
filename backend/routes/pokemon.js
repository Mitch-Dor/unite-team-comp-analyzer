module.exports = function (app, middleware, database) {
   
    //// CHARACTERS DATA ////
   
    app.get('/GETallCharactersAndMoves', (req, res) => {
        database.pokemon.getAllCharactersAndMoves().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching characters and moves:', error); 
            res.sendStatus(401);
        }); 
    });

    app.get('/GETallDraftInfo', (req, res) => {
        database.pokemon.getAllCharacterDraftInformation().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching character draft information:', error);
            res.sendStatus(401);
        });
    });

    app.get('/GETallUTADraftInfo', (req, res) => {
        database.pokemon.getAllCharacterDraftInformation().then(data => {
            // Little hacky but it's the easiest solution. can_exp_share is gonna be replaced with Supp/Def picks. can_top_carry is gonna be replaced with top picks. can_jungle_carry is gonna be replaced with jungle picks. can_bottom_carry is gonna be replaced with bot lane picks.
            // Supp = Shake. Def = Bronson. Jungle = Orre. Top = Zen. Bottom = Eliza.
            const supp_picks = new Set(["Pikachu", "Clefable", "Alolan_Ninetales", "Wigglytuff", "Psyduck", "Machamp", "Mr_Mime", "Gyarados", "Lapras", "Vaporeon", "Articuno", "Zapdos", "Mewtwo_Y", "Mew", "Meganium", "Espeon", "Umbreon", "Blissey", "Suicune", "Ho_Oh", "Latias", "Chandelure", "Sylveon", "Hoopa", "Comfey", "Dhelmise", "Solgaleo", "Buzzwole", "Eldegoss", "Cramorant", "Toxtricity", "Alcremie", "Skeledrige", "Tinkaton", "Miraidon", "Quaquaval", "Gengar"]);
            const def_picks = new Set(["Blastoise", "Machamp", "Slowbro", "Mr_Mime", "Lapras", "Vaporeon", "Snorlax", "Articuno", "Umbreon", "Leafeon", "Crustle", "Goodra", "Trevenant", "Quaquaval"]);
            const bot_picks = new Set(["Pikachu", "Alolan_Raichu", "Espeon", "Armarouge", "Yveltal", "Skeledirge", "Latias", "Latios", "Ceruledge", "Mewoth", "Sirfetchd", "Talonflame", "Zapdos", "Sylveon", "Quaquaval", "Crustle", "Blastoise", "Trevenant", "Venusaur", "Chandelure"]);
            const top_picks = new Set(["Mega_Charizard_X", "Blastoise", "Galarian_Rapidash", "Dodrio", "Gyarados", "Mega_Gyarados", "Moltres", "Feraligatr", "Azumarill", "Scyther", "Blaziken", "Metagross", "Empoleon", "Garchomp", "Lucario", "Mega_Lucario", "Palkia", "Talonflame", "Aegislash", "Mimikyu", "Dhelmise", "Buzzwole", "Zeraora", "Sirfetchd", "Zacian", "Greedent", "Quaquaval", "Ceruledge", "Flareon"]);
            const jungle_picks = new Set(["Venusaur", "Mega_Charizard_X", "Mega_Charizard_Y", "Charizard", "Alolan_Raichu", "Alolan_Ninetales", "Meowth", "Galarian_Rapidash", "Dodrio", "Gengar", "Scyther", "Lapras", "Zapdos", "Moltres", "Dragonite", "Mewtwo_X", "Mewtwo_Y", "Typhlosion", "Feraligatr", "Azumarill", "Espeon", "Mew", "Scizor", "Tyranitar", "Blaziken", "Gardevoir", "Absol", "Metagross", "Latios", "Empoleon", "Garchomp", "Mega_Lucario", "Lucario", "Leafeon", "Glaceon", "Darkrai", "Zoroark", "Chandelure", "Delphox", "Greninja", "Talonflame", "Aegislash", "Sylveon", "Goodra", "Decidueye", "Tsareena", "Mimikyu", "Zeraora", "Buzzwole", "Cinderace", "Inteleon", "Cramorant", "Toxtricity", "Sirfetchd", "Falinks", "Morpeko", "Duraludon", "Dragapult", "Urshifu_SS", "Urshifu_RS", "Mewscarada", "Skeledirge", "Armarouge", "Ceruledge", "Jolteon"]);
            
            const result = data.map(element => ({
                ...element,
                can_exp_share: supp_picks.has(element.pokemon_name) || def_picks.has(element.pokemon_name),
                can_tank: def_picks.has(element.pokemon_name),
                can_supp: supp_picks.has(element.pokemon_name),
                can_top_carry: top_picks.has(element.pokemon_name),
                can_jungle_carry: jungle_picks.has(element.pokemon_name),
                can_bottom_carry: bot_picks.has(element.pokemon_name),
            }));
            
            res.json(result);
        })
        .catch(error => {
            console.error('Error fetching character draft information:', error);
            res.sendStatus(401);
        });
    });

    //// TIER LIST ////

    app.get('/GETtierList', (req, res) => {
        database.pokemon.getAllTierListEntries().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching tier list:', error);
            res.sendStatus(401);
        });
    });

    //// INSIGHTS ////

    app.get('/GETallCharacterTraits', (req, res) => {
        database.pokemon.getAllCharacterTraits().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching character traits:', error);
            res.sendStatus(401);
        });
    });

    //// DIRECT TABLE FETCHING (ADMIN)

    app.get('/GETtableDraftInformation', (req, res) => {
        database.pokemon.getTableDraftInformation().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching character traits:', error);
            res.sendStatus(401);
        });
    });

    app.get('/GETtableInsights', (req, res) => {
        database.pokemon.getTableInsights().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching character traits:', error);
            res.sendStatus(401);
        });
    });

    app.get('/GETtableTraits', (req, res) => {
        database.pokemon.getTableTraits().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching character traits:', error);
            res.sendStatus(401);
        });
    });

    app.get('/GETIDNameMapping', (req, res) => {
        database.pokemon.getIDNameMapping().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching character traits:', error);
            res.sendStatus(401);
        });
    });

    app.put('/PUTTraitsTableRow', middleware.adminAuth, (req, res) => {
        database.pokemon.updateTraitsRow(req.body.row).then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error updating traits:', error);
            res.sendStatus(401);
        });
    });

    app.put('/PUTStrengthLevel', middleware.adminAuth, (req, res) => {
        database.pokemon.updateTraitsStrengthLevel(req.body.column).then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error updating strength:', error);
            res.sendStatus(401);
        });
    });

    app.put('/PUTInsightsTableRow', middleware.adminAuth, (req, res) => {
        database.pokemon.updateInsightsRow(req.body.row).then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error updating insights:', error);
            res.sendStatus(401);
        });
    });

    app.put('/PUTDraftInfoTableRow', middleware.adminAuth, (req, res) => {
        database.pokemon.updateDraftInfoRow(req.body.row).then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error updating draft info:', error);
            res.sendStatus(401);
        });
    });

    app.put('/PUTTierListTableRow', middleware.adminAuth, (req, res) => {
        database.pokemon.updateTierListRow(req.body.row).then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error updating tier list:', error);
            res.sendStatus(401);
        });
    });

    app.put('/PUTTierListWholeTable', middleware.adminAuth, (req, res) => {
        database.pokemon.updateTierListTable(req.body.table).then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error updating tier list:', error);
            res.sendStatus(401);
        });
    });

    app.post('/POSTTraitsTableRow', middleware.adminAuth, (req, res) => {
        database.pokemon.insertTraitsRow(req.body.row).then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.error('Error inserting traits entry:', error);
            res.sendStatus(401);
        });
    });

    app.post('/POSTInsightsTableRow', middleware.adminAuth, (req, res) => {
        database.pokemon.insertInsightsRow(req.body.row).then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.error('Error inserting insights entry:', error);
            res.sendStatus(401);
        });
    });

    app.post('/POSTDraftInfoTableRow', middleware.adminAuth, (req, res) => {
        database.pokemon.insertDraftInfoRow(req.body.row).then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.error('Error inserting draft info entry:', error);
            res.sendStatus(401);
        });
    });

    app.post('/POSTTierListTableRow', middleware.adminAuth, (req, res) => {
        database.pokemon.insertTierListRow(req.body.row).then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.error('Error inserting tier list entry:', error);
            res.sendStatus(401);
        });
    });

    app.post('/POSTCharacterTableRow', middleware.adminAuth, (req, res) => {
        database.pokemon.insertCharacterRow(req.body.row).then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.error('Error inserting character entry:', error);
            res.sendStatus(401);
        });
    });

    app.post('/POSTMoveTableRow', middleware.adminAuth, (req, res) => {
        database.pokemon.insertMoveRow(req.body.row).then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.error('Error inserting move entry:', error);
            res.sendStatus(401);
        });
    });

};