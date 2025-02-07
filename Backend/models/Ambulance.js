const mongoose = require("mongoose");

const AmbulanceSchema = new mongoose.Schema({
    driverName: { type: String, required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model("Ambulance", AmbulanceSchema);
