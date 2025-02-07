module.exports = (io, socket) => {
    socket.on("ambulance-location", async (data) => {
        const { latitude, longitude } = data;
        const driverId = socket.user.id; // Use authenticated driver ID

        if (!latitude || !longitude) {
            return console.error("Ambulance location is incomplete.");
        }

        // Update ambulance location in DB
        await Ambulance.findOneAndUpdate(
            { driverId },
            { location: { latitude, longitude }, socketId: socket.id },
            { upsert: true, new: true }
        );

        // Broadcast to all nearby users
        const users = await User.find();
        const nearbyUsers = users.filter((user) => {
            if (!user.location) return false;
            return geolib.getDistance(
                { latitude, longitude },
                { latitude: user.location.latitude, longitude: user.location.longitude }
            ) <= 5000; // 5km range
        });

        nearbyUsers.forEach((user) => {
            io.to(user.socketId).emit("ambulance-updated", { driverId, latitude, longitude });
        });
    });

    socket.on("disconnect", async () => {
        console.log("Ambulance disconnected:", socket.id);

        // Mark ambulance as offline in the database
        await Ambulance.findOneAndUpdate({ socketId: socket.id }, { socketId: null });
    });
};
