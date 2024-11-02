const Feedback = require("../models/feedback")
const User = require("../models/user");

exports.feedback = async (req, res) => {
    const { feedbackType, description, firstname, lastname, email } = req.body
    const userEmail = req.user.email;

    try {
        const user = await User.findOne({ email: userEmail});

        if(!user) {
            return res.status(409).json({
                message: "User Not Found"
            });
        }

        const newFeedback = new Feedback({
            feedbackType,
            description,
            firstname,
            lastname,
            email
        })

        await newFeedback.save();
        res.status(200).json({
            message: "feedback send successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "feedback send failed",
            error: error.message
        })
    }
}


exports.getFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ feedbackType: "Comments"})
        res.status(200).json(feedback)
    } catch (error) {
        res.status(500).json({
            message: "feedback send failed",
            error: error.message
        })
    }
}