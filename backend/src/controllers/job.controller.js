import * as jobService from '../services/job.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createJob = asyncHandler(async (req, res, next) => {
  // req.user comes from protect middleware
  const jobData = { ...req.body, createdBy: req.user.id };
  const job = await jobService.createJob(jobData);
  sendSuccess(res, job, 'Job created successfully', 201);
});

export const getJobs = asyncHandler(async (req, res, next) => {
  const jobs = await jobService.getJobs(req.query);
  sendSuccess(res, jobs, 'Jobs fetched successfully');
});

export const getJobById = asyncHandler(async (req, res, next) => {
  const job = await jobService.getJobById(req.params.id);
  if (!job) {
    const error = new Error('Job not found');
    error.statusCode = 404;
    throw error;
  }
  sendSuccess(res, job, 'Job fetched successfully');
});

export const updateJob = asyncHandler(async (req, res, next) => {
  const job = await jobService.updateJob(req.params.id, req.body);
  if (!job) {
    const error = new Error('Job not found');
    error.statusCode = 404;
    throw error;
  }
  sendSuccess(res, job, 'Job updated successfully');
});

export const closeJob = asyncHandler(async (req, res, next) => {
  const job = await jobService.closeJob(req.params.id);
  if (!job) {
    const error = new Error('Job not found');
    error.statusCode = 404;
    throw error;
  }
  sendSuccess(res, job, 'Job closed successfully');
});
