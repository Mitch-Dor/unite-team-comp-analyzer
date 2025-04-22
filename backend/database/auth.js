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
            this.db.all('SELECT * FROM users WHERE user_google_id = ?', [googleId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    if (rows && rows.length > 0) {
                        // User exists
                        resolve(rows[0]);
                    } else {
                        // User does not exist, add them to the database and sign in
                        this.db.run('INSERT INTO users (user_google_id, user_name, user_email) VALUES (?, ?, ?)', [googleId, name, email], function(err) {
                            if (err) {
                                reject(err);
                            } else {
                                // After inserting, get the user to return it
                                this.db.all('SELECT * FROM users WHERE user_google_id = ?', [googleId], (err, rows) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(rows[0]);
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
            this.db.all('SELECT * FROM users WHERE user_google_id = ?', [googleId], (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows && rows.length > 0) {
                    resolve(rows[0]);
                } else {
                    resolve(null);
                }
            });
        });
    }
}

module.exports = Auth;