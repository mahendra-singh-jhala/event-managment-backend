// Import require module
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt") // Import the bcrypt for hashing passwords
const sendMail = require("../nodemailer/resetPasswordMail")

// Load enviornment variables
require("dotenv").config();


// Controller function for user registration
exports.register = async (req, res) => {

    // destructure name, email, password from req.body
    const { username, email, password } = req.body

    // all fields require validation
    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    try {
         // Check if the user name already exists
         const existingUser  = await User.findOne({ $or: [{ username }, { email }] });
         if (existingUser ) {
             return res.status(409).json({
                 message: existingUser.username === username ? "Username already exists" : "User  email already exists"
             });
         }

        // hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // register user
        const newUser = new User({
            username,
            email,
            password: hashPassword
        })

        await newUser.save();
        res.status(200).json({
            message: "User registered successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "User registered failed",
            error: error.message
        })
    }

}


// Controller function for user login
exports.login = async (req, res) => {
    const { email, password } = req.body

    // all fields require validation
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    try {
        // match user email and password
        const user = await User.findOne({ email: email })

        if (!user) {
            res.status(400).json({
                message: "Email Not found"
            })
        }

        const matchPassword = await bcrypt.compare(password, user.password)

        if (!matchPassword) {
            return res.status(400).json({
                message: "Password Not Match"
            })
        }

        // if valid, generate the JWT token for the user
        const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.SECRET_KEY, { expiresIn: "7D" })

        // return the token user
        res.json({ 
            user: {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            token })

    } catch (error) {
        res.status(500).json({
            message: "Login Failed",
            error: error.message
        })
    }
}


// Controller function for user password Rest link
exports.forgetPassword = async (req, res) => {
    // Destructure email from request body
    const { email } = req.body;

    try {
        // Check if user exists with the provided email
        const user = await User.findOne({ email: email })

        // If user is not found, return an error response
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }

        // Generate a random token for password reset, Token expires in 1 hour
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1hr" })
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;

        // Save the updated user document to the database
        await user.save();

        // Create a password reset link using the generated token
        const restlink = `https://event-management-web.netlify.app/reset-password/${token}`

        // Send the reset link to the user's email (to, subject, text)
        await sendMail(user.email, "Password Reset", `Reset Your Password: ${restlink}`);

        // Respond with a success message
        res.status(200).json({
            message: `Password reset link sent to your email ${user.email}`
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error. Please try again later',
            error: error.message
        });
    }
}


// Controller function for user reset password
exports.resetPassword = async (req, res) => {
    // Destructure password from request body
    const { password, confirmPassword } = req.body;

    // Get the token from the request parameters
    const { token } = req.params;

    // verfiy the token
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        // Find the user by ID in the decoded token
        const user = await User.findById(decoded.userId)

        // If no user is found, return an error response
        if (!user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if(password !== confirmPassword) {
            return res.status(400).json({
                error: 'Password doee not match'
            });
        }

        // Check if the token has expired
        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                error: 'Token has expired.'
            });
        }

        // Hash the new password using bcrypt before saving it
        user.password = await new bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        // Save the updated user document to the database
        await user.save();

        // Send a success response indicating that the password has been reset
        res.status(200).json({
            message: "Password reset successful"
        });
    } catch (error) {
        res.status(500).json({
            message: "Invalid or expired token",
            error: error.message
        })
    }
}


// Controller function for not accese rest pasword page direct

exports.getAccess = async (req, res) => {
    const { token } = req.params;

    // Check if the token is null or undefined
    if (!token) {
        return res.status(400).json({
            error: 'Token is required'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        // Find the user by ID in the decoded token
        const user = await User.findById(decoded.userId)

        // If no user is found, return an error response
        if (user.token === ":token") {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        res.status(200).json({
            message: "successful"
        });
    } catch (error) {
        res.status(500).json({
            message: "Invalid or expired token",
            error: error.message
        })
    }
}

