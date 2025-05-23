// Import require module
const nodemailer  = require("nodemailer")

const updateEventMail = async (to, subject, text) => {
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
        await transporter.sendMail(mailOption)
        console.log("Mail sent to:", to);
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
}

module.exports = updateEventMail
