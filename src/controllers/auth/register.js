import config from '../../config/index.js';
import { logger } from '../../lib/winston.js';
import responseHandler from '../../utils/responseHandlers.js';
import User from '../../models/user.js';
import Token from '../../models/token.js';
import { genUsername } from '../../utils/stringUtils.js';
import { generateAccessToken, generateRefreshToken } from '../../lib/jwt.js';

const register = async (req, res) => {
  const { email, password, role } = req.body;

  if (role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
    logger.warn(`Unauthorized admin registration attempt by ${email}`);
    return responseHandler.forbidden(res, {}, 'You cannot register as admin');
  }

  try {
    const username = genUsername();
    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    const accessToken = generateAccessToken(newUser?._id);
    const refreshToken = generateRefreshToken(newUser?._id);

    await Token.create({ token: refreshToken, userId: newUser?._id });
    logger.info('Refresh token created for user', {
      userId: newUser?._id,
      token: refreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    logger.info('User registered successfully', {
      username: newUser?.username,
      email: newUser?.email,
      role: newUser?.role,
    });

    return responseHandler.created(
      res,
      {
        user: {
          username: newUser?.username,
          email: newUser?.email,
          role: newUser?.role,
        },
        accessToken,
      },
      'User registered successfully'
    );
  } catch (e) {
    logger.error('Error during user registration', e);
    if (e?.cause?.code === 11000) {
      const field = Object.keys(e.cause?.keyPattern || {})[0] || 'field';
      const value = e.cause?.keyValue?.[field] || 'value';
      logger.warn(`Duplicate key error on ${field}: ${value}`);
      return responseHandler.conflict(
        res,
        e,
        `${field} '${value}' already exists`
      );
    }
    return responseHandler.internalError(res, e, 'Failed to register user');
  }
};

export default register;
