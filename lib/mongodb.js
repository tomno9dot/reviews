// lib/mongodb.js

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'MONGODB_URI missing in .env.local'
  );
}

if (
  !MONGODB_URI.startsWith('mongodb://') &&
  !MONGODB_URI.startsWith('mongodb+srv://')
) {
  throw new Error(
    'Invalid MONGODB_URI format. Must start with mongodb+srv://'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4,
      })
      .then((conn) => {
        console.log('✅ MongoDB connected');
        return conn;
      })
      .catch((err) => {
        cached.promise = null;
        console.error('❌ MongoDB failed:', err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export default connectDB;