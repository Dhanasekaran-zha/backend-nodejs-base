import { logger } from '../lib/winston.js';
import { verifyAccessToken } from '../lib/jwt.js';
import jwt from 'jsonwebtoken';
import responseHandler from '../utils/responseHandlers.js';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return responseHandler.unauthorized(
      res,
      { code: 'AuthenticationError' },
      'Access denied, no token provided'
    );
  }

  const [_, token] = authHeader.split(' ');

  try {
    const jwtPayload = verifyAccessToken(token);
    req.userId = jwtPayload.userId;
    return next();
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return responseHandler.unauthorized(
        res,
        { code: 'AuthenticationError' },
        'Access token expired'
      );
    }

    if (e instanceof jwt.JsonWebTokenError) {
      return responseHandler.unauthorized(
        res,
        { code: 'AuthenticationError' },
        'Access token invalid'
      );
    }

    logger.error('Error during Token authentication', e);
    return responseHandler.internalError(
      res,
      { code: 'ServerError', error: e },
      'Internal Server Error'
    );
  }
};

export default authenticate;
