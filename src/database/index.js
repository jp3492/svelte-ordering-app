import mongoose from 'mongoose';

if (process.env.NODE_ENV === "development") {
  require('dotenv').config();
}

export const connectDB = async () => {
  try {
    await mongoose.connect('process.env.MONGODB_URI', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("\x1b[32m", "MongoDb connected");
  } catch (error) {
    console.log({
      msg: "Connection to Mlab failed. Please read error below!",
      error
    });
  }
};