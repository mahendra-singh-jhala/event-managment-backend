// Import mongoose
const mongoose = require("mongoose")


const SoldticketSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true 
    },
        
    ticketType: { 
        type: String, 
        required: true 
    },
        
    price: { 
        type: Number, 
        required: true 
    },

    totalPrice: {
        type: Number, 
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },
        
    eventId: { 
        type: String, 
        required: true 
    },

    paymentId: { 
        type: String
    },

    orderId: { 
        type: String
    },

    datePurchased: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

const SoldTicket = mongoose.model("SoldTicket", SoldticketSchema)

module.exports = SoldTicket