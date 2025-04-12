const SOSRequest = require("../models/SOSRequest");
const User = require("../models/User");

exports.createSOSRequest = async (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude are required." });
    }

    const { userId } = req.user;

    try {
        const sosRequest = new SOSRequest({ userId, latitude, longitude });
        await sosRequest.save();

        // Find all connected users
        const users = await User.find({ socketId: { $ne: null } });

        // Send push notification to connected users
        users.forEach((user) => {
            if (user.socketId) {
                req.io.to(user.socketId).emit("new-sos-request", {
                    userId,
                    latitude,
                    longitude,
                    sosRequestId: sosRequest._id,
                });
            }
        });

        res.status(201).json({ sosRequest, message: "SOS request sent successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to create SOS request." });
    }
};

exports.getActiveSOSRequests = async (req, res) => {
    try {
        const sosRequests = await SOSRequest.find({ isResolved: false });
        res.status(200).json({ sosRequests });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch SOS requests." });
    }
};