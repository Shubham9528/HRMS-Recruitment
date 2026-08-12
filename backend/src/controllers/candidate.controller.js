import * as candidateService from '../services/candidate.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createCandidate = asyncHandler(async (req, res, next) => {
  const candidate = await candidateService.createCandidate(req.body);
  sendSuccess(res, candidate, 'Candidate created successfully', 201);
});

export const getCandidates = asyncHandler(async (req, res, next) => {
  const candidates = await candidateService.getCandidates(req.query);
  sendSuccess(res, candidates, 'Candidates fetched successfully');
});

export const getCandidateById = asyncHandler(async (req, res, next) => {
  const candidate = await candidateService.getCandidateById(req.params.id);
  if (!candidate) {
    const error = new Error('Candidate not found');
    error.statusCode = 404;
    throw error;
  }
  sendSuccess(res, candidate, 'Candidate fetched successfully');
});
