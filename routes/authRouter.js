// Import require module
const express = require("express")
const authController = require("../controllers/authController");
const authmiddleware = require("../middleware/authMiddleware")

// create router
const router = express.Router();


// This route handles POST requests for user registration
router.post("/register", authController.register)

// This route handles POST requests for user login
router.post("/login", authController.login)

// This route handles POST requests for user reset password link
router.post("/forget-password", authController.forgetPassword)

// This route handles POST requests for user reset password
router.post("/reset-password/:token", authController.resetPassword)

// This route handles POST requests for not accese rest pasword page direct
router.post("/get-access/:token", authController.getAccess)

// This route handle GET requests for check user
router.get("/user-check", authmiddleware.userSignin, (req, res) => {
    res.status(200).send({ ok: true });
});

// This route handle GET requests for check admin
router.get("/admin-check", authmiddleware.userSignin, authmiddleware.isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});


module.exports = router;