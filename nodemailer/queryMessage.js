const nodemailer = require("nodemailer")

require("dotenv").config();

const queryMessage = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.PASS_USER
        }
    })

    const mailOption = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    }

    try {
        await transporter.sendMail(mailOption);
        console.log("Mail sent to:", email);
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
}

module.exports = queryMessage