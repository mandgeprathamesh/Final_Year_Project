const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ambulance: {
        type: Schema.Types.ObjectId,
        ref: 'Ambulance',
        required: true
    },
    patientDetails: {
        name: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            required: true
        },
        medicalCondition: {
            type: String,
            required: true
        },
        contactNumber: {
            type: String,
            required: true
        }
    },
    pickupLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        },
        address: String
    },
    destination: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number], // [longitude, latitude]
        address: String,
        hospitalName: String
    },
    bookingTime: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'dispatched', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    estimatedArrivalTime: Date,
    actualArrivalTime: Date,
    completionTime: Date,
    cancellationTime: Date,
    cancellationReason: String,
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    amount: Number,
    paymentMethod: String,
    driverNotes: String,
    adminNotes: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    feedback: String
}, {
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add geospatial index for pickup location
bookingSchema.index({ 'pickupLocation.coordinates': '2dsphere' });

// Virtual populate to get booking details with user/ambulance data
bookingSchema.virtual('userDetails', {
    ref: 'User',
    localField: 'user',
    foreignField: '_id',
    justOne: true
});

bookingSchema.virtual('ambulanceDetails', {
    ref: 'Ambulance',
    localField: 'ambulance',
    foreignField: '_id',
    justOne: true
});

// Pre-find hooks to automatically populate references
bookingSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name email phone'
    }).populate({
        path: 'ambulance',
        select: 'vehicleNumber type driver contactNumber'
    });
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;