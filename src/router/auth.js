import { Router } from 'express';
import {
  authenticate,
  validate,
  validateCookies,
} from '../middleware/index.js';
import {
  loginSchema,
  refreshTokenCookieSchema,
  registerSchema,
} from '../schema/auth/index.js';
import {
  login,
  logout,
  refreshToken,
  register,
} from '../controllers/auth/index.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', authenticate, logout);
router.post(
  '/refresh-token',
  validateCookies(refreshTokenCookieSchema),
  refreshToken
);

export default router;
