import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.string().min(1, 'At least one requirement is required'), 
  openings: z.number().min(1, 'Must have at least 1 opening').or(z.string().transform(Number)),
  status: z.enum(['open', 'closed', 'archived']).default('open'),
});
