const User = require("../models/User.js");
const bcrypt = require("bcryptjs");

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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ 
            name, 
            email, 
            password: hashedPassword,
            role 
        });
        
        await user.save();
        res.status(201).json({ 
            message: "User registered successfully!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Failed to register user." });
    }
};

exports.login = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ error: "Email, password, and role are required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        if (user.role !== role) {
            return res.status(401).json({ error: "Invalid role for this user." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        // Return user data without JWT token
        res.status(200).json({ 
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            },
            message: "Login successful!" 
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed." });
    }
};