const express = require("express");
const { updateUserLocation, getUserProfile, updateUserProfile } = require("../controllers/userController");
const auth = require("../middlewares/auth.js");

const router = express.Router();

// Update user location
router.put("/location", auth(["user"]), updateUserLocation);

// Get user profile
router.get("/profile", auth(["user"]), getUserProfile);

// Update user profile
router.put("/profile", auth(["user"]), updateUserProfile);

module.exports = router;
