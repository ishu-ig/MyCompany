import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const submitBootcampApplication = createAsyncThunk(
  'application/submitBootcampApplication',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:5001/api/applications/bootcamp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return data.data || formData;
      } else {
        // Fallback for offline demo
        return formData;
      }
    } catch (err) {
      console.warn('Backend server offline, using local application state', err);
      return formData;
    }
  }
);

const applicationSlice = createSlice({
  name: 'application',
  initialState: {
    formData: {
      fullName: '',
      email: '',
      phone: '',
      highestEducation: 'Graduate (Any Stream)',
      targetTrack: 'Business Development Executive',
      resumeLink: '',
    },
    loading: false,
    submitted: false,
    error: null,
    lastSubmittedData: null,
  },
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    resetApplicationForm: (state) => {
      state.formData = {
        fullName: '',
        email: '',
        phone: '',
        highestEducation: 'Graduate (Any Stream)',
        targetTrack: 'Business Development Executive',
        resumeLink: '',
      };
      state.submitted = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBootcampApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitBootcampApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.submitted = true;
        state.lastSubmittedData = action.payload;
        state.error = null;
      })
      .addCase(submitBootcampApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to submit application';
      });
  },
});

export const { updateFormField, resetApplicationForm } = applicationSlice.actions;
export default applicationSlice.reducer;
