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
  
    const { email, password } = req.body;
    console.log("received email and password are:-",email,password);

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
        res.status(200).json({ token, message: "Login successful!" });
    } catch (error) {
        res.status(500).json({ error: "Login failed." });
    }
};
