import axiosInstance from './axiosInstance';

export const candidatesApi = {
  getCandidates: async (params = {}) => {
    const res = await axiosInstance.get('/candidates', { params });
    return res.data.data;
  },
  getCandidate: async (id) => {
    const res = await axiosInstance.get(`/candidates/${id}`);
    return res.data.data;
  },
  createCandidate: async (payload) => {
    const res = await axiosInstance.post('/candidates', payload);
    return res.data.data;
  },
};
