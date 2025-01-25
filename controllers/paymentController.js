const Razorpay = require("razorpay");
const crypto = require("crypto");
const SoldTicket = require("../models/soldTicket");
const PaymentConfirmationMail = require("../nodemailer/payment")
require("dotenv").config();


const razorpay = new Razorpay({
    key_id: process.env.ROZ_KEY_ID, 
    key_secret: process.env.ROZ_KEY_SECRET
});

// Create a payment order
exports.payment = async (req, res) => {
    const { amount, currency } = req.body;

    const options = {
        amount: amount, 
        currency,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.status(200).json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
        })
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating order', 
            error 
        });
    }
};


exports.paymentVerification = async (req, res) => {
    const { paymentId, orderId, ticketType, totalPrice, eventId, quantity, price } = req.body;
    const generatedSignature = req.headers['x-razorpay-signature'];
    const email = req.user.email;  

    const expectSingnature = crypto.createHmac('sha256', razorpay.key_secret)
        .update(orderId + "|" + paymentId)
        .digest('hex');
    

    if (expectSingnature === generatedSignature) {
        try {
            const ticket = new SoldTicket({
                paymentId,
                orderId,
                email,
                ticketType,
                price,
                totalPrice,
                eventId,
                quantity
            });
            await ticket.save();

            res.json({ 
                success: true, 
                message: 'Payment verified successfully',

            });
            PaymentConfirmationMail(email, paymentId);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Failed to save payment details', 
                error 
            });
        }
    } else {
        res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
};