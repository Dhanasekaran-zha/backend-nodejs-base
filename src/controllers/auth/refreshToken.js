import jwt from 'jsonwebtoken';
import Token from '../../models/token.js';
import responseHandler from '../../utils/responseHandlers.js';
import { generateAccessToken, verifyRefreshToken } from '../../lib/jwt.js';
import { logger } from '../../lib/winston.js';

export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  try {
    const tokenExists = await Token.exists({ token: token });
    if (!tokenExists) {
      return responseHandler.unauthorized(
        res,
        { code: 'AuthenticationError' },
        'Invalid refresh token'
      );
    }

    const jwtPayload = verifyRefreshToken(token);
    const newAccessToken = generateAccessToken(jwtPayload.userId);

    responseHandler.ok(res, { newAccessToken });
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return responseHandler.unauthorized(
        res,
        { code: 'AuthenticationError' },
        'Refresh token expired, Please login again'
      );
    }

    if (e instanceof jwt.JsonWebTokenError) {
      return responseHandler.unauthorized(
        res,
        { code: 'AuthenticationError' },
        'Access token invalid'
      );
    }

    logger.error('Error during refresh token', e);
    responseHandler.internalError(res, e);
  }
};
