class Auth {
    /**
       * Constructor for auth class
       * @param {*} db Pass DB object into class
       */
    constructor(db) {
      this.db = db;
    }

    async signIn(googleId, name, email) {
        return new Promise((resolve, reject) => {
            this.db.query('SELECT * FROM users WHERE user_google_id = $1', [googleId], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    if (res.rows && res.rows.length > 0) {
                        // User exists
                        resolve(res.rows[0]);
                    } else {
                        // User does not exist, add them to the database and sign in
                        this.db.query('INSERT INTO users (user_google_id, user_name, user_email) VALUES ($1, $2, $3)', [googleId, name, email], function(err) {
                            if (err) {
                                reject(err);
                            } else {
                                // After inserting, get the user to return it
                                this.db.query('SELECT * FROM users WHERE user_google_id = $1', [googleId], (err, res) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(res.rows[0]);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        });
    }

    async getUser(googleId) {
        return new Promise((resolve, reject) => {
            this.db.query('SELECT * FROM users WHERE user_google_id = $1', [googleId], (err, res) => {
                if (err) {
                    reject(err);
                } else if (res.rows && res.rows.length > 0) {
                    resolve(res.rows[0]);
                } else {
                    resolve(null);
                }
            });
        });
    }
}

module.exports = Auth;