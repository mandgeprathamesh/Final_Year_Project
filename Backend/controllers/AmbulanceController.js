const Ambulance = require("../models/Ambulance");

exports.updateLocation = async (req, res) => {
    // const { id } = req.user; // Assume user is authenticated
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude are required." });
    }

    try {
        // const ambulance = await Ambulance.findByIdAndUpdate(
        //     // id,
        //     { latitude, longitude },
        //     { new: true, upsert: true }
        // );
        res.status(200).json({
            "ambulances": [
              {
                "vehicleNumber": "AMB-123",
                "driverName": "Dr. John Smith",
                "type": "Advanced Life Support",
                "latitude": 18.5204,
                "longitude": 73.8567,
                "status": "available"
              },
              {
                "vehicleNumber": "AMB-124",
                "driverName": "Dr. Sarah Johnson",
                "type": "Basic Life Support",
                "latitude": 18.5210,
                "longitude": 73.8570,
                "status": "available"
              }
            ]
          });
    } catch (error) {
        res.status(500).json({ error: "Failed to update location." });
    }
};

exports.getNearbyAmbulances = async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude are required." });
    }

    try {
        const radius = 5 / 6378.1; // 5km radius converted to radians
        const ambulances = await Ambulance.find({
            location: {
                $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
            },
        });

        if (ambulances.length === 0) {
            return res.status(404).json({ message: "No ambulances found nearby." });
        }

        res.status(200).json({ ambulances });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch nearby ambulances." });
    }
};
