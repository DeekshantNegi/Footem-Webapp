import mongoose from 'mongoose'

const Paymentschema = new mongoose.Schema(
    {
         
        bookingId: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        amont: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
        },
        razorpayOrderId: {
            type: String,
            required: true,
        },
        razorpayPaymentId: {
            type: String,
            required: true,
        },
        razorpaySignature: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        createdAt: Date

    }
)

export const Payment = mongoose.model("Payment",Paymentschema)
