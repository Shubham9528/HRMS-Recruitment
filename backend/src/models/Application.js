import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    currentStage: {
      type: String,
      enum: ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'],
      default: 'applied',
      index: true,
    },
    stageHistory: [
      {
        stage: {
          type: String,
          required: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    notes: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    rating: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

export const Application = mongoose.model('Application', applicationSchema);
