module.exports = function (app, middleware, database) {
    app.put('/GETdraftStats', (req, res) => {
        database.stats.getDraftStats(req.body.event, req.body.region, req.body.team, req.body.player, req.body.dateLower, req.body.dateUpper).then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching draft stats:', error);
            res.sendStatus(401);
        });
    });

    app.get('/GEToverallBattleStats', (req, res) => {
        database.stats.getOverallBattleStats().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching overall battle stats:', error);
            res.sendStatus(401);
        });
    });

    app.put('/GETindividualBattleStats', (req, res) => {
        database.stats.getIndividualBattleStats(req.body.minKills, req.body.minAssists, req.body.minDealt, req.body.minTaken, req.body.minHealed, req.body.minScored, req.body.lane, req.body.pokemon, req.body.move1, req.body.move2).then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching individual battle stats:', error);
            res.sendStatus(401);
        });
    });
};