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

    app.post('/POSTtierListEntry', middleware.adminAuth, (req, res) => {
        database.pokemon.insertTierListEntry(req.body.tierName, req.body.pokemonId).then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.error('Error inserting tier list entry:', error);
            res.sendStatus(401);
        });
    });

    app.put('/PUTallInsights', (req, res) => {
        database.pokemon.updateInsights(req.body.pokemon_id, req.body.data).then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching insights:', error);
            res.sendStatus(401);
        });
    });

    app.get('/GETallCharacterTraits', (req, res) => {
        database.pokemon.getAllCharacterTraits().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching character traits:', error);
            res.sendStatus(401);
        });
    });

    app.put('/PUTCharacterTrait', middleware.adminAuth, (req, res) => {
        database.pokemon.updateCharacterTrait(req.body.pokemonId, req.body.column, req.body.value).then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error updating character trait:', error);
            res.sendStatus(401);
        });
    });

};