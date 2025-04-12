const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { JWT_SECRET, TOKEN_EXPIRY } = require("../config/constants.js");

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!email || !password || !name || !role) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered." });
        }

        const user = new User({ name, email, password, role });
        await user.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to register user." });
    }
};

exports.login = async (req, res) => {
    const { email, password, role } = req.body;
    console.log("Received email, password, and role:", email, password, role);

    if (!email || !password || !role) {
        return res.status(400).json({ error: "Email, password, and role are required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

        // Emit an event upon successful login (assuming io is globally available)
        if (global.io) {
            global.io.emit("user-logged-in", { id: user._id, role: user.role });
        }

        res.status(200).json({ token, message: "Login successful!" });
    } catch (error) {
        res.status(500).json({ error: "Login failed." });
    }
};
