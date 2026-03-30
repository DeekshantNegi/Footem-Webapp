import crypto from "crypto";
import razorpay from "../Utils/razorpay";
import asyncHandler from "../Utils/asyncHandler";
import { Booking } from "../Models/booking.model";
import { Payment } from "../Models/payment.model";
import razorpay from "../Utils/razorpay.js";
import ApiError from "../Utils/ApiError.js";

const createOrder = asyncHandler(async (req, res)=>{
   
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if(!booking){
        throw new ApiError(404, "Booking not found");
    }
    if(booking.bookingStatus !== "pending"){
        throw new ApiError(400, "Booking cannot be done");
    }
    
    const options = {
        amount: booking.totalPrice * 100, 
        currency: "INR",
        receipt: `receipt_${bookingId}`,
    };

    const order = await razorpay.orders.create(options);
    if(!order){
        throw new ApiError(500, "Failed to create order");
    }
  res.status(200)
  .json(new ApiResponse(200, { orderId: order.id, amount: order.amount }, "Order created successfully"));
});

const verifyPayment = asyncHandler(async (req, res) => {
   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
   if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId){
    throw new ApiError(400, "Missing information");
   }
   const body = razorpay_order_id + "|" + razorpay_payment_id;
   const expectedSignature = crypto
   .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
   .update(body)
   .digest("hex");

   if(expectedSignature !== razorpay_signature){
    throw new ApiError(400, "Payment verification failed, invalid signature");
}

    const booking = await Booking.findById(bookingId);
    if(!booking || booking.bookingStatus !== "pending"){
        throw new ApiError(404, "Booking not found");
    }   

    const existingPayment = await Payment.findOne({razorpayPaymentId: razorpay_payment_id});
    if(existingPayment){
        throw new ApiError(400, "Payment already exists");
   }

   const payment = await Payment.create({
    bookingId,
    userId: booking.userId,
    amount: booking.totalPrice,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    paymentStatus: "completed",
   });
   
   if(!payment){
     throw new ApiError(500, "Failed to record payment");
   }
   // Update booking status to confirmed
   booking.bookingStatus = "confirmed";
   booking.payment = payment._id;
   await booking.save();

    res.status(200)
    .json(new ApiResponse(200, payment, "Payment verified and booking confirmed successfully"));
});

export { createOrder, verifyPayment };
