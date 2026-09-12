import mongoose from 'mongoose';

import { DB_NAME } from '../constants.js';

 const uri=process.env.MONGODB_URI


const connectDB = async () => {
     if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  let options= {
      maxPoolSize: 50,           // Max active concurrent sockets allowed
      minPoolSize: 10,           // Keep at least 10 sockets open at all times
      socketTimeoutMS: 45000,    // Close unheating sockets after 45s
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if DB is down
    }
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`,options)
        console.log(`\n MongoDB connected!!! DB HOST ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("mongoDB connection error",error);
        process.exit(1);
    }

   

}

export default connectDB