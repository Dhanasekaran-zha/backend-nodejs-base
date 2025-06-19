import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY.toString(),
    subject: 'accessApi',
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY.toString(),
    subject: 'refreshToken',
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET);
};
