import express from 'express';
import { getSummary } from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);

export default router;
