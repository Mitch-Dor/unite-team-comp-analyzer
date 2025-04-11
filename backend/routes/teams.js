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

    // Function to get all comps
    app.get('/GETallComps', (req, res) => {
        database.teams.getAllComps().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching comps:', error); // Added logging for better debugging
            res.sendStatus(401);
        });
    });

    // Function to get all events
    app.get('/GETallEvents', (req, res) => {
        database.teams.getAllEvents().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching events:', error); // Added logging for better debugging
            res.sendStatus(401);
        }); 
    });

    // Function to get all teams
    app.get('/GETallTeams', (req, res) => {
        database.teams.getAllTeams().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching teams:', error); // Added logging for better debugging
            res.sendStatus(401);
        }); 
    });

    // Function to get all players
    app.get('/GETallPlayers', (req, res) => {
        database.teams.getAllPlayers().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching players:', error); // Added logging for better debugging
            res.sendStatus(401);
        }); 
    });
    
    // Function to get all characters and moves
    app.get('/GETallCharactersAndMoves', (req, res) => {
        database.teams.getAllCharactersAndMoves().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching characters and moves:', error); // Added logging for better debugging
            res.sendStatus(401);
        }); 
    });

    app.post('/POSTEVENT', (req, res) => {
        database.teams.insertEvent(req.body.name, req.body.date, req.body.vodUrl).then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error inserting event:', error);
            res.sendStatus(401);
        });
    });

    app.post('/POSTTEAM', (req, res) => {
        database.teams.insertTeam(req.body.name, req.body.region).then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error inserting team:', error);
            res.sendStatus(401);
        });
    });

    app.post('/POSTPLAYER', (req, res) => {
        database.teams.insertPlayer(req.body.name).then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error inserting player:', error);
            res.sendStatus(401);
        });
    });
};