const database = require('./database.js');

function adminAuth(req, res, next) {

    const googleId = req.session.passport?.user;

    if (!googleId) {
        return res.status(400).json({ message: "googleId is required" });
    }

    const isAdmin = googleId === process.env.ADMIN_GOOGLE_ID;
    if (isAdmin) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

exports.adminAuth = adminAuth;

async function verifiedUserAuth(req, res, next) {
    try {
        const googleId = req.session.passport?.user;
    
        if (!googleId) {
            return res.status(400).json({ message: "googleId is required" });
        }
    
        const users = await database.auth.getAllVerifiedUsers();
        const isVerified = users.some(user => user.user_google_id === googleId);
  
        if (!isVerified) {
            return res.status(401).json({ message: "Unauthorized" });
        }
    
        next();
    } catch (err) {
        console.error("verifiedUserAuth error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}  

exports.verifiedUserAuth = verifiedUserAuth;