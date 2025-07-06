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
        dbName: 'certificateDB',
        serverSelectionTimeoutMS: 5000,
      };

      global.mongoose.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
        // 🧼 Handle graceful shutdown
        process.on('SIGINT', async () => {
          await mongooseInstance.connection.close();
          console.log('🛑 MongoDB connection closed on SIGINT');
          process.exit(0);
        });

        process.on('SIGTERM', async () => {
          await mongooseInstance.connection.close();
          console.log('🛑 MongoDB connection closed on SIGTERM');
          process.exit(0);
        });

        return mongooseInstance;
      });
    }

    global.mongoose.conn = await global.mongoose.promise;
    console.log('✅ MongoDB Connected to certificateDB');
    return global.mongoose.conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    throw new Error('Database connection failed');
  }
};
