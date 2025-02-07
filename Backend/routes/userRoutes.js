const express = require("express");
const { updateUserLocation } = require("../controllers/userController");
const auth = require("../middlewares/auth.js");

const router = express.Router();

// Update user location
router.put("/location", auth(["user"]), updateUserLocation);

module.exports = router;
