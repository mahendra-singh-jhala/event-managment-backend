const express = require("express");
const authmiddleware = require("../middleware/authMiddleware")
const queryController = require("../controllers/queryController")

const router = express.Router();

// this route use to post query
router.post("/", authmiddleware.userSignin, queryController.query)

// this route get the query 
router.get("/", authmiddleware.userSignin, queryController.getQuery)

// this route post the query replay
router.post("/replay", authmiddleware.userSignin, queryController.replayQuery)

module.exports = router;
