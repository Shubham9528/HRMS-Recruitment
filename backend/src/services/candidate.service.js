import { Candidate } from '../models/Candidate.js';
import { Application } from '../models/Application.js';

export const createCandidate = async (candidateData) => {
  return await Candidate.create(candidateData);
};

export const getCandidates = async (filters = {}) => {
  const { search, jobId, stage, limit = 10, skip = 0 } = filters;
  
  const candidateQuery = {};
  if (search) {
    candidateQuery.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  // If filtering by jobId or stage, we must query the Application collection first
  // since the Candidate model doesn't hold denormalized job state.
  if (jobId || stage) {
    const appQuery = {};
    if (jobId) appQuery.jobId = jobId;
    if (stage) appQuery.currentStage = stage;
    
    const matchingApps = await Application.find(appQuery).select('candidateId');
    const candidateIdsFromApps = matchingApps.map(app => app.candidateId);
    
    candidateQuery._id = { $in: candidateIdsFromApps };
  }

  return await Candidate.find(candidateQuery)
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit));
};

export const getCandidateById = async (candidateId) => {
  return await Candidate.findById(candidateId).populate({
    path: 'applications',
    populate: [
      { path: 'jobId', select: 'title department' },
      { path: 'notes.author', select: 'name email' },
      { path: 'stageHistory.changedBy', select: 'name email' }
    ]
  });
};
