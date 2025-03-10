const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const Ambulance = require("../models/Ambulance.js"); // Import Ambulance model
const { JWT_SECRET, TOKEN_EXPIRY } = require("../config/constants.js");

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!email || !password || !name || !role) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        let existingUser;
        if (role === "ambulance") {
            existingUser = await Ambulance.findOne({ email });
        } else {
            existingUser = await User.findOne({ email });
        }

        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered." });
        }

        let user;
        if (role === "ambulance") {
            user = new Ambulance({ name, email, password, role });
        } else {
            user = new User({ name, email, password, role });
        }

        await user.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to register user." });
    }
};

exports.login = async (req, res) => {
    const { email, password, role } = req.body;
    console.log("received email, password, and role are:-", email, password, role);

    if (!email || !password || !role) {
        return res.status(400).json({ error: "Email, password, and role are required." });
    }

    try {
        let user;
        if (role === "ambulance") {
            user = await Ambulance.findOne({ email });
        } else {
            user = await User.findOne({ email });
        }

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
        res.status(200).json({ token, message: "Login successful!" });
    } catch (error) {
        res.status(500).json({ error: "Login failed." });
    }
};
