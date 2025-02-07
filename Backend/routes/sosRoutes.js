const express = require("express");
const { createSOSRequest, getActiveSOSRequests } = require("../controllers/SOSController");
const auth = require("../middlewares/auth.js");
const router = express.Router();

router.post("/", auth(["user"]), createSOSRequest);
router.get("/", auth(["ambulance", "admin"]), getActiveSOSRequests);

module.exports = router;
