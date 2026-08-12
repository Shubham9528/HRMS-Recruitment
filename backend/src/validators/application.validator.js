import { z } from 'zod';

export const createApplicationSchema = z.object({
  candidateId: z.string().min(1, 'Candidate ID is required'),
  jobId: z.string().min(1, 'Job ID is required'),
});

export const stageUpdateSchema = z.object({
  stage: z.enum(['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'], {
    errorMap: () => ({ message: 'Invalid stage' }),
  }),
});

export const addNoteSchema = z.object({
  text: z.string().min(1, 'Note text is required'),
});
