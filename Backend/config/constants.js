module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || "supersecret",
    TOKEN_EXPIRY: "7d",
    GEO_RADIUS: 5000, // 5km in meters
};
