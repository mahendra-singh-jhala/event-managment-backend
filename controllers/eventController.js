// Import require module
const Event = require("../models/event")
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const SoldTicket = require("../models/soldTicket")
const updateEventMail = require("../nodemailer/updateEvent")

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    },
});

const upload = multer({ storage });

// Controller function for creating a new event
exports.createEvent = async (req, res) => {
    // Destructure from req.body
    const { title, description, date, time, location, category, ticketPricing } = req.body;

    // Access uploaded files
    const images = req.files['images'] ? req.files['images'].map(file => `/uploads/${file.filename}`) : [];
    const videos = req.files['videos'] ? req.files['videos'].map(file => `/uploads/${file.filename}`) : [];
    try {
        const newEvent = new Event({
            title,
            description,
            date,
            time,
            location,
            category,
            ticketPricing,
            images,
            videos,
            status: 'pending'
        });

        await newEvent.save();

        res.status(200).json({
            message: "New Event created successfully", 
            newEvent,
        });
    } catch (error) {
        res.status(500).json({
            message: "New Event not created",
            error: error.message,
        });
    }
};

// Controller function for upload image and videos
exports.upload = upload.fields([{ name: 'images', maxCount: 10 }, { name: 'videos', maxCount: 10 }]);


// Controller function for Get all event
exports.getAllEvent = async (req, res) => {
    try {
        const events = await Event.find({ status: 'approved' })
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching the Event",
            error: error.message
        })
    }
}


// Controller function for Get event by id
exports.getEventbyId = async (req, res) => {
    try {
        const events = await Event.findById(req.params.id)

        if (!events) {
            return res.status(404).json({
                message: "Event not found"
            })
        }
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({
            message: "Error fetching the Event",
            error: error.message
        })
    }
} 


// Controller function for update event by id
exports.updateEvent = async (req, res) => {
    try {
        const updateEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updateEvent) {
            return res.status(404).json({
                message: "Event not found"
            })
        }

        const soldTicket = await SoldTicket.findOne({ eventId: req.params.id })

        if (!soldTicket) {
            return res.status(404).json({
                message: "No tickets sold for this event"
            });
        }

        let ticketEmails = [];

        if (soldTicket.tickets && soldTicket.tickets.length > 0) {
            ticketEmails = soldTicket.tickets.map(ticket => ticket.email);
        } else if (soldTicket.email) {
            ticketEmails = [soldTicket.email];
        }

        const subject = `Important Update: ${updateEvent.title} Schedule`
        const text = `Dear Attendee,We wanted to let you know that the schedule for the event "${updateEvent.title}" has been updated. Here are the new details:${JSON.stringify(req.body)}.Please check the event page for more information.Best regards,The Event Team`;

        const AllEmail = ticketEmails.map(email => 
            updateEventMail(email, subject, text)
        )

        await Promise.all(AllEmail)

        res.status(200).json({
            message: "Update successfully",
            updateEvent
        })

    } catch (error) {
        res.status(500).json({
            message: "Error updating the Event",
            error: error.message
        })
    }
}


// Controller function for delete event by id
exports.deleteEvent = async (req, res) => {
    try {
        const deleteEvent = await Event.findByIdAndDelete(req.params.id);

        if (!deleteEvent) {
            return res.status(404).json({
                message: "Event not found"
            })
        }
        res.status(200).json({
            message: "Event delete successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error deleting the Event",
            error: error.message
        })
    }
}


exports.getPending = async (req, res) => {
    try {
        const pendingEvents = await Event.find({ status: 'pending' })

        if (!pendingEvents) {
            return res.status(404).json({ 
                message: 'Pending Event not found' 
            });
        }
        res.status(200).json(pendingEvents);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching the Event",
            error: error.message
        })
    }
}

exports.requestEvent = async (req, res) => {
    const { status } = req.body
    try {
        const requestEvent = await Event.findByIdAndUpdate(req.params.id, { status }, { new: true })

        if (!requestEvent) {
            return res.status(404).json({
                message: "Event not found"
            })
        }
        res.status(200).json(requestEvent)
    } catch (error) {
        res.status(500).json({
            message: "Error deleting the Event",
            error: error.message
        })
    }
}