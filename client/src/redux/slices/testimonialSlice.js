import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTestimonials = createAsyncThunk(
  'testimonials/fetchTestimonials',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:5001/api/testimonials');
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        return data.data;
      }
      return [];
    } catch (err) {
      console.warn('Backend server offline, using local testimonials', err);
      return [];
    }
  }
);

const testimonialSlice = createSlice({
  name: 'testimonials',
  initialState: {
    items: [
      {
        id: 't-1',
        quote: "TalentNestro eliminated our 6-week onboarding ramp-up. The BDEs we hired closed enterprise deals in their very first month.",
        author: "Rohan Verma",
        role: "VP of Sales, CloudScale Technologies",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        rating: 5,
        tag: "Employer Partner"
      },
      {
        id: 't-2',
        quote: "Coming from a non-IT graduate background, the hands-on simulated client calls and mentor feedback gave me the confidence to secure an HR role within 10 days of graduation.",
        author: "Priya Sharma",
        role: "Talent Acquisition Associate (Placed at TechCorp)",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
        rating: 5,
        tag: "Bootcamp Graduate"
      },
      {
        id: 't-3',
        quote: "Our campus placement numbers jumped significantly after TalentNestro conducted their 4-week corporate readiness drive for our final year students.",
        author: "Dr. Arvind Menon",
        role: "Head of Training & Placements, Apex Institute",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        rating: 5,
        tag: "Academic Partner"
      },
      {
        id: 't-4',
        quote: "The practical business simulations and CRM workflows mirrored real workplace operations. I transitioned seamlessly into my Corporate Sales role.",
        author: "Aman Gupta",
        role: "Corporate Sales Specialist, Nexus Group",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
        rating: 5,
        tag: "Bootcamp Graduate"
      },
      {
        id: 't-5',
        quote: "We hired an entire 8-member recruitment operations cohort from TalentNestro. Zero bad hires and exceptional professional etiquette from day one.",
        author: "Meera Sen",
        role: "Director of People Ops, GrowthMatrix",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
        rating: 5,
        tag: "Employer Partner"
      },
    ],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload;
        }
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default testimonialSlice.reducer;
