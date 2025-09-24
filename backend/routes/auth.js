module.exports = function (app, middleware, database, passport, node_env, app_url) {
    
    //// OAUTH ////

    const frontendUrl = node_env === 'production' 
        ? app_url : 'http://localhost:3000';

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

    //// AUTH CHECKS ////

    app.get('/GETisVerifiedUser', middleware.verifiedUserAuth, (req, res) => {
        res.sendStatus(200);
    });

    app.get('/GETisAdmin', middleware.adminAuth, (req, res) => {
        res.sendStatus(200);
    });
};