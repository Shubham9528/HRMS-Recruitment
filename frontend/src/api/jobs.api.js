import axiosInstance from './axiosInstance';

export const jobsApi = {
  getJobs: async (params) => {
    const res = await axiosInstance.get('/jobs', { params });
    // Unwrap the response envelope here so components never touch it
    return res.data.data;
  },
  
  getJob: async (id) => {
    const res = await axiosInstance.get(`/jobs/${id}`);
    return res.data.data;
  },
  
  createJob: async (payload) => {
    const res = await axiosInstance.post('/jobs', payload);
    return res.data.data;
  },
  
  updateJob: async (id, payload) => {
    const res = await axiosInstance.put(`/jobs/${id}`, payload);
    return res.data.data;
  },
  
  closeJob: async (id) => {
    const res = await axiosInstance.patch(`/jobs/${id}/close`);
    return res.data.data;
  }
};
