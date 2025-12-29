import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

let cached: MongooseCache;

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

cached = global.mongoose as MongooseCache;

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      'MONGODB_URI is not configured. Please set it in your environment variables or .env.local file. ' +
      'MongoDB features will not be available until this is configured.'
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const connectionPromise: Promise<typeof mongoose> = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ MongoDB connected');
      return mongooseInstance;
    });
    
    cached.promise = connectionPromise;
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
