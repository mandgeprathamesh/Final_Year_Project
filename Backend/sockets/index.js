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

    // Middleware for authenticating sockets
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

        // Initialize specific socket handlers
        ambulanceSocket(io, socket);
        userSocket(io, socket);

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};

module.exports = initializeSocket;
