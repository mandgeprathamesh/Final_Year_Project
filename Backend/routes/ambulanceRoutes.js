const express = require("express");
const router = express.Router();
const AmbulanceController = require("../controllers/AmbulanceController");
const auth = require("../middlewares/auth");

// Get nearby ambulances
router.get("/nearby", AmbulanceController.getNearbyAmbulances);

// Update ambulance location
router.post("/update-location", AmbulanceController.updateLocation);

// Get ambulance profile
// router.get("/profile", auth(["ambulance"]), AmbulanceController.getAmbulanceProfile);

// Update ambulance profile
// router.put("/profile", auth(["ambulance"]), AmbulanceController.updateAmbulanceProfile);

module.exports = router;