import mongoose from 'mongoose';
import { startInMemoryMongoDB } from './memory-db';

export const connectDB = async (): Promise<void> => {
  try {
    let mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smansys';
    
    // If we're in development mode and no MongoDB is available, use in-memory MongoDB
    if (process.env.NODE_ENV === 'development' && !process.env.MONGODB_URI) {
      try {
        // Try connecting to local MongoDB first
        await mongoose.connect('mongodb://localhost:27017/smansys', { serverSelectionTimeoutMS: 2000 });
        mongoURI = 'mongodb://localhost:27017/smansys';
        console.log('✅ Connected to local MongoDB instance');
      } catch (localError) {
        console.log('⚠️ Local MongoDB not available, using in-memory MongoDB');
        mongoURI = await startInMemoryMongoDB();
      }
    }
    
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔄 MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    console.error(error);
    process.exit(1);
  }
}; 