// Import the jsonwebtoken for creating JWTs
const jwt = require("jsonwebtoken");

// Import the User model database interactions
const User = require("../models/user");

// Load environment variables
require("dotenv").config();

// Middleware to verify JWT
exports.userSignin = (req, res, next) => {
    // Get the authorization header from the request
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization header is missing"
        });
    }

    // Split the header to get the token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: "Token is missing"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY); 
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token",
            error: error.message
        });
    }
};


// Middleware to admin verify
exports.isAdmin = async (req, res, next) => {
    try {
        // Fetch the user from the database using the ID from the JWT
        const user = await User.findById(req.user.userId); 
       
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check if the user has the admin role 
        if (user.role !== 1) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        } else {
            next();
        }
    } catch (error) {
        return res.status(401).json({
            error: error.message
        });
    }
}
