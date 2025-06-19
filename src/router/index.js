import { Router } from 'express';
import responseHandler from '../utils/responseHandlers.js';
import authRoutes from './auth.js';

const router = Router();

router.get('/', (req, res) => {
  responseHandler.ok(
    res,
    {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    },
    'API is live'
  );
});

router.use('/auth', authRoutes);

export default router;
