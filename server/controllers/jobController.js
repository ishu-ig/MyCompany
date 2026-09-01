const Job = require('../models/Job');
const EmployerProfile = require('../models/EmployerProfile');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const generateSlug = (title) => {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') +
    '-' +
    Math.floor(1000 + Math.random() * 9000)
  );
};

// @desc    Get all jobs (with advanced filtering, search, sorting & pagination)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      city,
      workMode,
      employmentType,
      experience,
      salaryMin,
      isFeatured,
      employerId,
      status = 'active',
      sort = 'newest',
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Only filter by active if requested or public, unless employer/admin requests other status
    if (status) {
      query.status = status;
    }

    if (employerId) {
      query.employer = employerId;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    if (workMode && workMode !== 'All') {
      query.workMode = workMode;
    }

    if (employmentType && employmentType !== 'All') {
      query.employmentType = employmentType;
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    if (salaryMin) {
      query['salary.max'] = { $gte: Number(salaryMin) };
    }

    if (experience) {
      // e.g. "0-2" or single number
      if (experience.includes('-')) {
        const [min, max] = experience.split('-').map(Number);
        query['experience.min'] = { $lte: max };
        query['experience.max'] = { $gte: min };
      } else {
        query['experience.min'] = { $lte: Number(experience) };
      }
    }

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { skills: { $in: [new RegExp(keyword, 'i')] } },
        { description: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { 'location.city': { $regex: keyword, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // newest
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'salary-high') sortOption = { 'salary.max': -1 };
    if (sort === 'salary-low') sortOption = { 'salary.min': 1 };
    if (sort === 'popular') sortOption = { views: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('employer', 'name email avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Fetch employer profiles for company logos & details
    const jobsWithCompany = await Promise.all(
      jobs.map(async (job) => {
        const empProfile = await EmployerProfile.findOne({ user: job.employer?._id });
        return {
          ...job.toObject(),
          companyName: empProfile?.companyName || job.employer?.name || 'Top Corporate Employer',
          companyLogo: empProfile?.companyLogo || job.employer?.avatar,
          companyWebsite: empProfile?.website || '',
        };
      })
    );

    return sendSuccess(res, 'Jobs retrieved successfully', jobsWithCompany, 200, {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name email avatar');
    if (!job) {
      return sendError(res, 'Job not found', 404);
    }
    // Increment view count
    job.views += 1;
    await job.save();

    const empProfile = await EmployerProfile.findOne({ user: job.employer?._id });

    return sendSuccess(res, 'Job retrieved', {
      ...job.toObject(),
      companyName: empProfile?.companyName || job.employer?.name,
      companyLogo: empProfile?.companyLogo || job.employer?.avatar,
      companyWebsite: empProfile?.website,
      companyIndustry: empProfile?.industry,
      companyDescription: empProfile?.description,
      companySize: empProfile?.companySize,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by slug
// @route   GET /api/jobs/slug/:slug
// @access  Public
const getJobBySlug = async (req, res, next) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug }).populate('employer', 'name email avatar');
    if (!job) {
      return sendError(res, 'Job not found', 404);
    }
    job.views += 1;
    await job.save();

    const empProfile = await EmployerProfile.findOne({ user: job.employer?._id });

    return sendSuccess(res, 'Job retrieved', {
      ...job.toObject(),
      companyName: empProfile?.companyName || job.employer?.name,
      companyLogo: empProfile?.companyLogo || job.employer?.avatar,
      companyWebsite: empProfile?.website,
      companyIndustry: empProfile?.industry,
      companyDescription: empProfile?.description,
      companySize: empProfile?.companySize,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Employer / Recruiter / Admin)
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      department,
      category,
      industry,
      location,
      workMode,
      employmentType,
      experience,
      salary,
      qualification,
      skills,
      description,
      responsibilities,
      requirements,
      benefits,
      openings,
      applicationDeadline,
      status = 'active',
      isFeatured = false,
    } = req.body;

    if (!title || !category || !description || !location?.city) {
      return sendError(res, 'Please provide title, category, description, and city', 400);
    }

    const slug = generateSlug(title);

    const job = await Job.create({
      employer: req.user._id,
      title,
      slug,
      department,
      category,
      industry,
      location,
      workMode,
      employmentType,
      experience,
      salary,
      qualification,
      skills,
      description,
      responsibilities,
      requirements,
      benefits,
      openings,
      applicationDeadline,
      status,
      isFeatured,
    });

    return sendSuccess(res, 'Job posted successfully', job, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Owner Employer / Recruiter / Admin)
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return sendError(res, 'Job not found', 404);
    }

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized to update this job', 403);
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    return sendSuccess(res, 'Job updated successfully', job);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Owner Employer / Admin)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return sendError(res, 'Job not found', 404);
    }

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized to delete this job', 403);
    }

    await Job.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 'Job deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update job status (draft, active, closed, expired)
// @route   PATCH /api/jobs/:id/status
// @access  Private
const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['draft', 'active', 'closed', 'expired'].includes(status)) {
      return sendError(res, 'Invalid status', 400);
    }

    const job = await Job.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!job) {
      return sendError(res, 'Job not found', 404);
    }
    return sendSuccess(res, 'Job status updated', job);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  getJobBySlug,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus,
};
