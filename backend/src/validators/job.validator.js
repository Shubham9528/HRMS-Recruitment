import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship'], {
    errorMap: () => ({ message: 'Invalid employment type' }),
  }),
  description: z.string().min(1, 'Description is required'),
  requirements: z.array(z.string()).optional(),
  openings: z.number().int().min(1, 'Must have at least 1 opening'),
});

// partial() makes all fields optional for the update schema
export const updateJobSchema = createJobSchema.partial();
