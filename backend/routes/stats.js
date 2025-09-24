module.exports = function (app, middleware, database) {
    app.put('/GETdraftStats', (req, res) => {
        database.stats.getDraftStats(req.body).then(data => {
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
        database.stats.getIndividualBattleStats(req.body).then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching individual battle stats:', error);
            res.sendStatus(401);
        });
    });
};