// Import require module
const express = require("express");
const bodyParser = require("body-parser")
const cors = require("cors")
const connectDB = require("./config/db")
const path = require('path');
const authRouter = require("./routes/authRouter")
const eventRouter = require("./routes/eventRouter")
const ticketRouter = require("./routes/ticketRouter")
const paymentRouter = require("./routes/paymentRouter")
const profileRouter = require("./routes/profileRouter")
const feedbackRouter = require("./routes/feedbackRouter")
const queryRouter = require("./routes/queryRouter")
// Load enviornment variables
require("dotenv").config();

const app = express()

// connect to mongodb
connectDB();

// middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'controllers', 'uploads')));
app.use('/Profileupload', express.static(path.join(__dirname, 'controllers', 'Profileupload')));



// router
app.use("/api/auth", authRouter)
app.use("/api/events", eventRouter)
app.use("/api/tickets", ticketRouter)
app.use("/api/payments", paymentRouter)
app.use("/api/user", profileRouter)
app.use("/api/feedback", feedbackRouter)
app.use("/api/query", queryRouter)


// Port
PORT = process.env.PORT || 5000;

// start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})