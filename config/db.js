const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URL:', process.env.MONGO_URL ? 'Set' : 'Not set');
    
    await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected To Mongodb Database ${mongoose.connection.host}`.bgMagenta
        .white
    );
  } catch (error) {
    console.log(`Mongodb Database Error ${error}`.bgRed.white);
    console.error('Database connection failed. Server will continue but may not function properly.');
    // Don't throw error to allow server to start even if DB fails
  }
};

module.exports = connectDB;
