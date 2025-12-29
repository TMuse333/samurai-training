import { MongoClient, Db } from 'mongodb';

const dbName = process.env.MONGODB_DB_NAME || 'website-builder';

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not configured. Please set it in your environment variables or .env.local file.'
    );
  }

  // Return existing promise if already created
  if (clientPromise) {
    return clientPromise;
  }

  // Create new connection
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!(global as any)._mongoClientPromise) {
      client = new MongoClient(uri);
      (global as any)._mongoClientPromise = client.connect();
    }
    clientPromise = (global as any)._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  return clientPromise!;
}

// Lazy default export - only connects when actually accessed (via .then, .catch, etc.)
// Wrapped in a Proxy-like approach: the promise is only created when methods are called
export default new Proxy({} as Promise<MongoClient>, {
  get(_target, prop) {
    const promise = getClientPromise();
    const value = (promise as any)[prop];
    return typeof value === 'function' ? value.bind(promise) : value;
  }
});

// Helper function to get database instance
export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}

