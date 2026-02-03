const mongoose = require('mongoose');

const connectDb = async () => {
  const uri = (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ReveCult').trim();

  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  try {
    await mongoose.connect(uri, {
      maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '50', 10),
      minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '5', 10),
      serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT || '10000', 10),
      connectTimeoutMS: parseInt(process.env.MONGODB_CONNECT_TIMEOUT || '10000', 10),
      socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT || '45000', 10)
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Mongo connection error', err);
    process.exit(1);
  }
};

module.exports = connectDb;


