import { Application } from '../models/Application.js';

const STAGE_ORDER = ['applied', 'screening', 'interview', 'offer', 'hired'];

export const getApplications = async (filters = {}) => {
  const query = {};
  if (filters.jobId) query.jobId = filters.jobId;
  if (filters.candidateId) query.candidateId = filters.candidateId;

  return await Application.find(query)
    .populate('candidateId', 'name email phone')
    .populate('jobId', 'title department')
    .sort({ createdAt: -1 });
};

export const createApplication = async (candidateId, jobId) => {
  try {
    const application = await Application.create({
      candidateId,
      jobId,
      stageHistory: [{ stage: 'applied' }]
    });
    return application;
  } catch (error) {
    // Mongo duplicate key error (our compound unique index caught it)
    if (error.code === 11000) {
      const customError = new Error('This candidate has already applied for this job');
      customError.statusCode = 409;
      throw customError;
    }
    throw error;
  }
};

export const addNote = async (applicationId, authorId, text) => {
  const application = await Application.findById(applicationId);
  if (!application) {
    const error = new Error('Application not found');
    error.statusCode = 404;
    throw error;
  }

  application.notes.push({
    author: authorId,
    text,
    createdAt: Date.now()
  });

  return await application.save();
};

export const updateStage = async (applicationId, newStage, changedByUserId) => {
  const application = await Application.findById(applicationId);
  if (!application) {
    const error = new Error('Application not found');
    error.statusCode = 404;
    throw error;
  }

  const currentStage = application.currentStage || 'applied';

  // Handle 'rejected' as a special terminal state
  if (newStage === 'rejected') {
    if (currentStage === 'rejected' || currentStage === 'hired') {
      const err = new Error(`Cannot move application from ${currentStage} to rejected`);
      err.statusCode = 400;
      throw err;
    }
  } else {
    const currentIndex = STAGE_ORDER.indexOf(currentStage);
    const newIndex = STAGE_ORDER.indexOf(newStage);

    // Prevent backwards or same-stage movement
    if (newIndex <= currentIndex) {
      const err = new Error(`Invalid stage transition from ${currentStage} to ${newStage}`);
      err.statusCode = 400;
      throw err;
    }

    // Prevent skipping stages (illegal jumps)
    if (newIndex !== currentIndex + 1) {
      const err = new Error(`Must proceed stages in order. Next stage after ${currentStage} is ${STAGE_ORDER[currentIndex + 1]}`);
      err.statusCode = 400;
      throw err;
    }
  }

  application.currentStage = newStage;
  application.stageHistory.push({
    stage: newStage,
    changedBy: changedByUserId,
    changedAt: Date.now()
  });

  return await application.save();
};
