const express = require("express");
const router = express.Router();
const AmbulanceController = require("../controllers/AmbulanceController");
const auth = require("../middlewares/auth");

router.get("/nearby", auth(["user", "admin"]), AmbulanceController.getNearbyAmbulances);
router.post("/update-location", auth(["ambulance"]), AmbulanceController.updateLocation);

module.exports = router;
