// Import mongoose
const mongoose = require("mongoose")

const TicketSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Event", 
        required: true
    },

    title: { 
        type: String,
        required: true
    },

    ticketTypes: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    }
}, { timestamps: true })


const Ticket = mongoose.model("Ticket", TicketSchema)

module.exports = Ticket