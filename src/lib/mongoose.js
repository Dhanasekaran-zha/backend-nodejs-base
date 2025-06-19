import mongoose from 'mongoose';
import config from '../config/index.js';
import { logger } from './winston.js';

const clientOptions = {
  dbName: 'backend-base',
  appName: 'Backend Base',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDatabase = async () => {
  if (!config.MONGO_URI) {
    throw new Error('MongoDB URI is not defined in the configuration');
  }
  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
    logger.info('Connected to the database successfully', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
    logger.error('Error connecting to the database', e);
  }
};

export const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from the database successfully', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
    logger.error('Error disconnecting from the database', e);
  }
};
