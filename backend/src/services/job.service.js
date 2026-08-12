import { Job } from '../models/Job.js';

export const createJob = async (jobData) => {
  return await Job.create(jobData);
};

export const getJobs = async (filters = {}) => {
  const { status, limit = 10, skip = 0 } = filters;
  
  const query = {};
  if (status) query.status = status;

  return await Job.find(query)
    .select('title department location employmentType status openings createdAt')
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit));
};

export const getJobById = async (jobId) => {
  return await Job.findById(jobId).populate('createdBy', 'name email');
};

export const updateJob = async (jobId, updateData) => {
  return await Job.findByIdAndUpdate(jobId, updateData, {
    new: true,
    runValidators: true,
  });
};

export const closeJob = async (jobId) => {
  return await Job.findByIdAndUpdate(
    jobId,
    { status: 'closed', closedAt: Date.now() },
    { new: true }
  );
};
