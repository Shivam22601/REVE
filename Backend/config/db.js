const mongoose = require('mongoose');

const connectDb = async () => {
  const uri = (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ReveCult').trim();

  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  try {
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Mongo connection error', err);
    process.exit(1);
  }
};

module.exports = connectDb;


