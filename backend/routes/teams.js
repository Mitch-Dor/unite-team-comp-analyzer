module.exports = function (app, database, adminGoogleId) {
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

    app.post('/POSTevent', (req, res) => {
        // Check if user is verified
        checkVerifiedUser(req.body.userGoogleId)
            .then(isVerified => {
                if (!isVerified) {
                    res.sendStatus(402);
                    return;
                }
                database.teams.insertEvent(req.body.name, req.body.date, req.body.vodUrl).then(data => {
                    res.json(data); 
                })
                .catch(error => {
                    console.error('Error inserting event:', error);
                    res.sendStatus(401);
                });
            })
            .catch(error => {
                console.error('Error checking verified user:', error);
                res.sendStatus(401);
            });
    });

    app.post('/POSTteam', (req, res) => {
        // Check if user is verified
        checkVerifiedUser(req.body.userGoogleId)
            .then(isVerified => {
                if (!isVerified) {
                    res.sendStatus(402);
                    return;
                }
                database.teams.insertTeam(req.body.name, req.body.region).then(data => {
                    res.json(data);
                })
                .catch(error => {
                    console.error('Error inserting team:', error);
                    res.sendStatus(401);
                });
            })
            .catch(error => {
                console.error('Error checking verified user:', error);
                res.sendStatus(401);
            });
    });

    app.post('/POSTplayer', (req, res) => {
        // Check if user is verified
        checkVerifiedUser(req.body.userGoogleId)
            .then(isVerified => {
                if (!isVerified) {
                    res.sendStatus(402);
                    return;
                }
                database.teams.insertPlayer(req.body.name).then(data => {
                    res.json(data);
                })
                .catch(error => {
                    console.error('Error inserting player:', error);
                    res.sendStatus(401);
                });
            })
            .catch(error => {
                console.error('Error checking verified user:', error);
                res.sendStatus(401);
            });
    });

    app.post('/POSTset', (req, res) => {
        // Check if user is verified
        checkVerifiedUser(req.body.userGoogleId)
            .then(isVerified => {
                if (!isVerified) {
                    res.sendStatus(402);
                    return;
                }
                database.teams.insertSet(req.body.setMatches).then(data => {
                    res.json(data);
                })
                .catch(error => {
                    console.error('Error inserting set:', error);
                    res.sendStatus(401);
                });
            })
            .catch(error => {
                console.error('Error checking verified user:', error);
                res.sendStatus(401);
            });
    });

    app.put('/GETrateComp', (req, res) => {
        database.teams.rateComp(req.body).then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error rating comp:', error);
            res.sendStatus(401);
        });
    });

    app.get('/GETtierList', (req, res) => {
        database.teams.getAllTierListEntries().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching tier list:', error);
            res.sendStatus(401);
        });
    });

    app.post('/POSTtierListEntry', (req, res) => {
        if (req.body.googleId !== adminGoogleId) {
            res.sendStatus(402);
            return;
        }
        database.teams.insertTierListEntry(req.body.tierName, req.body.pokemonId).then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.error('Error inserting tier list entry:', error);
            res.sendStatus(401);
        });
    });

    app.put('/GETisVerifiedUser', (req, res) => {
        checkVerifiedUser(req.body.userGoogleId)
            .then(() => {
                res.json(true);
            })
            .catch(error => {
                if (error.status === 402) {
                    res.json(false);
                } else {
                    console.error('Error checking verified user:', error);
                    res.sendStatus(401);
                }
            });
    });

    app.put('/GETisAdmin', (req, res) => {
        const userGoogleId = req.body.userGoogleId;
        const isAdmin = userGoogleId === adminGoogleId;
        res.json(isAdmin);
    });

    async function checkVerifiedUser(userGoogleId) {
        return new Promise((resolve, reject) => {
            database.teams.getAllVerifiedUsers()
                .then(users => {
                    const isVerified = users.some(user => user.user_google_id === userGoogleId);
                    if (!isVerified) {
                        reject({ status: 402, message: 'User not verified' });
                    } else {
                        resolve(true);
                    }
                })
                .catch(error => {
                    console.error('Error checking verified user:', error);
                    reject({ status: 401, message: 'Database error' });
                });
        });
    }
};