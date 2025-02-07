const User = require("../models/User");

// Update user location
const updateUserLocation = async (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude are required." });
    }

    try {
        const userId = req.user.id;

        const user = await User.findByIdAndUpdate(
            userId,
            { location: { latitude, longitude } },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: "User not found." });

        res.status(200).json({ message: "Location updated successfully.", user });
    } catch (error) {
        res.status(500).json({ error: "Failed to update location." });
    }
};

module.exports = { updateUserLocation };
