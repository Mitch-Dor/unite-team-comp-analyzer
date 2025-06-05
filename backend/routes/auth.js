module.exports = function (app, database, passport) {
    const frontendUrl = process.env.NODE_ENV === 'production' 
        ? (process.env.HEROKU_APP_URL || 'https://unite-pro-0d311a8552a3.herokuapp.com')
        : 'http://localhost:3000';

    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    app.get('/auth/google/callback', 
        passport.authenticate('google', { 
            failureRedirect: frontendUrl 
        }),
        (req, res) => {
            // Successful authentication, redirect to frontend
            res.redirect(frontendUrl);
        }
    );

    app.get('/logout', (req, res) => {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to logout' });
            }
            res.redirect(frontendUrl);
        });
    });

    app.get('/current_user', (req, res) => {
        res.json(req.user || null);
    });
};