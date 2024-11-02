const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema({
    feedbackType: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Feedback = mongoose.model("Feedback", feedbackSchema)

module.exports = Feedback;