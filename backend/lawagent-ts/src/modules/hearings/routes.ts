import { Router } from 'express';
import {
  getHearingsByCaseId,
  createHearing,
} from './controller';
import { verifyToken, requireAdvocate } from '@/middleware/auth';

const router = Router();

// Apply verifyToken to all hearing routes
router.use(verifyToken);

// Routes for Hearings
router.get('/:caseId/hearings', getHearingsByCaseId); // RLS will handle access
router.post('/:caseId/hearings', requireAdvocate, createHearing);

export default router;
