import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  closeJob,
} from '../controllers/job.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createJobSchema,
  updateJobSchema,
} from '../validators/job.validator.js';

const router = express.Router();

// All job routes require authentication
router.use(protect);

router
  .route('/')
  .post(validate(createJobSchema), createJob)
  .get(getJobs);

router
  .route('/:id')
  .get(getJobById)
  .put(validate(updateJobSchema), updateJob);

router.patch('/:id/close', closeJob);

export default router;
