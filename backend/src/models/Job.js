import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'archived'],
      default: 'open',
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
      },
    ],
    openings: {
      type: Number,
      min: 1,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model('Job', jobSchema);
