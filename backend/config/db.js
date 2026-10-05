import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI)
    console.log('MongoDB connected successfully')
  } catch (error) {
    // Log the error type only so a malformed URI or credentials cannot leak.
    console.error(`MongoDB connection failed (${error.name || 'unknown error'}).`)
    throw new Error('MongoDB connection failed. Check MONGODB_URI and database access.')
  }
}
