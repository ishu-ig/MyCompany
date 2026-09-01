import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:5001/api/courses');
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        return data.data;
      }
      return [];
    } catch (err) {
      console.warn('Backend server offline, using local courses', err);
      return [];
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [
      {
        id: 'track-bde',
        title: 'Business Development & B2B Sales',
        badge: 'High Demand',
        duration: '6 Weeks',
        skills: ['Lead Generation & Prospecting', 'HubSpot & Salesforce CRM', 'Negotiation & Objection Handling', 'B2B Discovery Calls'],
        targetRoles: 'BDE, SDR, Inside Sales Specialist, Account Executive',
      },
      {
        id: 'track-hr',
        title: 'HR Talent Acquisition & People Operations',
        badge: 'Popular',
        duration: '6 Weeks',
        skills: ['Talent Sourcing & Boolean Search', 'ATS & HRMS Workflows', 'Behavioral Interviewing', 'Offer Rollout & Compliance'],
        targetRoles: 'HR Executive, Technical Recruiter, Talent Acquisition Associate',
      },
      {
        id: 'track-ops',
        title: 'Corporate Client Relations & Operations',
        badge: 'Essential',
        duration: '4 Weeks',
        skills: ['Customer Success Strategy', 'Escalation & SLA Tracking', 'Executive Business Writing', 'Advanced MS Excel & Reporting'],
        targetRoles: 'Client Relations Associate, Operations Coordinator, Customer Success Exec',
      },
      {
        id: 'track-mkt',
        title: 'Digital Marketing & Growth Operations',
        badge: 'Emerging',
        duration: '6 Weeks',
        skills: ['Performance Lead Funnels', 'Email & WhatsApp Automation', 'Content & Pitch Deck Design', 'Google Analytics & ROI Tracking'],
        targetRoles: 'Growth Associate, Digital Marketing Executive, Campaign Specialist',
      },
    ],
    selectedTrack: 'Business Development Executive',
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedTrack: (state, action) => {
      state.selectedTrack = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          state.courses = action.payload;
        }
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedTrack } = courseSlice.actions;
export default courseSlice.reducer;
