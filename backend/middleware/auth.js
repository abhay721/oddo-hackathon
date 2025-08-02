const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
module.exports = function (req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: "No token" });
    try {
        req.user = jwt.verify(token.replace(/^Bearer /, ''), JWT_SECRET);
        next();
    } catch (e) {
        res.status(401).json({ error: "Invalid token" });
    }
};