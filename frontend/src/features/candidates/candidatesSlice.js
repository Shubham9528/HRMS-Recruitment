import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { candidatesApi } from '../../api/candidates.api';

export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async (filters, { rejectWithValue }) => {
    try {
      return await candidatesApi.getCandidates(filters);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch candidates');
    }
  }
);

export const createCandidate = createAsyncThunk(
  'candidates/createCandidate',
  async (payload, { rejectWithValue }) => {
    try {
      return await candidatesApi.createCandidate(payload);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create candidate');
    }
  }
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filters: {
    search: '',
    stage: '', // Added for filtering candidates by application stage later
    jobId: '', // Added for filtering candidates by job
  },
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCandidates
      .addCase(fetchCandidates.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // createCandidate
      .addCase(createCandidate.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export const { setFilters } = candidatesSlice.actions;
export default candidatesSlice.reducer;
