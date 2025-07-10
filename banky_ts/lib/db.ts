import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!
console.log(MONGODB_URI)

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

// ✅ Define type for the global cache
type MongooseGlobal = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// ✅ Attach to globalThis
const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose: MongooseGlobal
}

// ✅ Reuse existing connection if available
if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null }
}

const cached = globalWithMongoose.mongoose

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
