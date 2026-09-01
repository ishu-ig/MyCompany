import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  services: [
    {
      id: 'corporate-staffing',
      title: 'Corporate Tie-ups & Custom Staffing',
      badge: 'For Employers',
      category: 'employers',
      iconName: 'Building2',
      color: 'indigo',
      description: 'We build and train custom talent pipelines designed exclusively around your team’s operating methodology, tech tools, and job roles.',
      features: [
        'Pre-screened candidate pools evaluated on aptitude and communication',
        'Role-specific training tracks: Business Executive, BDE, HR Recruiter, Sales',
        'Zero onboarding ramp-up delay — productive on day one',
        'Replacement guarantees and dedicated account management',
      ],
      ctaText: 'Partner as Employer',
      ctaLink: '/contact',
    },
    {
      id: 'campus-collaboration',
      title: 'Campus Collaboration & Employability Drives',
      badge: 'For Colleges & Universities',
      category: 'colleges',
      iconName: 'School',
      color: 'amber',
      description: 'Partnering with universities to deliver high-impact placement readiness bootcamps and pooled recruitment drives.',
      features: [
        'Practical resume review clinics and mock corporate interview panels',
        'Industry-standard MS Excel, CRM, and communication bootcamps',
        'Pooled on-campus and virtual placement drives with leading enterprises',
        'Real-time student progress and placement analytics for colleges',
      ],
      ctaText: 'Book Campus Drive',
      ctaLink: '/contact',
    },
    {
      id: 'career-bootcamps',
      title: 'Skill Upgradation & Career Bootcamps',
      badge: 'For Freshers & Job Seekers',
      category: 'candidates',
      iconName: 'GraduationCap',
      color: 'emerald',
      description: 'Intensive 4-8 week career transformation programs covering non-IT corporate tracks with verified credentials and direct placement.',
      features: [
        'Hands-on live capstone projects and corporate business case studies',
        '1-on-1 mentorship with active senior corporate managers',
        'Verifiable digital certificates with public credential lookup',
        'Guaranteed interview opportunities with hiring partners',
      ],
      ctaText: 'Apply for Bootcamp',
      ctaLink: '/apply',
    },
  ],
  selectedCategory: 'all',
};

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setSelectedCategory } = serviceSlice.actions;
export default serviceSlice.reducer;
