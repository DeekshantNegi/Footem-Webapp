import express from 'express';
import { verifyJWT, authorizeRoles } from '../Middlewares/auth.middleware.js';

import {
    createBooking,
    getMyBookings,
    cancelBooking,
    getBookingById,
    getOwnerBookings,
} from '../Controllers/bookings.controller.js';

const router = express.Router();

router.use(verifyJWT);

router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.route('/:bookingId').get(getBookingById).patch(cancelBooking);
router.get('/owner/:turfId', authorizeRoles("owner"), getOwnerBookings);


export default router;