import mongoose, { ConnectOptions } from 'mongoose';

type MongooseGlobal = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongoose: MongooseGlobal;
}

const MONGODB_URI = process.env.MONGODB_URI as string;

export const connectToDB = async () => {
  if (global.mongoose?.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
  }

  try {
    if (!global.mongoose.promise) {
      const opts: ConnectOptions = {
        dbName: 'loginuser',
        serverSelectionTimeoutMS: 5000,
      };

      global.mongoose.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        return mongoose;
      });
    }

    global.mongoose.conn = await global.mongoose.promise;
    console.log('✅ MongoDB Connected');
    return global.mongoose.conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    throw new Error('Database connection failed');
  }
};