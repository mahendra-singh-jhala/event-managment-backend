const mongoose = require("mongoose")

// Load enviornment variables
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB is Successfully Connected")
    } catch (erro) {
        console.log("Error: MongoDB Not Connected")
    }
}

module.exports = connectDB