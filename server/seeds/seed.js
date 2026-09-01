const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const EmployerProfile = require('../models/EmployerProfile');
const CollegeProfile = require('../models/CollegeProfile');
const TrainerProfile = require('../models/TrainerProfile');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const SavedJob = require('../models/SavedJob');
const TrainingCourse = require('../models/TrainingCourse');
const CourseEnrollment = require('../models/CourseEnrollment');
const Attendance = require('../models/Attendance');
const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const Certificate = require('../models/Certificate');
const Interview = require('../models/Interview');
const Placement = require('../models/Placement');
const RecruitmentRequest = require('../models/RecruitmentRequest');
const Notification = require('../models/Notification');
const Blog = require('../models/Blog');
const Testimonial = require('../models/Testimonial');
const ContactEnquiry = require('../models/ContactEnquiry');

const seedData = async () => {
  try {
    const connStr = process.env.MONGO_URI || process.env.DB_KEY || 'mongodb://localhost:27017/PlacementPlatform';
    console.log('Connecting to database for seeding...');
    await mongoose.connect(connStr);
    console.log('Connected to MongoDB!');

    // Clear existing collections
    console.log('Clearing old collections...');
    await User.deleteMany({});
    await CandidateProfile.deleteMany({});
    await EmployerProfile.deleteMany({});
    await CollegeProfile.deleteMany({});
    await TrainerProfile.deleteMany({});
    await Job.deleteMany({});
    await JobApplication.deleteMany({});
    await SavedJob.deleteMany({});
    await TrainingCourse.deleteMany({});
    await CourseEnrollment.deleteMany({});
    await Attendance.deleteMany({});
    await Assessment.deleteMany({});
    await AssessmentResult.deleteMany({});
    await Certificate.deleteMany({});
    await Interview.deleteMany({});
    await Placement.deleteMany({});
    await RecruitmentRequest.deleteMany({});
    await Notification.deleteMany({});
    await Blog.deleteMany({});
    await Testimonial.deleteMany({});
    await ContactEnquiry.deleteMany({});

    console.log('Creating Seed Users...');
    // 1. Admin User
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@mycompany.com',
      phone: '+91 9876543210',
      password: 'admin123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
      isVerified: true,
    });

    // 2. Recruiter User
    const recruiterUser = await User.create({
      name: 'Pooja Sharma',
      email: 'recruiter@mycompany.com',
      phone: '+91 9811223344',
      password: 'recruiter123',
      role: 'recruiter',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      isVerified: true,
    });

    // 3. Trainer Users
    const trainer1 = await User.create({
      name: 'Vikram Malhotra',
      email: 'trainer.vikram@mycompany.com',
      phone: '+91 9822334455',
      password: 'trainer123',
      role: 'trainer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      isVerified: true,
    });

    const trainer2 = await User.create({
      name: 'Sneha Kapoor',
      email: 'trainer.sneha@mycompany.com',
      phone: '+91 9833445566',
      password: 'trainer123',
      role: 'trainer',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
      isVerified: true,
    });

    // 4. Employer Users
    const employer1 = await User.create({
      name: 'Arjun Singhania (Nexus Global)',
      email: 'hr@nexusglobal.com',
      phone: '+91 9844556677',
      password: 'employer123',
      role: 'employer',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
      isVerified: true,
    });

    const employer2 = await User.create({
      name: 'Ritu Menon (Apex Enterprises)',
      email: 'talent@apexenterprises.com',
      phone: '+91 9855667788',
      password: 'employer123',
      role: 'employer',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=250',
      isVerified: true,
    });

    // 5. College User
    const college1 = await User.create({
      name: 'Dr. S. K. Raman (Delhi Management Institute)',
      email: 'placement@delhicollege.edu',
      phone: '+91 9866778899',
      password: 'college123',
      role: 'college',
      avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=250',
      isVerified: true,
    });

    // 6. Candidate Users
    const candidate1 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul.sharma@gmail.com',
      phone: '+91 9877889900',
      password: 'candidate123',
      role: 'candidate',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      isVerified: true,
    });

    const candidate2 = await User.create({
      name: 'Priya Verma',
      email: 'priya.verma@gmail.com',
      phone: '+91 9888990011',
      password: 'candidate123',
      role: 'candidate',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
      isVerified: true,
    });

    const candidate3 = await User.create({
      name: 'Amit Patel',
      email: 'amit.patel@gmail.com',
      phone: '+91 9899001122',
      password: 'candidate123',
      role: 'candidate',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
      isVerified: true,
    });

    console.log('Creating Profiles...');
    // Candidate Profiles
    await CandidateProfile.create({
      user: candidate1._id,
      headline: 'Aspiring Business Development & Sales Executive',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      education: [
        {
          degree: 'Bachelor of Business Administration (BBA)',
          specialization: 'Marketing & Management',
          college: 'Delhi Institute of Professional Studies',
          passingYear: 2024,
          percentage: 78,
        },
      ],
      experience: [
        {
          company: 'Vertex Retail Ltd',
          designation: 'Sales Intern',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-06-30'),
          description: 'Handled lead generation, CRM entries, and outbound client communication.',
        },
      ],
      skills: ['Sales Strategy', 'Lead Generation', 'Client Pitching', 'MS Excel', 'Cold Calling', 'Negotiation'],
      preferredJobRoles: ['Business Development Executive', 'Sales Executive', 'Business Executive'],
      preferredLocations: ['Delhi', 'Noida', 'Gurugram'],
      experienceYears: 1,
      expectedSalary: 450000,
      currentSalary: 300000,
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      profileCompletion: 90,
      isAvailableForJob: true,
    });

    await CandidateProfile.create({
      user: candidate2._id,
      headline: 'Certified HR Recruiter & Talent Sourcing Specialist',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      education: [
        {
          degree: 'Bachelor of Commerce (B.Com)',
          specialization: 'Human Resources & Finance',
          college: 'Mumbai University College of Commerce',
          passingYear: 2023,
          percentage: 82,
        },
      ],
      skills: ['Resume Screening', 'Interview Coordination', 'HRMS', 'Employee Relations', 'Job Portals', 'Excel for HR'],
      preferredJobRoles: ['HR Executive', 'HR Recruiter', 'Talent Acquisition Executive'],
      preferredLocations: ['Mumbai', 'Pune'],
      experienceYears: 1.5,
      expectedSalary: 480000,
      currentSalary: 320000,
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      profileCompletion: 85,
      isAvailableForJob: true,
    });

    await CandidateProfile.create({
      user: candidate3._id,
      headline: 'Operations & Customer Relationship Associate',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      skills: ['Operations Management', 'Customer Support', 'CRM', 'Process Documentation', 'MS Office', 'Email Communication'],
      preferredJobRoles: ['Operations Executive', 'Customer Relationship Executive', 'Back Office Executive'],
      preferredLocations: ['Bangalore', 'Hyderabad'],
      experienceYears: 0.5,
      expectedSalary: 380000,
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      profileCompletion: 80,
      isAvailableForJob: true,
    });

    // Employer Profiles
    await EmployerProfile.create({
      user: employer1._id,
      companyName: 'Nexus Global Solutions',
      companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=250',
      website: 'https://nexusglobalsolutions.example.com',
      industry: 'Corporate Advisory & BPO',
      companySize: '500+ employees',
      description: 'Nexus Global is a premier multinational business service and corporate operations partner powering global enterprise scalability.',
      city: 'Delhi',
      state: 'Delhi',
      gstNumber: '07AAAAA0000A1Z5',
      contactPerson: 'Arjun Singhania',
      designation: 'Head of Talent Acquisition',
      isVerified: true,
    });

    await EmployerProfile.create({
      user: employer2._id,
      companyName: 'Apex Enterprises & Logistics',
      companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=250',
      website: 'https://apexenterprises.example.com',
      industry: 'Supply Chain, Retail & HR Consulting',
      companySize: '201-500 employees',
      description: 'Apex Enterprises leads non-IT business logistics, commercial retail operations, and HR staffing solutions across Pan-India.',
      city: 'Mumbai',
      state: 'Maharashtra',
      gstNumber: '27BBBBB1111B2Z6',
      contactPerson: 'Ritu Menon',
      designation: 'Director HR',
      isVerified: true,
    });

    // Trainer Profiles
    await TrainerProfile.create({
      user: trainer1._id,
      specialization: ['Business Development', 'Sales Pitch & Negotiations', 'Leadership & Operations'],
      experience: 8,
      qualification: 'MBA (Marketing) - IIM Alumnus',
      certifications: ['Certified Corporate Sales Trainer', 'Global Business Communication Coach'],
      bio: 'Over 8 years of training 5,000+ graduates into corporate sales, business executive, and commercial management positions.',
      rating: 4.9,
      isActive: true,
    });

    await TrainerProfile.create({
      user: trainer2._id,
      specialization: ['HR Executive & Recruitment', 'Talent Sourcing', 'Corporate Etiquette', 'HRMS & Payroll Basics'],
      experience: 6,
      qualification: 'MBA (HR) - XLRI Certified',
      certifications: ['SHRM-CP', 'Certified Interviewing Specialist'],
      bio: 'Specialist in mentoring non-IT candidates in recruitment life-cycles, onboarding compliance, and employee relation frameworks.',
      rating: 4.8,
      isActive: true,
    });

    // College Profile
    await CollegeProfile.create({
      user: college1._id,
      collegeName: 'Delhi Institute of Management & Technology',
      university: 'Delhi State University',
      collegeType: 'Management',
      website: 'https://delhicollege.example.edu',
      contactPerson: 'Dr. S. K. Raman',
      designation: 'Dean of Training & Placements',
      phone: '+91 9866778899',
      email: 'placement@delhicollege.edu',
      city: 'Delhi',
      state: 'Delhi',
      numberOfStudents: 1200,
      coursesOffered: ['BBA', 'B.Com', 'MBA', 'BA Economics', 'BMS'],
      placementCoordinator: 'Prof. Rajesh Khanna',
      partnershipStatus: 'active',
      isVerified: true,
    });

    console.log('Creating Non-IT Training Courses...');
    const course1 = await TrainingCourse.create({
      title: 'Business Executive Master Training Program',
      slug: 'business-executive-master-training-program',
      category: 'Business Executive',
      shortDescription: 'Master modern corporate communication, reporting, client coordination, and business operations to become an indispensable executive.',
      description: 'Our flagship Non-IT training program equips freshers and professionals with comprehensive corporate skills: business fundamentals, client management, spreadsheet proficiency, presentation acumen, and executive workflows.',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
      duration: '8 Weeks (Live Hybrid)',
      mode: 'Hybrid',
      skillLevel: 'All Levels',
      eligibility: 'Any Graduate / Final Year Student / Working Professional',
      trainer: trainer1._id,
      syllabus: [
        { moduleTitle: 'Module 1: Corporate Business Fundamentals', topics: ['Corporate Structure & Hierarchy', 'Business Communication Standards', 'Email Etiquette & Professional Writing'] },
        { moduleTitle: 'Module 2: Client Handling & Stakeholder Management', topics: ['Customer Lifecycle Management', 'Meeting Etiquette & Pitch Presentation', 'Conflict Resolution'] },
        { moduleTitle: 'Module 3: Business Operations & Reporting', topics: ['KPIs, Metrics, and SLA Tracking', 'Executive Dashboards', 'Workflow Documentation'] },
        { moduleTitle: 'Module 4: MS Office & Advanced Excel for Business', topics: ['VLOOKUP, Pivot Tables, Conditional Formatting', 'Business Presentations via PowerPoint', 'Data Summarization'] },
      ],
      careerOpportunities: ['Business Executive', 'Business Development Associate', 'Operations Executive', 'Client Relationship Executive'],
      practicalAssignments: ['Create a Live Business Performance Report in Excel', 'Conduct a Mock Client Pitch via Video Conference', 'Draft Standard Operating Procedure (SOP) Document'],
      certificateAvailable: true,
      placementAssistance: true,
      price: 14999,
      discountPrice: 8999,
      totalSeats: 50,
      availableSeats: 38,
      status: 'published',
    });

    const course2 = await TrainingCourse.create({
      title: 'Certified HR Executive & Recruiter Masterclass',
      slug: 'certified-hr-executive-recruiter-masterclass',
      category: 'HR Executive',
      shortDescription: 'Learn end-to-end recruitment lifecycle, resume screening, talent sourcing, interview scheduling, and payroll fundamentals.',
      description: 'Designed in close collaboration with top recruitment agencies and HR directors. Learn how to screen hundreds of candidates effectively, coordinate interviews, conduct background checks, and maintain HR documentation.',
      thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
      duration: '6 Weeks (Live Interactive)',
      mode: 'Online',
      skillLevel: 'Beginner',
      eligibility: 'Graduates interested in HR, Talent Acquisition & Corporate Operations',
      trainer: trainer2._id,
      syllabus: [
        { moduleTitle: 'Module 1: HR Fundamentals & Organization Architecture', topics: ['HR Roles & Responsibilities', 'Labor Laws & Statutory Compliance Basics', 'Employee Lifecycle'] },
        { moduleTitle: 'Module 2: End-to-End Talent Acquisition', topics: ['Job Description Preparation', 'Boolean Sourcing on LinkedIn & Job Portals', 'Resume Screening & Shortlisting'] },
        { moduleTitle: 'Module 3: Interview Coordination & Selection', topics: ['Structuring Interview Rounds', 'Candidate Evaluation Scorecards', 'Offer Letter Negotiation & Onboarding'] },
        { moduleTitle: 'Module 4: HRMS, Attendance & Payroll Basics', topics: ['Leave Policies & Attendance Tracking', 'Salary Structure & Payslip Generation', 'Excel for HR Analytics'] },
      ],
      careerOpportunities: ['HR Executive', 'HR Recruiter', 'Talent Acquisition Specialist', 'HR Coordinator', 'Recruitment Consultant'],
      practicalAssignments: ['Source 10 Profiles for a Given Job Description', 'Conduct a Mock HR Screening Round', 'Prepare an Offer Letter and Onboarding Kit'],
      certificateAvailable: true,
      placementAssistance: true,
      price: 12999,
      discountPrice: 7499,
      totalSeats: 40,
      availableSeats: 25,
      status: 'published',
    });

    const course3 = await TrainingCourse.create({
      title: 'Sales Executive & Lead Generation Accelerator',
      slug: 'sales-executive-lead-generation-accelerator',
      category: 'Sales & Marketing',
      shortDescription: 'Master consultative selling, outbound prospecting, cold calling mastery, objections handling, and CRM pipeline management.',
      description: 'Transform into a revenue generator! This intensive program gives you practical exposure to real customer interactions, objection handling matrices, lead qualification frameworks (BANT), and sales closing strategies.',
      thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800',
      duration: '6 Weeks',
      mode: 'Hybrid',
      skillLevel: 'All Levels',
      eligibility: 'Passionate communicators wanting high-earning sales careers',
      trainer: trainer1._id,
      syllabus: [
        { moduleTitle: 'Module 1: Modern Sales Fundamentals', topics: ['Inbound vs Outbound Sales', 'Ideal Customer Profile (ICP)', 'Buyer Psychology'] },
        { moduleTitle: 'Module 2: Lead Generation & Outreach', topics: ['Cold Calling Frameworks', 'Email Sequences & WhatsApp Business', 'Social Selling'] },
        { moduleTitle: 'Module 3: Discovery & Pitching', topics: ['Needs Analysis & Questioning Techniques', 'Product Demo & Value Proposition', 'Objection Handling Playbook'] },
        { moduleTitle: 'Module 4: Deal Closure & CRM Management', topics: ['Negotiation Tactics & Discount Guardrails', 'HubSpot & Zoho CRM Operations', 'Pipeline Reporting'] },
      ],
      careerOpportunities: ['Sales Executive', 'Business Development Associate', 'Relationship Manager', 'Inside Sales Specialist'],
      practicalAssignments: ['Cold Call Simulation with Industry Expert', 'CRM Pipeline Setup for 50 Leads', 'Pitch Presentation Video Review'],
      certificateAvailable: true,
      placementAssistance: true,
      price: 13999,
      discountPrice: 7999,
      totalSeats: 45,
      availableSeats: 30,
      status: 'published',
    });

    const course4 = await TrainingCourse.create({
      title: 'Business Development Executive (BDE) Intensive',
      slug: 'business-development-executive-bde-intensive',
      category: 'Business Development',
      shortDescription: 'Learn strategic partnerships, B2B prospecting, client acquisition, and high-value deal conversion techniques.',
      description: 'Designed specifically for candidates aiming for high-growth BDE roles across corporate agencies, edtech, SaaS, and retail conglomerates.',
      thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
      duration: '8 Weeks',
      mode: 'Online',
      skillLevel: 'Intermediate',
      trainer: trainer1._id,
      syllabus: [
        { moduleTitle: 'Module 1: B2B Prospecting Mastery', topics: ['Market Mapping', 'Key Decision Maker (KDM) Identification', 'Multi-channel Outreach'] },
        { moduleTitle: 'Module 2: Executive Client Meetings', topics: ['Virtual Presentation Skills', 'Commercial Proposal Drafting', 'Stakeholder Buy-in'] },
      ],
      careerOpportunities: ['BDE', 'Corporate Account Manager', 'Client Acquisition Executive'],
      price: 15999,
      discountPrice: 9499,
      status: 'published',
    });

    const course5 = await TrainingCourse.create({
      title: 'Customer Relationship & Client Management Professional',
      slug: 'customer-relationship-client-management-professional',
      category: 'Customer Relationship',
      shortDescription: 'Deliver exceptional customer success, manage key enterprise accounts, resolve escalations, and maximize retention.',
      description: 'Master relationship building, telephonic etiquette, complaint resolution frameworks, and CRM tracking systems.',
      thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800',
      duration: '4 Weeks',
      mode: 'Online',
      skillLevel: 'Beginner',
      trainer: trainer2._id,
      syllabus: [
        { moduleTitle: 'Module 1: Customer Success Principles', topics: ['Customer Experience (CX)', 'Active Listening', 'Tone of Voice & Empathy'] },
        { moduleTitle: 'Module 2: Escalation Management & Retention', topics: ['De-escalation Strategies', 'Retention Metrics (NPS, CSAT)', 'Service Recovery'] },
      ],
      careerOpportunities: ['Customer Relationship Executive', 'Customer Success Associate', 'Account Support Officer'],
      price: 9999,
      discountPrice: 5999,
      status: 'published',
    });

    const course6 = await TrainingCourse.create({
      title: 'Finance & Accounts Executive Professional Track',
      slug: 'finance-accounts-executive-professional-track',
      category: 'Finance & Accounts',
      shortDescription: 'Master Tally Prime, GST filing basics, invoicing, bank reconciliation, and corporate bookkeeping.',
      description: 'Step into corporate accounting with practical knowledge of bookkeeping, GST portals, TDS calculations, and Excel accounting models.',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
      duration: '8 Weeks',
      mode: 'Hybrid',
      skillLevel: 'Intermediate',
      trainer: trainer1._id,
      syllabus: [
        { moduleTitle: 'Module 1: Accounting Foundations', topics: ['Debit/Credit Principles', 'Journal Entries & Ledgers', 'Financial Statements'] },
        { moduleTitle: 'Module 2: Tally Prime & GST Implementation', topics: ['Voucher Entries in Tally', 'GST Invoicing & Returns Overview', 'Bank Reconciliation'] },
      ],
      careerOpportunities: ['Accounts Executive', 'Finance Associate', 'Junior Accountant', 'Billing Executive'],
      price: 14999,
      discountPrice: 8999,
      status: 'published',
    });

    console.log('Creating Jobs across Non-IT Categories...');
    const job1 = await Job.create({
      employer: employer1._id,
      title: 'Business Development Executive (BDE)',
      slug: 'business-development-executive-bde-nexus',
      department: 'Corporate Sales',
      category: 'Business Development Executive',
      industry: 'Corporate Advisory & Services',
      location: { city: 'Delhi', state: 'Delhi', country: 'India' },
      workMode: 'Hybrid',
      employmentType: 'Full-time',
      experience: { min: 0, max: 2 },
      salary: { min: 350000, max: 550000, currency: 'INR' },
      qualification: ['Any Graduate', 'BBA', 'B.Com', 'MBA'],
      skills: ['Sales Strategy', 'Lead Generation', 'Client Pitching', 'MS Excel', 'Communication'],
      description: 'Nexus Global is looking for dynamic Business Development Executives to drive corporate client acquisition, lead generation, and client relationship management across North India.',
      responsibilities: [
        'Identify corporate prospects and initiate outreach through email and phone',
        'Present company service offerings through online demos and in-person meetings',
        'Manage end-to-end sales cycle from initial contact to proposal submission and closing',
        'Maintain detailed updates in CRM and submit weekly performance reports',
      ],
      requirements: [
        'Excellent verbal and written communication in English and Hindi',
        'Demonstrated drive for targets and client interaction',
        'Prior non-IT sales training or internship experience preferred',
        'Proficiency in MS Office (Word, PowerPoint, Excel)',
      ],
      benefits: ['Attractive Performance Incentives', 'Health Insurance Cover', 'Fast-Track Promotion Path', 'Annual Corporate Retreat'],
      openings: 5,
      isFeatured: true,
      views: 240,
      status: 'active',
    });

    const job2 = await Job.create({
      employer: employer2._id,
      title: 'HR Executive & Talent Sourcing Associate',
      slug: 'hr-executive-talent-sourcing-associate-apex',
      department: 'Human Resources',
      category: 'HR Executive',
      industry: 'Supply Chain & Consulting',
      location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
      workMode: 'On-site',
      employmentType: 'Full-time',
      experience: { min: 0, max: 2 },
      salary: { min: 320000, max: 480000, currency: 'INR' },
      qualification: ['Any Graduate', 'BBA', 'B.Com', 'MBA HR'],
      skills: ['Resume Screening', 'Interview Coordination', 'HRMS', 'Job Portals', 'Excel for HR'],
      description: 'Apex Enterprises is expanding its talent acquisition team in Mumbai. We need energetic HR Executives who can manage high-volume recruitment drives, screen resumes, coordinate interviews, and support employee onboarding.',
      responsibilities: [
        'Source candidate profiles across job portals and social networks',
        'Conduct initial phone screenings and assess candidate suitability',
        'Coordinate interview schedules with department heads',
        'Maintain candidate database and documentation compliance',
      ],
      requirements: [
        'Strong interpersonal and coordination skills',
        'Understanding of recruitment workflows and HR documentation',
        'Formal HR training certification is a strong plus',
      ],
      benefits: ['Travel Allowance', 'PF & Medical Insurance', 'Learning & Development Sponsorship'],
      openings: 4,
      isFeatured: true,
      views: 190,
      status: 'active',
    });

    const job3 = await Job.create({
      employer: employer1._id,
      title: 'Operations Executive',
      slug: 'operations-executive-nexus',
      department: 'Business Operations',
      category: 'Operations Executive',
      industry: 'Corporate Advisory & Services',
      location: { city: 'Gurugram', state: 'Haryana', country: 'India' },
      workMode: 'On-site',
      employmentType: 'Full-time',
      experience: { min: 0, max: 3 },
      salary: { min: 300000, max: 450000, currency: 'INR' },
      qualification: ['Any Graduate'],
      skills: ['Process Management', 'Documentation', 'MS Excel', 'Coordination', 'Reporting'],
      description: 'Join our central operations unit in Gurugram to streamline process management, coordinate cross-functional logistics, and manage MIS reports.',
      responsibilities: [
        'Prepare daily and weekly operational MIS reports in Excel',
        'Coordinate with internal teams to ensure timely SLA compliance',
        'Audit records and resolve administrative bottlenecks',
      ],
      requirements: ['Sound analytical abilities and spreadsheet proficiency', 'Detail-oriented approach'],
      openings: 3,
      views: 120,
      status: 'active',
    });

    const job4 = await Job.create({
      employer: employer2._id,
      title: 'Customer Relationship Executive',
      slug: 'customer-relationship-executive-apex',
      department: 'Client Services',
      category: 'Customer Relationship Executive',
      industry: 'Supply Chain & Retail',
      location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
      workMode: 'Hybrid',
      employmentType: 'Full-time',
      experience: { min: 0, max: 2 },
      salary: { min: 280000, max: 420000, currency: 'INR' },
      qualification: ['Any Graduate'],
      skills: ['Customer Communication', 'CRM', 'Problem Solving', 'Telephone Etiquette'],
      description: 'Manage premium corporate client relationships, resolve inquiries promptly, and ensure high customer satisfaction scores.',
      openings: 6,
      views: 155,
      status: 'active',
    });

    const job5 = await Job.create({
      employer: employer1._id,
      title: 'Accounts & Finance Executive',
      slug: 'accounts-finance-executive-nexus',
      department: 'Finance',
      category: 'Accounts Executive',
      industry: 'Corporate Advisory',
      location: { city: 'Noida', state: 'Uttar Pradesh', country: 'India' },
      workMode: 'On-site',
      employmentType: 'Full-time',
      experience: { min: 1, max: 3 },
      salary: { min: 350000, max: 500000, currency: 'INR' },
      qualification: ['B.Com', 'M.Com', 'BBA Finance', 'Inter CA'],
      skills: ['Tally', 'GST Basics', 'Invoicing', 'Bank Reconciliation', 'Excel'],
      description: 'Handle daily bookkeeping, vendor bill processing, GST invoice reconciliation, and payroll journal entries.',
      openings: 2,
      views: 110,
      status: 'active',
    });

    console.log('Creating Enrollments, Attendance & Assessments...');
    // Enrollments
    const enroll1 = await CourseEnrollment.create({
      course: course1._id,
      candidate: candidate1._id,
      paymentStatus: 'paid',
      courseStatus: 'completed',
      progress: 100,
      attendance: 92,
      assessmentScore: 88,
      certificateUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=600',
      placementEligible: true,
    });

    const enroll2 = await CourseEnrollment.create({
      course: course2._id,
      candidate: candidate2._id,
      paymentStatus: 'paid',
      courseStatus: 'completed',
      progress: 100,
      attendance: 95,
      assessmentScore: 92,
      certificateUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=600',
      placementEligible: true,
    });

    await CourseEnrollment.create({
      course: course3._id,
      candidate: candidate3._id,
      paymentStatus: 'paid',
      courseStatus: 'in_progress',
      progress: 60,
      attendance: 85,
      assessmentScore: 75,
      placementEligible: true,
    });

    // Assessments
    const assessment1 = await Assessment.create({
      course: course1._id,
      title: 'Business Executive Mid-Term Competency Assessment',
      description: 'Evaluates your knowledge on professional corporate communication, email etiquette, and Excel reporting.',
      totalMarks: 20,
      passingMarks: 12,
      durationMinutes: 30,
      questions: [
        {
          questionText: 'What is the primary function of a VLOOKUP function in MS Excel?',
          options: ['To add multiple numbers', 'To search for a value in the first column of a table and return a value in the same row', 'To delete duplicate rows', 'To format dates'],
          correctOptionIndex: 1,
          marks: 5,
        },
        {
          questionText: 'Which greeting is most appropriate in formal B2B email communication?',
          options: ['Hey there!', 'Dear Mr./Ms. [Last Name],', 'Sup buddy,', 'Yo!'],
          correctOptionIndex: 1,
          marks: 5,
        },
        {
          questionText: 'What does SLA stand for in business operations?',
          options: ['Software License Agreement', 'Service Level Agreement', 'Standard Labor Action', 'System Log Analytics'],
          correctOptionIndex: 1,
          marks: 5,
        },
        {
          questionText: 'In a professional client presentation, what is the best practice for slide content?',
          options: ['Fill every slide with 200 words of plain text', 'Use high contrast, clean bullet points, visual charts, and concise takeaways', 'Use 10 different fonts', 'Avoid speaking to the audience'],
          correctOptionIndex: 1,
          marks: 5,
        },
      ],
      isActive: true,
    });

    // Assessment Results
    await AssessmentResult.create({
      assessment: assessment1._id,
      candidate: candidate1._id,
      score: 20,
      totalMarks: 20,
      percentage: 100,
      status: 'passed',
      answers: [
        { questionIndex: 0, selectedOption: 1, isCorrect: true },
        { questionIndex: 1, selectedOption: 1, isCorrect: true },
        { questionIndex: 2, selectedOption: 1, isCorrect: true },
        { questionIndex: 3, selectedOption: 1, isCorrect: true },
      ],
    });

    // Certificates with public verification code
    await Certificate.create({
      candidate: candidate1._id,
      course: course1._id,
      certificateNumber: 'TRN-2026-00101',
      issueDate: new Date('2026-06-15'),
      verificationCode: 'CERT-EXEC-2026',
      grade: 'Distinction',
      certificateUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=600',
    });

    await Certificate.create({
      candidate: candidate2._id,
      course: course2._id,
      certificateNumber: 'TRN-2026-00102',
      issueDate: new Date('2026-07-20'),
      verificationCode: 'CERT-HR-2026',
      grade: 'Distinction',
      certificateUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=600',
    });

    console.log('Creating Applications, Interviews & Placements...');
    // Application 1
    const app1 = await JobApplication.create({
      job: job1._id,
      candidate: candidate1._id,
      employer: employer1._id,
      resume: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      coverLetter: 'I have completed the Business Executive Master Training with distinction and have solid experience in client pitching and CRM.',
      status: 'interview',
      appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      screeningDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      recruiterNotes: 'Top candidate from non-IT batch. Excellent communication and sales acumen.',
    });

    // Application 2
    const app2 = await JobApplication.create({
      job: job2._id,
      candidate: candidate2._id,
      employer: employer2._id,
      resume: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      coverLetter: 'Certified HR Recruiter looking forward to contributing to Apex Enterprises sourcing goals.',
      status: 'selected',
      appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      screeningDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      interviewDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      selectedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      recruiterNotes: 'Cleared all 3 rounds. Offer letter issued.',
    });

    // Saved Job
    await SavedJob.create({
      candidate: candidate1._id,
      job: job3._id,
    });

    // Scheduled Interview
    await Interview.create({
      application: app1._id,
      job: job1._id,
      candidate: candidate1._id,
      employer: employer1._id,
      recruiter: recruiterUser._id,
      interviewType: 'HR Round',
      interviewMode: 'Online (Video)',
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      scheduledTime: '11:30 AM IST',
      meetingLink: 'https://meet.google.com/xyz-nexus-interview',
      location: 'Google Meet Video Call',
      interviewerName: 'Arjun Singhania (Nexus Global)',
      status: 'scheduled',
      feedback: 'Candidate looks promising based on training scorecard.',
    });

    // Placement Record
    await Placement.create({
      candidate: candidate2._id,
      job: job2._id,
      employer: employer2._id,
      recruiter: recruiterUser._id,
      designation: 'HR Executive & Talent Associate',
      salary: 450000,
      joiningDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      placementDate: new Date(),
      status: 'accepted',
      offerLetterUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
    });

    // Recruitment Request
    await RecruitmentRequest.create({
      employer: employer1._id,
      jobTitle: 'Bulk Hiring: 15 Business Development Executives',
      department: 'Corporate Sales',
      numberOfOpenings: 15,
      experience: '0-1 year (Freshers Eligible)',
      salaryRange: '₹3,50,000 - ₹5,00,000 P.A.',
      location: 'Delhi NCR',
      requiredSkills: ['Cold Calling', 'Lead Generation', 'Client Pitching', 'Communication'],
      qualification: ['Any Graduate'],
      description: 'We need 15 pre-trained non-IT sales candidates with strong presentation and communication fundamentals to join our Q4 sales squad.',
      assignedRecruiter: recruiterUser._id,
      status: 'in_progress',
    });

    console.log('Creating Testimonials, Blogs & Enquiries...');
    // Testimonials
    await Testimonial.create([
      {
        name: 'Rahul Sharma',
        role: 'Business Development Executive',
        type: 'candidate',
        companyOrCollege: 'Placed at Nexus Global Solutions',
        courseOrJob: 'Business Executive Training Program',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
        content: 'The non-IT training completely reshaped my confidence. The practical mock pitches, Excel training, and direct interviews helped me secure a ₹4.5 LPA offer right after graduation!',
        rating: 5,
      },
      {
        name: 'Priya Verma',
        role: 'HR Executive',
        type: 'candidate',
        companyOrCollege: 'Placed at Apex Enterprises',
        courseOrJob: 'HR Executive & Recruiter Masterclass',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
        content: 'From learning Boolean sourcing to actual resume screening and interview coordination, everything was practical and relevant. Landed my dream HR role in just 45 days.',
        rating: 5,
      },
      {
        name: 'Arjun Singhania',
        role: 'Head of Talent Acquisition',
        type: 'employer',
        companyOrCollege: 'Nexus Global Solutions',
        courseOrJob: 'Hired 25+ Candidates',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
        content: 'Candidates coming from this platform are genuinely job-ready from Day 1. Their communication, MS Office skills, and professional mindset save us weeks of training.',
        rating: 5,
      },
      {
        name: 'Dr. S. K. Raman',
        role: 'Dean of Placements',
        type: 'college',
        companyOrCollege: 'Delhi Institute of Management',
        courseOrJob: 'Campus Placement Partner',
        avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=250',
        content: 'Our college placement statistics surged by 40% after partnering for employability non-IT bootcamps. Our non-tech students now have clear career paths.',
        rating: 5,
      },
    ]);

    // Blogs
    await Blog.create([
      {
        title: 'Top 7 Non-IT Careers with High Salary Growth in 2026',
        slug: 'top-7-non-it-careers-with-high-salary-growth',
        thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800',
        category: 'Career Advice',
        author: 'Career Advisory Board',
        tags: ['Non-IT Careers', 'Freshers Guide', 'Salary Trends'],
        content: `Non-IT roles such as Business Development Executives (BDE), Talent Acquisition Specialists, Operations Associates, and Relationship Managers are seeing unprecedented demand in India's booming service sector. 

Key high-growth domains include:
1. Business Development & B2B Corporate Sales
2. Human Resource Management & Technical Recruitment
3. Client Relationship & Corporate Hospitality
4. Supply Chain, Logistics & Commercial Operations
5. Finance & GST Accounts Execution

By developing practical communication, spreadsheet literacy, and client management skills, graduates can achieve rapid career promotions and lucrative incentive packages.`,
        views: 520,
        status: 'published',
      },
      {
        title: 'How to Crack Non-IT Corporate Interviews: The Ultimate Guide',
        slug: 'how-to-crack-non-it-corporate-interviews',
        thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
        category: 'Interview Tips',
        author: 'Pooja Sharma (Lead Recruiter)',
        tags: ['Interview Tips', 'HR Round', 'Mock Interview'],
        content: `Interviewers for non-IT roles look for three essential pillars: Clear Professional Communication, Problem Solving, and Coachability.

Top Tips for Your Next Interview:
1. Structure your answers using the STAR Method (Situation, Task, Action, Result).
2. Research the company's business model and target clients before the interview.
3. Be ready to demonstrate practical skills (such as mock pitches or Excel formulas).
4. Maintain enthusiastic body language and follow up with a polite thank-you email.`,
        views: 410,
        status: 'published',
      },
      {
        title: 'Why Excel and Communication are the Real Superpowers for Freshers',
        slug: 'why-excel-and-communication-are-superpowers',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        category: 'Skill Development',
        author: 'Vikram Malhotra (Senior Trainer)',
        tags: ['Excel for Business', 'Soft Skills', 'Employability'],
        content: `Regardless of whether you work in sales, HR, operations, or marketing, your ability to synthesize numbers in Excel and communicate recommendations clearly to management defines your career trajectory. Learn Pivot Tables, VLOOKUP/XLOOKUP, and concise email writing early!`,
        views: 380,
        status: 'published',
      },
    ]);

    // Sample Notification
    await Notification.create({
      user: candidate1._id,
      title: 'Welcome to Placement Platform! 🚀',
      message: 'Your profile is ready. Browse high-demand Non-IT jobs and start applying today.',
      type: 'system',
    });

    console.log('✅ SEEDING COMPLETE!');
    console.log('----------------------------------------------------');
    console.log('DEMO ACCOUNTS FOR ALL 6 ROLES:');
    console.log('1. Admin:      admin@mycompany.com        / admin123');
    console.log('2. Recruiter:  recruiter@mycompany.com    / recruiter123');
    console.log('3. Trainer:    trainer.vikram@mycompany.com / trainer123');
    console.log('4. Employer:   hr@nexusglobal.com         / employer123');
    console.log('5. College:    placement@delhicollege.edu / college123');
    console.log('6. Candidate:  rahul.sharma@gmail.com     / candidate123');
    console.log('   Candidate2: priya.verma@gmail.com      / candidate123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ SEEDING ERROR:', error);
    process.exit(1);
  }
};

seedData();
