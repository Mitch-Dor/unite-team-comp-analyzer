module.exports = function (app, database) {
    // App is of course the server so that is how we send data
    // Database we can get to the database SQL functions using database.characters.XXX()
    app.get('/allCharactersIdsAndNames', (req, res) => {
        console.log("In backend");
        database.characters.getAllCharacterDisplayInformation().then(data => {
            console.log(data);
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching character information:', error); // Added logging for better debugging
            res.sendStatus(401);
        });
    });
    

    app.get('/api/singleCharacter/:name', (req, res) => {
        database.characters.getCharacterTraits(req.params.name).then(data => {
            // Send success response
            res.json(data);
        }) 
        .catch(error => {
            // Send fail response
            res.sendStatus(401);
        });
    });
};