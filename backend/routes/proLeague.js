module.exports = function (app, middleware, database) {
   
    //// EVENTS ////
    
    app.get('/GETallEvents', (req, res) => {
        database.proLeague.getAllEvents().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching events:', error); // Added logging for better debugging
            res.sendStatus(401);
        }); 
    });

    app.post('/POSTevent', middleware.verifiedUserAuth, (req, res) => {
        database.proLeague.insertEvent(req.body.name, req.body.date).then(data => {
            res.json(data); 
        })
        .catch(error => {
            console.error('Error inserting event:', error);
            res.sendStatus(401);
        });
    })

    //// TEAMS ////

    app.get('/GETallTeams', (req, res) => {
        database.proLeague.getAllTeams().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching teams:', error); // Added logging for better debugging
            res.sendStatus(401);
        }); 
    });

    app.post('/POSTteam', middleware.verifiedUserAuth, (req, res) => {
        database.proLeague.insertTeam(req.body.name, req.body.region).then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error inserting team:', error);
            res.sendStatus(401);
        });
    })
    
    //// PLAYERS ////

    app.get('/GETallPlayers', (req, res) => {
        database.proLeague.getAllPlayers().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching players:', error); // Added logging for better debugging
            res.sendStatus(401);
        }); 
    });

    app.post('/POSTplayer', middleware.verifiedUserAuth, (req, res) => {
        database.proLeague.insertPlayer(req.body.name).then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error inserting player:', error);
            res.sendStatus(401);
        });
    })
    
};