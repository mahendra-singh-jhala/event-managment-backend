// Import nodemailer
const nodemailer = require("nodemailer");

// Load enviornment variables
require("dotenv").config();


// Function to send confirmation email
const PaymentConfirmationMail = async (email, paymentId) => {
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
        subject: "Ticket Purchase Confirmation",
        text: `Thank you for your purchase! Your payment ID is ${paymentId}.`,
    }

    // send the email
    try {
        await transporter.sendMail(mailOption);
        console.log("Mail sent to:", email);
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
}

module.exports = PaymentConfirmationMail