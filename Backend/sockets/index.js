const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const ambulanceSocket = require("./ambulanceSocket.js");
const userSocket = require("./userSocket.js");

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // Replace with frontend URL in production
            methods: ["GET", "POST"],
        },
    });

    global.io = io; // Store the io instance globally

    console.log("Socket.io initialized");

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Unauthorized: Token not provided"));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // Attach user info to the socket
            next();
        } catch (error) {
            return next(new Error("Unauthorized: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Assign the user socket to the respective handler
        if (socket.user.role === "ambulance") {
            ambulanceSocket(io, socket);
        } else if (socket.user.role === "user") {
            userSocket(io, socket);
        }

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};

module.exports = initializeSocket;
