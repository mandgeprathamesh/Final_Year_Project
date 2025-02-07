require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { connectDatabase } = require("./config/db.js");
const initializeSocket = require("./sockets/index.js");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const ambulanceRoutes = require("./routes/ambulanceRoutes");
const userRoutes = require("./routes/userRoutes"); // Import user routes

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
app.use("/api/auth", authRoutes);
app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/users", userRoutes); // Add user routes

// Socket.io
initializeSocket(server);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await connectDatabase();
});
