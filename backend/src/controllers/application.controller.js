import * as applicationService from '../services/application.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getApplications = asyncHandler(async (req, res, next) => {
  const applications = await applicationService.getApplications(req.query);
  sendSuccess(res, applications, 'Applications fetched successfully');
});

export const createApplication = asyncHandler(async (req, res, next) => {
  const { candidateId, jobId } = req.body;
  const application = await applicationService.createApplication(candidateId, jobId);
  sendSuccess(res, application, 'Application created successfully', 201);
});

export const addNote = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  // req.user.id is populated by the protect middleware
  const authorId = req.user.id; 
  
  const application = await applicationService.addNote(req.params.id, authorId, text);
  sendSuccess(res, application, 'Note added successfully');
});

export const updateStage = asyncHandler(async (req, res, next) => {
  const { stage } = req.body;
  const changedByUserId = req.user.id;
  
  const application = await applicationService.updateStage(req.params.id, stage, changedByUserId);
  sendSuccess(res, application, 'Application stage updated successfully');
});
