// Import require module
const Event = require("../models/event")
const Ticket = require("../models/ticket")
const SoldTicket = require("../models/soldTicket")

// create a tickets
exports.createTicket = async (req, res) => {
    // Get eventId from the request
    const { eventId, ticketTypes, price, quantity } = req.body;
    try {
        // Check if the event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const ticket = new Ticket({ eventId, ticketTypes, price, quantity, title: event.title });

        await ticket.save();
        res.status(201).json({
            message: "Ticket create Succsessfully",
            ticket
        });
    } catch (error) {
        res.status(500).json({
            message: "Error to create tickets",
            error: error.message
        })
    }
}

// Get all tickets
exports.getTicket = async (req, res) => {
    try {
        const tickets = await Ticket.find().populate('eventId');
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching the Event",
            error: error.message
        })
    }
}


// Get tickets by event ID
exports.getTicketsByEventId = async (req, res) => {
    try {
        const { eventId } = req.params;
        const tickets = await Ticket.find({ eventId }).populate('eventId');
        if (tickets.length === 0) {
            return res.status(404).json({ message: 'No tickets found for this event' });
        }
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching tickets for the event",
            error: error.message
        });
    }
};

// Get all ticket by user buy
exports.getAllUserTicket = async (req, res) => {
    try {
        const allTicket = await SoldTicket.find()
        res.status(200).json(allTicket);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching the Event"
        })
    }
}

exports.getTicketByUser = async (req, res) => {
    const email = req.user.email;
    try {
        
        const ticket = await SoldTicket.find({ email });
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching the ticket",
            error: error.message
        });
    }
};

exports.cancelTicket = async (req, res) => {
    const ticketId = req.params.ticketId;
    const userEmail = req.user.email;

    try {
        const cancelTicket = await SoldTicket.findOneAndDelete({ _id: ticketId, email: userEmail });

        if (!cancelTicket) {
            return res.status(404).json({
                message: "ticket not found"
            })
        }

        res.status(200).json({
            message: "ticket delete successfully"
        })

    } catch (error) {
        res.status(500).json({
            message: "Error deleting the ticket",
            error: error.message
        })
    }
}