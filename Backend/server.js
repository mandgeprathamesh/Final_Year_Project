require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { connectDatabase } = require("./config/db.js");

// Import Routes
const userauthRoutes = require("./routes/UserAuthRoutes.js");
const ambulanceauthRoutes = require("./routes/AmbulanceAuthRoutes.js");
const ambulanceRoutes = require("./routes/ambulanceRoutes");
const userRoutes = require("./routes/userRoutes");
const sosRoutes = require("./routes/sosRoutes"); // Import SOS routes

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use(require("./middlewares/errorHandler"));

// Routes
app.get("/", (req, res) => {
    res.send("hello");
});
app.use("/api/user/auth", userauthRoutes);
app.use("/api/ambulance/auth", ambulanceauthRoutes);
app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sos", sosRoutes); // Add SOS routes


// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await connectDatabase();
});