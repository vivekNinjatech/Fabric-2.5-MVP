import express from 'express';
import {
  registerUser,
  loginUser,
  listUsers,
} from '../controllers/authController';
import { jwtVerificationMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/users/login', loginUser);
router.get('/all-users', listUsers);

router.use(jwtVerificationMiddleware);

export default router;
