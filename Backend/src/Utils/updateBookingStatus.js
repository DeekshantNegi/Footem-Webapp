import cron from "node-cron";
import {Booking} from "../Models/booking.model.js";

export const startBookingCron = () => {
/* Cancel unpaid bookings */
cron.schedule("*/2 * * * *", async () => {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  await Booking.updateMany(
    {
      bookingStatus: "pending",
      createdAt: { $lt: tenMinutesAgo },
    },
    {
      $set: { bookingStatus: "cancelled" },
    },
  );
});

/* Mark completed bookings */
cron.schedule("*/5 * * * *", async () => {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentHour = now.getHours();

  const bookings = await Booking.find({
    date: today,
    bookingStatus: "confirmed",
  });

  for (const booking of bookings) {
    const [start, end] = booking.slot.split("-").map(Number);
    if (currentHour >= end) {
      booking.bookingStatus = "completed";
      await booking.save();
    }
  }
});

};
