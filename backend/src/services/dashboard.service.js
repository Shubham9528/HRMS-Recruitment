import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';

export const getDashboardSummary = async () => {
  // 1. Job statistics
  const totalJobs = await Job.countDocuments();
  const openJobs = await Job.countDocuments({ status: 'open' });
  const closedJobs = await Job.countDocuments({ status: 'closed' });
  
  // 2. Application pipeline statistics
  const pipelineAggregation = await Application.aggregate([
    {
      $group: {
        _id: '$currentStage',
        count: { $sum: 1 }
      }
    }
  ]);
  
  // Convert aggregation array to a dictionary { applied: 5, screening: 2, ... }
  const pipelineCounts = pipelineAggregation.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  // 3. Recent activity (latest 10 applications)
  const recentActivity = await Application.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('candidateId', 'name email')
    .populate('jobId', 'title department');
    
  return {
    jobStats: {
      total: totalJobs,
      open: openJobs,
      closed: closedJobs
    },
    pipelineCounts,
    recentActivity
  };
};
