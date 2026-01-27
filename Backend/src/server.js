import express from 'express';
import dotenv from 'dotenv';
import connectDB from './Db/index.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
connectDB().then(()=> {
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

}).catch((error)=>{
    console.log("Failed to connect to DB", error)
})