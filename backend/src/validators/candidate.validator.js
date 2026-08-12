import { z } from 'zod';

export const createCandidateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  resumeUrl: z.string().url('Invalid resume URL').optional(),
});
