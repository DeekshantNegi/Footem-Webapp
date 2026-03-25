import { Turf } from "../Models/turfs.model.js";
import { Booking } from "../Models/booking.model.js";
import asyncHandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import APIresponse from "../Utils/ApiResponse.js";
import {generateSlots} from "../Utils/generateSlots.js";

const createBooking = asyncHandler(async (req, res) => {
  const { date, slot, phone } = req.body;
  const { turfId } = req.params;
  const userId = req.user?._id;

  if (!date || !slot || !phone) {
    throw new ApiError(400, "All fields are required");
  }
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const turf = await Turf.findById(turfId).populate("owner");
  if (!turf || turf.isActive === false) {
    throw new ApiError(404, "Turf not found or is not active");
  }

  const allSlots = generateSlots(turf.openTime, turf.closeTime);

  if (!allSlots.includes(slot)) {
    throw new ApiError(400, "Invalid time slot");
  }

  if (turf.owner.user.toString() === req.user._id.toString()) {
    throw new ApiError(403, "Owner cannot book their own turf");
  }
  const price = turf.priceperhour;

  const existingBooking = await Booking.findOne({
    turfId,
    date,
    slot,
    bookingStatus: { $in: ["pending", "confirmed"] },
  });

  if (existingBooking) {
    throw new ApiError(
      400,
      "Turf is already booked for the selected time slot",
    );
  }

  const [startHour] = slot.split("-");
  const bookingDateTime = new Date(date);
  bookingDateTime.setHours(startHour, 0, 0, 0);

  if (bookingDateTime < new Date()) {
    throw new ApiError(400, "Cannot book for past date and time");
  }

  const booking = await Booking.create({
    userId,
    turfId,
    date,
    slot,
    totalPrice: price,
    bookingStatus: "pending",
    phone,
  });
  if (!booking) {
    throw new ApiError(500, "Failed to create booking");
  }
  return res
    .status(201)
    .json(new APIresponse(201, booking, "Booking created successfully"));
});

const confirmBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  // write payment success 
  booking.bookingStatus = "confirmed";
  await booking.save();

  return res
    .status(200)
    .json(new APIresponse(200, booking, "Booking confirmed successfully"));
});

const getMyBookings = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }
  const bookings = await Booking.find({ userId }).populate("turfId");
  if (bookings.length === 0) {
    throw new ApiError(404, "No bookings found");
  }
  return res
    .status(200)
    .json(new APIresponse(200, bookings, "Bookings retrieved successfully"));
});

const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  if (!bookingId) {
    throw new ApiError(400, "Booking ID is required");
  }
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  if (booking.userId.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "You are not authorized to cancel this booking");
  }
  booking.bookingStatus = "cancelled";
  
  await booking.save();
  return res
    .status(200)
    .json(new APIresponse(200, booking, "Booking cancelled successfully"));
});

const getBookingById = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  if (!bookingId) {
    throw new ApiError(400, "Booking ID is required");
  }
  const booking = await Booking.findById(bookingId)
    .populate("turfId")
    .populate("userId", "name email");
  if (!booking) throw new ApiError(404, "Booking not found");
  return res
    .status(200)
    .json(new APIresponse(200, booking, "Booking retrieved successfully"));
});

const getOwnerBookings = asyncHandler(async (req, res) => {
  const { turfId } = req.params;
  const turf = await Turf.findById(turfId).populate("owner");
  if (!turf) {
    throw new ApiError(404, "Turf not found");
  }

  if (turf.owner.user.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "You are not authorized");
  }
  const bookings = await Booking.find({ turfId }).populate(
    "userId",
    "name email",
  );
  if (!bookings) {
    throw new ApiError(404, "No bookings found for this turf");
  }
  return res
    .status(200)
    .json(new APIresponse(200, bookings, "Bookings retrieved successfully"));
});

export {
  createBooking,
  confirmBooking,
  getMyBookings,
  cancelBooking,
  getBookingById,
  getOwnerBookings,
};
