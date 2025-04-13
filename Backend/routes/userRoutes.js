const express = require("express");
const { 
    updateUserLocation, 
    getProfileDetails, 
    getAvailableAmbulances,
    bookAmbulance
} = require("../controllers/userController");

const router = express.Router();

// Update user location
router.put("/location", updateUserLocation);

// Get user profile
router.get("/profile/:userId", getProfileDetails);


// Get available ambulances nearby (query param: userId)
router.get("/ambulances/available", getAvailableAmbulances);

// Book an ambulance
router.post("/ambulances/book", bookAmbulance);

module.exports = router;