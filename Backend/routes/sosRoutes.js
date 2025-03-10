const express = require("express");
const { createSOSRequest, getActiveSOSRequests } = require("../controllers/SOSController");
const auth = require("../middlewares/auth.js");
const router = express.Router();

// Create SOS request
router.post("/", auth(["user"]), createSOSRequest);

// Get active SOS requests
router.get("/", auth(["ambulance", "admin"]), getActiveSOSRequests);

module.exports = router;