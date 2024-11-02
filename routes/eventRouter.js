// Import require module
const express = require("express");
const eventController = require("../controllers/eventController");

// create a router
const router = express.Router();

// Create an event
router.post("/", eventController.upload, eventController.createEvent)

// Get all event
router.get("/", eventController.getAllEvent)

router.get('/pending', eventController.getPending )

// Get event by id
router.get("/:id", eventController.getEventbyId)

// update event by id
router.put("/:id", eventController.updateEvent)

// delete event by id
router.delete("/:id", eventController.deleteEvent)

router.patch("/:id/approve", eventController.requestEvent)




module.exports = router;

