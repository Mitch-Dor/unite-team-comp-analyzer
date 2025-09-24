module.exports = function (app, middleware, database) {

    app.get('/GETallSets', (req, res) => {
        database.comps.getAllSets().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching comps:', error); // Added logging for better debugging
            res.sendStatus(401);
        });
    });

    app.post('/POSTset', middleware.verifiedUserAuth, (req, res) => {
        database.comps.insertSet(req.body.setData).then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error inserting set:', error);
            res.sendStatus(401);
        });
    })

};