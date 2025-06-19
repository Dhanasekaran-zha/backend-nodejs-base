import Token from '../../models/token.js';
import { logger } from '../../lib/winston.js';
import config from '../../config/index.js';
import responseHandler from '../../utils/responseHandlers.js';

const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    if (refreshToken) {
      await Token.deleteOne({ token: refreshToken });

      logger.info('User refresh token deleted successfully', {
        userId: req.userId,
        token: refreshToken,
      });

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }

    logger.info('User logged out successfully');
    responseHandler.ok(res, {}, 'User logged out successfully');
  } catch (e) {
    logger.error('Error during user logout', e);
    responseHandler.internalError(res, e);
  }
};

export default logout;
