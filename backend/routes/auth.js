module.exports = function (app, database, passport) {
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    app.get('/auth/google/callback', 
        passport.authenticate('google', { 
            failureRedirect: 'http://localhost:3000/' 
        }),
        (req, res) => {
            // Successful authentication, redirect to frontend
            res.redirect('http://localhost:3000/');
        }
    );

    app.get('/api/logout', (req, res) => {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to logout' });
            }
            res.redirect('http://localhost:3000/');
        });
    });

    app.get('/api/current_user', (req, res) => {
        res.send(req.user || null);
    });
};