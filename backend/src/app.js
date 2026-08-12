import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import jobRoutes from './routes/job.routes.js';
import candidateRoutes from './routes/candidate.routes.js';
import applicationRoutes from './routes/application.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { apiLimiter } from './middleware/rateLimiter.middleware.js';

const app = express();

// Security Headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.CLIENT_URL,
  })
);

// Body Parser
app.use(express.json({ limit: '10kb' }));

// Rate Limiter on /api
app.use('/api', apiLimiter);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Middleware (must be registered last)
app.use(errorHandler);

export default app;
