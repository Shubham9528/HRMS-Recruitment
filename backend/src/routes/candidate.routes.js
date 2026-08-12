import express from 'express';
import {
  createCandidate,
  getCandidates,
  getCandidateById,
} from '../controllers/candidate.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createCandidateSchema } from '../validators/candidate.validator.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(validate(createCandidateSchema), createCandidate)
  .get(getCandidates);

router.route('/:id').get(getCandidateById);

export default router;
