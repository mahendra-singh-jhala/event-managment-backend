// Import mongoose
const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    ticketPricing: {
        type: Number,
        required: true
    },

    images: [String],

    videos: [String],

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }

},{ timestamps: true })

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;