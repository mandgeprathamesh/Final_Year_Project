const mongoose = require("mongoose");

const ambulanceSchema = new mongoose.Schema({
    ambulanceNumber: { type: String, required: true, unique: true },
    driverName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hospitalAssociated: { type: String, required: true },
    isAvailable: { type: Boolean, default: true }, // Indicates if the ambulance is available for service
}, { timestamps: true });

const Ambulance = mongoose.model("Ambulance", ambulanceSchema);

module.exports = Ambulance;
