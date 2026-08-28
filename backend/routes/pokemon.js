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