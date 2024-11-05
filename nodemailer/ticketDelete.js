// Import nodemailer
const nodemailer = require("nodemailer");

// Load enviornment variables
require("dotenv").config();

// Function to send confirmation to delete ticket
const TicketDeleteConfemationMail = async (email) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.PASS_USER
        }
    })

    const mailOption = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Ticket Delete Confirmation",
        text: "Your Ticket Delete in Two days and Refund will be in your account in two days.Please wait you not able to show your ticket Now in your ticket Portal"

    }

    try {
        await transporter.sendMail(mailOption)
        console.log("Mail sent to:", email);
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
}

module.exports = TicketDeleteConfemationMail