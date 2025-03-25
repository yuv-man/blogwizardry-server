import mongoose from 'mongoose';
import logger from './utils/logger.js';

export const model = mongoose.model;
export const ObjectId = mongoose.Schema.Types.ObjectId;

// open db connection
export const openDbConnection = async () => {
  try {
    const uri = process.env.NODE_ENV === 'production' ? process.env.MONGO_URL_PROD : process.env.MONGO_URL_LOCAL;
    
    if (!uri) {
      logger.error('MONGO_URL environment variable is not defined');
      throw new Error('MONGO_URL environment variable is not defined');
    }
    
    logger.info(`Attempting to connect to MongoDB with URI: ${uri}`);
    
    return await mongoose.connect(uri, {
      dbName: "wizardry-blog",
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error.message);
    throw error;
  }
};