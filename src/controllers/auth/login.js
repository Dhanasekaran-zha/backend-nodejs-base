import User from '../../models/user.js';
import responseHandler from '../../utils/responseHandlers.js';
import { generateAccessToken, generateRefreshToken } from '../../lib/jwt.js';
import Token from '../../models/token.js';
import config from '../../config/index.js';
import { logger } from '../../lib/winston.js';

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email })
      .select('username email password role')
      .exec();

    if (!user || !(await user.comparePassword(password))) {
      return responseHandler.notFound(
        res,
        { code: 'AuthError' },
        'User not found or Invalid Credentials'
      );
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await Token.findOneAndUpdate(
      { userId: user._id },
      { token: refreshToken },
      { upsert: true, new: true }
    );

    logger.info('Refresh token created for user', {
      userId: user._id,
      token: refreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    responseHandler.ok(
      res,
      {
        user: {
          username: user.username,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
      'User logged in successfully'
    );
  } catch (err) {
    logger.error('Error during user login', err);
    responseHandler.internalError(res, err);
  }
};

export default login;
