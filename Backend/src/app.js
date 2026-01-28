import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import userRouter from './Routes/user.route.js';

const app = express()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.get('/api/v1/users', userRouter );

export default app