const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email']
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    },
    location: {  // Changed from lastKnownLocation to match Flutter expectations
        type: {
            type: String,
            default: "Point",
            enum: ["Point"]
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]  // Default to [0, 0] for a placeholder location
        }
    },
    address: {
        type: String,
        trim: true,
        default: ""
    },
    phoneNo: {
        type: String,
        trim: true,
        match: [/^[0-9]{10,15}$/, 'Please enter a valid phone number'],
        default: ""
    },
    role: { 
        type: String, 
        enum: ["user", "admin"], // Added all roles
        default: "user" 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Add geospatial index for location
UserSchema.index({ location: '2dsphere' });

// Update timestamp on save
UserSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("User", UserSchema);