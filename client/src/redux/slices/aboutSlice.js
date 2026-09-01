import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  founder: {
    name: 'Shah Raza',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    quote: '"Traditional staffing hires on potential; TalentNestro deploys on proven readiness."',
    bio: 'Every year, thousands of talented graduates struggle to find the right corporate opportunities, while companies spend months dealing with ramp-up overhead. At TalentNestro, our Train-and-Hire model bridges this gap through practical business simulation bootcamps, structured mentorship, and guaranteed placement execution.',
  },
  mission: {
    title: 'Transforming Non-IT Talent Acquisition',
    description: 'Our mission is to create a predictable, skill-certified recruitment ecosystem that connects fresh graduates with corporate enterprises.',
  },
  pillars: [
    {
      id: 'precision',
      title: 'Precision Training',
      iconName: 'Target',
      color: 'indigo',
      description: 'Curriculums mapped directly to real enterprise daily workflows, tools, and communication drills.',
    },
    {
      id: 'zero-risk',
      title: 'Zero Hiring Risk',
      iconName: 'ShieldCheck',
      color: 'emerald',
      description: 'Corporations only hire candidates who pass comprehensive evaluations and practical capstone reviews.',
    },
    {
      id: 'impact',
      title: 'Lifelong Career Impact',
      iconName: 'Award',
      color: 'sky',
      description: 'Empowering fresh graduates with career resilience, professional poise, and verified credentials.',
    },
  ],
  metrics: [
    { label: 'Graduates Deployed', value: '500+' },
    { label: 'Corporate Partners', value: '100+' },
    { label: 'Placement Rate', value: '95%' },
    { label: 'Partner Colleges', value: '25+' },
  ],
};

const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {},
});

export default aboutSlice.reducer;
