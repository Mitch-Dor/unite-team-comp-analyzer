class Auth {
    /**
       * Constructor for auth class
       * @param {*} db Pass DB object into class
       */
    constructor(db) {
      this.db = db;
    }

    //// OAUTH ////

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
                        this.db.query('INSERT INTO users (user_google_id, user_name, user_email) VALUES ($1, $2, $3) RETURNING *', [googleId, name, email], function(err, res) {
                            if (err) {
                                reject(err);
                            } else {
                                // After inserting, get the user to return it
                                resolve(res.rows[0]);
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

    //// VERIFIED USERS ////

    async getAllVerifiedUsers() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM verified_users';
            this.db.query(sql, (err, res) => {
            if (err) {
                console.error('Could not fetch verified users.');
                reject(err);
            } else {
                resolve(res.rows);
            }
          });
        });
    }
}

module.exports = Auth;