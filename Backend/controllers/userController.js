const User = require("../models/User");
const Ambulance = require("../models/Ambulance");
const Booking = require("../models/Booking");

// Get user profile details
const getProfileDetails = async (req, res) => {
    try {
        const userId = req.params.userId; // Changed from req.user.id to req.params.userId
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profile details." });
    }
};

// Update user location
const updateUserLocation = async (req, res) => {
    const { userId, latitude, longitude } = req.body;

    if (!userId || !latitude || !longitude) {
        return res.status(400).json({ error: "User ID, latitude and longitude are required." });
    }

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { 
                location: { 
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                lastLocationUpdate: new Date() 
            },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ error: "User not found." });

        res.status(200).json({ message: "Location updated successfully.", user });
    } catch (error) {
        res.status(500).json({ error: "Failed to update location." });
    }
};

// Get available ambulances nearby
const getAvailableAmbulances = async (req, res) => {
    const { userId } = req.query;

    try {
        const user = await User.findById(userId);

        if (!user || !user.location) {
            return res.status(400).json({ error: "User location not available." });
        }

        const ambulances = await Ambulance.find({
            status: 'available',
        });

        res.status(200).json({ ambulances });
    } catch (error) {
        console.error("Error fetching ambulances:", error);
        res.status(500).json({ error: "Failed to fetch available ambulances." });
    }
};

// Book an ambulance
const bookAmbulance = async (req, res) => {
    const { userId, ambulanceId, patientDetails } = req.body;

    if (!userId || !ambulanceId || !patientDetails) {
        return res.status(400).json({ error: "User ID, ambulance ID and patient details are required." });
    }

    try {
        const ambulance = await Ambulance.findById(ambulanceId);
        if (!ambulance || ambulance.status !== 'available') {
            return res.status(400).json({ error: "Ambulance not available for booking." });
        }

        const booking = new Booking({
            user: userId,
            ambulance: ambulanceId,
            patientDetails,
            bookingTime: new Date(),
            status: 'confirmed'
        });

        await booking.save();

        ambulance.status = 'booked';
        await ambulance.save();

        if (global.io) {
            global.io.emit('ambulance-booked', { 
                bookingId: booking._id,
                ambulanceId,
                userId 
            });
        }

        res.status(201).json({ 
            message: "Ambulance booked successfully!", 
            booking,
            ambulance
        });
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ error: "Failed to book ambulance." });
    }
};

module.exports = { 
    getProfileDetails,
    updateUserLocation, 
    getAvailableAmbulances, 
    bookAmbulance 
};