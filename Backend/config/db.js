const mongoose = require("mongoose");

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,);
        console.log("Database connected successfully!");
    } catch (err) {
        console.error("Database Connection Failed:", err);
        process.exit(1);
    }
};

module.exports = { connectDatabase };

// mongodb+srv://mandgeprathamesh10:<db_password>@cluster0.yjk6t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
