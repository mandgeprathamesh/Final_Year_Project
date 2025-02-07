const mongoose = require("mongoose");

const SOSRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    status: { type: String, enum: ["pending", "accepted", "resolved"], default: "pending" },
});

module.exports = mongoose.model("SOSRequest", SOSRequestSchema);
