const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AmbulanceAuthController");

router.post("/signup", AuthController.register);
router.post("/login", AuthController.login);

module.exports = router;