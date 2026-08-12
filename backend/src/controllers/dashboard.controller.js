import * as dashboardService from '../services/dashboard.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getSummary = asyncHandler(async (req, res, next) => {
  const summary = await dashboardService.getDashboardSummary();
  sendSuccess(res, summary, 'Dashboard summary fetched successfully');
});
