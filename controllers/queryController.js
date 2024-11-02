const User = require("../models/user")
const Query = require("../models/query")
const queryMessage = require("../nodemailer/queryMessage")


exports.query = async (req, res) => {
    const { queryType, description, firstname, lastname, email} = req.body;
    const userEmail = req.user.email;

    try {
        const user = await User.findOne({ email: userEmail })

        if (!user) {
            return res.status(409).json({
                message: "User Not Found"
            });
        }

        const newQuery = new Query({
            queryType,
            description,
            firstname,
            lastname,
            email
        })

        await newQuery.save();
        res.status(200).json({
            message: "Query Send Successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Query failed to send, Try again",
            error: error.message
        })
    }
}


exports.getQuery = async (req, res) => {
    try {
        const query = await Query.find()
        res.json(query);
    } catch (error) {
        res.status(500).json({
            message: "Error to fetching Query",
            error: error.message
        })
    }
}

exports.replayQuery = async (req, res) => {
    const { replay, email, _id } = req.body;


    try {
        const query = await Query.findById({ _id: _id})
        if (!query) {
            res.status(404).json({ 
                message: "Query not found" 
            })
        }
        res.status(200).json({
            message: "Query Send Successfully",
            query
        })
        queryMessage(email, "Your Query",  `${replay}`)
        await Query.findByIdAndDelete(_id);
    } catch (error) {
        res.status(500).json({
            message: "Error to fetching Query",
            error: error.message
        })
    }
}