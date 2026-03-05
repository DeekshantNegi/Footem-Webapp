import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import userRouter from './Routes/user.routes.js';
import adminRouter from './Routes/admin.routes.js';
import turfRouter from './Routes/turfs.routes.js';
import ownerRouter from './Routes/owner.routes.js';
import bookingRouter from './Routes/bookings.routes.js';


const app = express()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use('/api/v1/users', userRouter );
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/turfs', turfRouter);
app.use('/api/v1/owners', ownerRouter);
app.use('/api/v1/bookings', bookingRouter);

export default app