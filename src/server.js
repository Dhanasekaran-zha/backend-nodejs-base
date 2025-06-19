import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import config from './config/index.js';
import limiter from './lib/express_rate_limit.js';
import { connectToDatabase, disconnectFromDatabase } from './lib/mongoose.js';
import { logger } from './lib/winston.js';
import routes from './router/index.js';

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGIN.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS error : ${origin} is not allowed by CORS`),
        false
      );
      logger.warn(`CORS error : ${origin} is not allowed by CORS`);
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  compression({
    threshold: 1024,
  })
);
app.use(helmet());
app.use(limiter);

(async () => {
  try {
    await connectToDatabase();
    app.use('/api', routes);
    app.listen(config.PORT, () => {
      logger.info(`Server running in http://localhost:${config.PORT}`);
    });
  } catch (e) {
    logger.error('Failed to start the server', e);
    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.info('Server SHUTDOWN');
    process.exit(0);
  } catch (e) {
    logger.error('Error during server shutdown', e);
  }
};

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
