module.exports = function (app, database) {
    // App is of course the server so that is how we send data
    // Database we can get to the database SQL functions using database.characters.XXX()
    app.get('/GETallDraftInfo', (req, res) => {
        database.characters.getAllCharacterDraftInformation().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching character information:', error); // Added logging for better debugging
            res.sendStatus(401);
        });
    });

    app.get('/GETallCharacterAttributes', (req, res) => {
        database.characters.getAllCharacterAttributes().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching character attributes:', error);
            res.sendStatus(401);
        });
    });

    app.put('/GETsingleCharacterAttributes', (req, res) => {
        database.characters.getIndividualCharacterTraits(req.body.name).then(data => {
            // Send success response
            res.json(data);
        }) 
        .catch(error => {
            // Send fail response
            console.error('Error fetching character attributes:', error);
            res.sendStatus(401);
        });
    });

    app.put('/PUTCharacterAttributes', (req, res) => {
        database.characters.updateCharacterAttributes(req.body.name, req.body.traits).then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error updating character Attributes:', error);
            res.sendStatus(401);
        });
    })
};