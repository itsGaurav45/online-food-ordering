import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    const maskedUri = process.env.MONGODB_URI?.replace(/:([^@]+)@/, ':****@');
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error(`URI Used: ${maskedUri}`);
    return false;
  }
};

export default connectDB;
