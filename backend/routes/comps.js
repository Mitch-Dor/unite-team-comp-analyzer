module.exports = function (app, database, adminGoogleId) {
    // App is of course the server so that is how we send data
    // Database we can get to the database SQL functions using database.characters.XXX()
    app.get('/GETComps', (req, res) => {
        database.comps.getAllComps().then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching comps:', error); // Added logging for better debugging
            res.sendStatus(401);
        });
    });
};