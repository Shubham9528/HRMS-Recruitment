import express from 'express';
import {
  createApplication,
  addNote,
  updateStage,
} from '../controllers/application.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createApplicationSchema,
  addNoteSchema,
  stageUpdateSchema,
} from '../validators/application.validator.js';

const router = express.Router();

router.use(protect);

router.post('/', validate(createApplicationSchema), createApplication);
router.post('/:id/notes', validate(addNoteSchema), addNote);
router.patch('/:id/stage', validate(stageUpdateSchema), updateStage);

export default router;
