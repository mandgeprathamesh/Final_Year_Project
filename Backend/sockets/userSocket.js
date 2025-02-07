const User = require("../models/User");

module.exports = (io, socket) => {
    console.log("User connected:", socket.id);

    // Save user location
    socket.on("update-user-location", async (data) => {
        const { latitude, longitude } = data;
        const userId = socket.user.id; // Use authenticated user ID

        if (!latitude || !longitude) {
            return console.error("User location is incomplete.");
        }

        // Update user location in DB
        await User.findByIdAndUpdate(
            userId,
            { location: { latitude, longitude }, socketId: socket.id },
            { new: true }
        );
    });

    // Listen for ambulance updates (broadcasted by the ambulanceSocket.js)
    socket.on("ambulance-updated", (data) => {
        const { driverId, latitude, longitude } = data;
        console.log(`Nearby ambulance: Driver ${driverId} at (${latitude}, ${longitude})`);

        // You can add further logic here, such as updating the frontend or emitting an event to the client
        socket.emit("show-ambulance", { driverId, latitude, longitude }); // Optional: Emit to the client
    });

    // Handle user disconnect
    socket.on("disconnect", async () => {
        console.log("User disconnected:", socket.id);

        // Mark user as offline in the database
        await User.findOneAndUpdate({ socketId: socket.id }, { socketId: null });
    });
};
