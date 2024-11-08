import { Router } from 'express';
import {
  issueTDRHandler,
  getTDRDetailsHandler,
  transferTDRHandler,
  verifyTDRHandler,
  getAllUserTDRsHandler,
  getAllTDRsHandler,
  getTDRHistoryHandler,
  updateTDRHandler,
  destroyTDRHandler,
} from '../controllers/assetController';
import { jwtVerificationMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/issue-tdr', jwtVerificationMiddleware, issueTDRHandler);

router.post('/transfer-tdr', jwtVerificationMiddleware, transferTDRHandler);

router.post('/verify-tdr', jwtVerificationMiddleware, verifyTDRHandler);

router.get('/details-tdr/:id', jwtVerificationMiddleware, getTDRDetailsHandler);

router.get(
  '/user-tdrs/:owner',
  jwtVerificationMiddleware,
  getAllUserTDRsHandler
);

router.get('/all-tdrs', jwtVerificationMiddleware, getAllTDRsHandler);

router.get('/tdr-history/:id', jwtVerificationMiddleware, getTDRHistoryHandler);

router.post('/destroy-tdr', jwtVerificationMiddleware, destroyTDRHandler);

router.post('/update-tdr', jwtVerificationMiddleware, updateTDRHandler);

export default router;
