module.exports = function (app, database) {
    // App is of course the server so that is how we send data
    // Database we can get to the database SQL functions using database.characters.XXX()
    
    // Function to run the a_star algorithm to find the best team
    app.put('/GETrunAStarAlgorithm', (req, res) => {
        database.teams.runAStarAlgorithm(req.body.targetTeam, req.body.opposingTeam, req.body.bans).then(data => {
            // Send success response
            res.json(data);
        }) 
        .catch(error => {
            // Send fail response
            console.error('Error running a_star algorithm:', error);
            res.sendStatus(401);
        });
    });
};