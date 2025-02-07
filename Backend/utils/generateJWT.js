const jwt = require("jsonwebtoken");
const { JWT_SECRET, TOKEN_EXPIRY } = require("../config/constants");

const generateJWT = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

module.exports = generateJWT;
