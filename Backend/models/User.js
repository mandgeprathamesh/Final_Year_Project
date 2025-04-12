const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastKnownLocation: {
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null }
    },
    role: { type: String, enum: ["user", "ambulance", "admin"], default: "user" },
},{ timestamps: true });

module.exports = mongoose.model("User", UserSchema);
