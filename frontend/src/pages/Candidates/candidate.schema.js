import { z } from 'zod';

export const candidateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  jobId: z.string().min(1, 'Please select a job for this candidate'),
});
