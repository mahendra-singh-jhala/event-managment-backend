// Import mongoose
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: Number,
        default: 0
    },

    firstName: {
        type: String
    },

    lastname: {
        type: String
    },

    contactnumber: {
        type: String
    },

    address: {
        type: String
    },

    city: {
        type: String
    },

    state: {
        type: String
    },
    
    resetPasswordToken: {
        type: String
    },

    resetPasswordExpires: {
        type: Date
    },

    profilePicture: { 
        type: [String], 
        default: [] 
    }

}, { timestamps: true })

// create the user modele
const User = mongoose.model("User", userSchema);

module.exports = User;