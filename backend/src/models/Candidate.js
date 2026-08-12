import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    resumeUrl: {
      type: String,
    },
    source: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

candidateSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'candidateId'
});

export const Candidate = mongoose.model('Candidate', candidateSchema);
