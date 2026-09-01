import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const submitInquiry = createAsyncThunk(
  'contact/submitInquiry',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:5001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return data.data || formData;
      } else {
        return formData;
      }
    } catch (err) {
      console.warn('Backend server offline, using local inquiry state', err);
      return formData;
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    formData: {
      name: '',
      email: '',
      phone: '',
      organization: '',
      roleType: 'Corporate Partner',
      message: '',
    },
    loading: false,
    submitted: false,
    error: null,
  },
  reducers: {
    updateContactField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    resetContactForm: (state) => {
      state.formData = {
        name: '',
        email: '',
        phone: '',
        organization: '',
        roleType: 'Corporate Partner',
        message: '',
      };
      state.submitted = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitInquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitInquiry.fulfilled, (state) => {
        state.loading = false;
        state.submitted = true;
        state.error = null;
      })
      .addCase(submitInquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to submit inquiry';
      });
  },
});

export const { updateContactField, resetContactForm } = contactSlice.actions;
export default contactSlice.reducer;
