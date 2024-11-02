const express = require("express");
const profileController = require("../controllers/profileController")
const authmiddleware = require("../middleware/authMiddleware")

// create a router
const router = express.Router();

// This route handles POST requests for user update profile
router.post("/updateprofile", authmiddleware.userSignin, profileController.upload,  profileController.updateProfile)

// This route handles GET requests for user profile
router.get("/getAllprofile", profileController.getAllProfile)

// This route handles GET requests for user profile
router.get("/getprofile", authmiddleware.userSignin, profileController.getProfile)

// This route handles POST requests for user changed password (if user now is old password)
router.post("/changepassword", authmiddleware.userSignin,  profileController.changepassword)


module.exports = router;