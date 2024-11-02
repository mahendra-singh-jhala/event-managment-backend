// Import require module
const express = require("express");
const paymentController = require("../controllers/paymentController");
const authmiddleware = require("../middleware/authMiddleware")

// create a router
const router = express.Router();

// This route handles POST requests for create tickets payment
router.post("/payment", authmiddleware.userSignin, paymentController.payment)

// This route handles POST requests for handle tickets payment verfication
router.post("/paymentVerify", authmiddleware.userSignin,  paymentController.paymentVerification)

module.exports = router;