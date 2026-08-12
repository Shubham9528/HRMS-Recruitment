import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobsApi } from '../../api/jobs.api';

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (filters, { rejectWithValue }) => {
    try {
      return await jobsApi.getJobs(filters);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (payload, { rejectWithValue }) => {
    try {
      return await jobsApi.createJob(payload);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create job');
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await jobsApi.updateJob(id, payload);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update job');
    }
  }
);

export const closeJob = createAsyncThunk(
  'jobs/closeJob',
  async (id, { rejectWithValue }) => {
    try {
      return await jobsApi.closeJob(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to close job');
    }
  }
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filters: {
    search: '',
    status: 'open',
  },
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchJobs
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Replace items
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // createJob - Immutably push via Immer
      .addCase(createJob.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      
      // updateJob
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.items.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      
      // closeJob
      .addCase(closeJob.fulfilled, (state, action) => {
        const index = state.items.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { setFilters } = jobsSlice.actions;
export default jobsSlice.reducer;
