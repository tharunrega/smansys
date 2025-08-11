import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer | null = null;

export const startInMemoryMongoDB = async (): Promise<string> => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log(`MongoDB Memory Server started at ${uri}`);
  return uri;
};

export const stopInMemoryMongoDB = async (): Promise<void> => {
  if (mongod) {
    await mongoose.disconnect();
    await mongod.stop();
    console.log('MongoDB Memory Server stopped');
  }
};

if (require.main === module) {
  // Run this script directly to start the in-memory MongoDB server
  (async () => {
    try {
      const uri = await startInMemoryMongoDB();
      console.log(`MongoDB Memory Server URI: ${uri}`);
      console.log('Keep this terminal window open to keep the database running.');
      console.log('Press Ctrl+C to stop the database server.');
    } catch (error) {
      console.error('Failed to start MongoDB Memory Server:', error);
    }
  })();
}
