const express = require("express");
const authmiddleware = require("../middleware/authMiddleware");
const feedbackController = require("../controllers/feedbackController")

const router = express.Router();

// this route post the feedback
router.post("/", authmiddleware.userSignin, feedbackController.feedback)

// this route use to get feedback
router.get("/", feedbackController.getFeedback)

module.exports = router;

