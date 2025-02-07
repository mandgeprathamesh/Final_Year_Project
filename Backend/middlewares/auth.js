const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/constants");

const auth = (roles = []) => (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        if (roles.length && !roles.includes(decoded.role)) {
            return res.status(403).json({ message: "Access Denied: Insufficient privileges." });
        }

        next();
    } catch (err) {
        return res.status(400).json({ message: "Invalid token." });
    }
};

module.exports = auth;
