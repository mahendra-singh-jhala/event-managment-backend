const User = require("../models/user");
const bcrypt = require("bcrypt");
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const uploadsDir = path.join(__dirname, 'Profileupload');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    },
});

const upload = multer({ storage });

exports.updateProfile = async (req, res) => {
    // Destructure new user data from the request body
    const { username, firstName, lastname, email, contactnumber, address, city, state } = req.body;
    const userId = req.user.userId; 

    const profilePicture = req.files['profilePicture'] ? req.files['profilePicture'].map(file => `/Profileupload/${file.filename}`) : [];

    // Prepare the update object
    const updateData = {
        username,
        firstName,
        lastname,
        email,
        contactnumber,
        address,
        city,
        state,
        profilePicture
    };

    try {
        const updatedUser  = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!updatedUser ) {
            return res.status(404).json({
                message: "User  not found",
            });
        }


        res.status(200).json({
            message: "User  updated successfully",
            user: updatedUser ,
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error. Please try again later',
            error: error.message,
        });
    }
};

exports.upload = upload.fields([{ name: 'profilePicture', maxCount: 10 }]);

exports.getAllProfile = async (req, res) => {
    try {
        const user = await User.find({ role: 0});
        res.status(200).json({
            message: "User get successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error. Please try again later',
            error: error.message,
        });
    }
}

exports.getProfile = async (req, res) => {
    const userId = req.user.userId
    try {
        const user = await User.findOne({ _id: userId })

        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }

        res.status(200).json({
            message: "User get successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error. Please try again later',
            error: error.message,
        });
    }
}

exports.changepassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const email = req.user.email;

    try {
        const user = await User.findOne({ email: email })

        if (!user) {
            res.status(400).json({
                message: "Email Not found"
            })
        }

        const matchPassword = await bcrypt.compare(oldPassword, user.password)

        if (!matchPassword) {
            return res.status(400).json({
                message: "Password Not Match"
            })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                error: "Password must be at least 6 characters long"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                error: "Confirm password not Match"
            });
        } else {
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
            await user.save();

            res.status(200).json({
                message: "Password reset successful"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error. Please try again later',
            error: error.message
        });
    }
};