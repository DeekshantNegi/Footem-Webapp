import razorpay from "../Utils/razorpay";
import asyncHandler from "../Utils/asyncHandler";
import { Booking } from "../Models/booking.model";

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

export { createOrder };
