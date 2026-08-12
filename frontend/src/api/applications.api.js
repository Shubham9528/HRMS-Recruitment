import axiosInstance from './axiosInstance';

export const applicationsApi = {
  getApplications: async (params = {}) => {
    const res = await axiosInstance.get('/applications', { params });
    return res.data.data;
  },
  createApplication: async (payload) => {
    // payload: { candidateId, jobId }
    const res = await axiosInstance.post('/applications', payload);
    return res.data.data;
  },
  addNote: async (id, payload) => {
    // payload: { text }
    const res = await axiosInstance.post(`/applications/${id}/notes`, payload);
    return res.data.data;
  },
  updateStage: async (id, payload) => {
    // payload: { stage }
    const res = await axiosInstance.patch(`/applications/${id}/stage`, payload);
    return res.data.data;
  },
};
