const jwt = require("jsonwebtoken");
const Ambulance = require("../models/Ambulance.js");
const { JWT_SECRET, TOKEN_EXPIRY } = require("../config/constants.js");

exports.register = async (req, res) => {
    const { ambulanceNumber, driverName, email, password, hospitalAssociated, isAvailable } = req.body;

    if (!ambulanceNumber || !driverName || !email || !password || !hospitalAssociated) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const existingAmbulance = await Ambulance.findOne({ email });
        if (existingAmbulance) {
            return res.status(400).json({ error: "Email is already registered." });
        }

        const ambulance = new Ambulance({ ambulanceNumber, driverName, email, password, hospitalAssociated, isAvailable: isAvailable ?? true });
        await ambulance.save();
        res.status(201).json({ message: "Ambulance registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to register ambulance." });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Received email and password for ambulance:", email, password);

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        const ambulance = await Ambulance.findOne({ email });
        if (!ambulance) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const token = jwt.sign({ id: ambulance._id, role: "ambulance", isAvailable: ambulance.isAvailable }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
        res.status(200).json({ token, message: "Login successful!", isAvailable: ambulance.isAvailable });
    } catch (error) {
        res.status(500).json({ error: "Login failed." });
    }
};
