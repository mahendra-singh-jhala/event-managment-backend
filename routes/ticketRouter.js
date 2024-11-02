// Import require module
const express = require("express");
const ticketController = require("../controllers/ticketController");
const authmiddleware = require("../middleware/authMiddleware")

// create a router
const router = express.Router();

// This route handles POST requests for create tickets
router.post("/create-ticket", ticketController.createTicket)

// This route handles GET requests for get ticket
router.get("/ticket", ticketController.getTicket)

// This route handles GET requests for getting tickets by event ID
router.get("/event/:eventId", ticketController.getTicketsByEventId);

// This route handles GET requests for getting tickets by ticket ID
router.get("/userAllTickets", ticketController.getAllUserTicket);

// This route handles GET requests for getting tickets by ticket ID
router.get("/userTicket", authmiddleware.userSignin, ticketController.getTicketByUser);

// This route handles GET requests for getting tickets by ticket ID
router.delete("/cancelTicket/:ticketId", authmiddleware.userSignin, ticketController.cancelTicket);


module.exports = router