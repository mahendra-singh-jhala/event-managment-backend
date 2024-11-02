const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
    queryType: {
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

const Query = mongoose.model("Query", querySchema);

module.exports = Query;