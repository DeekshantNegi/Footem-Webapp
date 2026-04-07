import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import userRouter from './Routes/user.routes.js';
import adminRouter from './Routes/admin.routes.js';
import turfRouter from './Routes/turfs.routes.js';
import ownerRouter from './Routes/owner.routes.js';
import bookingRouter from './Routes/bookings.routes.js';


const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use('/api/v1/users', userRouter );
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/turfs', turfRouter);
app.use('/api/v1/owners', ownerRouter);
app.use('/api/v1/bookings', bookingRouter);

app.use((err, req, res, next)=>{
    res.status(err.status || 500).json({
        success: false,
        message: err.message,
        errors: err.errors || [],
    });
});

export default app