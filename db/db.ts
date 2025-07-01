import { connect } from "mongoose";

declare global {
  var mongoose: any; // This must be a `var` and not a `let / const`
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function db(dbUri?: string, dbName?: string) {
  dbUri = dbUri || process.env.DB_URI!;
  dbName = dbName || process.env.DB_NAME

  if (!dbUri) {
    throw new Error(
      "Please define the DB_URI environment variable inside .env.local",
    );
  }

  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName
    };

    cached.promise = connect(dbUri, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default db;
