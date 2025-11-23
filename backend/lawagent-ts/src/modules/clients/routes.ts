import { Router } from 'express';
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} from './controller';
import { verifyToken, requireAdvocate } from '@/middleware/auth';

const router = Router();

// Apply verifyToken to all client routes
router.use(verifyToken);

// Routes for Clients
router.post('/', requireAdvocate, createClient);
router.get('/', requireAdvocate, getClients);
router.get('/:id', requireAdvocate, getClientById);
router.put('/:id', requireAdvocate, updateClient);
router.delete('/:id', requireAdvocate, deleteClient);

export default router;
