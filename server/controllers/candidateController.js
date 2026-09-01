const CandidateProfile = require('../models/CandidateProfile');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get current candidate profile
// @route   GET /api/candidates/me
// @access  Private (Candidate)
const getMyProfile = async (req, res, next) => {
  try {
    let profile = await CandidateProfile.findOne({ user: req.user._id }).populate('user', 'name email phone avatar');
    if (!profile) {
      profile = await CandidateProfile.create({ user: req.user._id });
    }
    return sendSuccess(res, 'Profile retrieved', profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Update candidate profile
// @route   PUT /api/candidates/me
// @access  Private (Candidate)
const updateMyProfile = async (req, res, next) => {
  try {
    const {
      headline,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      country,
      education,
      experience,
      skills,
      certifications,
      projects,
      preferredJobRoles,
      preferredLocations,
      experienceYears,
      currentSalary,
      expectedSalary,
      noticePeriod,
      resumeUrl,
      linkedinUrl,
      portfolioUrl,
      isAvailableForJob,
      name,
      phone,
      avatar,
    } = req.body;

    // Update user info if provided
    if (name || phone || avatar) {
      await User.findByIdAndUpdate(req.user._id, {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
      });
    }

    let profile = await CandidateProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new CandidateProfile({ user: req.user._id });
    }

    if (headline !== undefined) profile.headline = headline;
    if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth;
    if (gender !== undefined) profile.gender = gender;
    if (address !== undefined) profile.address = address;
    if (city !== undefined) profile.city = city;
    if (state !== undefined) profile.state = state;
    if (country !== undefined) profile.country = country;
    if (education !== undefined) profile.education = education;
    if (experience !== undefined) profile.experience = experience;
    if (skills !== undefined) profile.skills = skills;
    if (certifications !== undefined) profile.certifications = certifications;
    if (projects !== undefined) profile.projects = projects;
    if (preferredJobRoles !== undefined) profile.preferredJobRoles = preferredJobRoles;
    if (preferredLocations !== undefined) profile.preferredLocations = preferredLocations;
    if (experienceYears !== undefined) profile.experienceYears = experienceYears;
    if (currentSalary !== undefined) profile.currentSalary = currentSalary;
    if (expectedSalary !== undefined) profile.expectedSalary = expectedSalary;
    if (noticePeriod !== undefined) profile.noticePeriod = noticePeriod;
    if (resumeUrl !== undefined) profile.resumeUrl = resumeUrl;
    if (linkedinUrl !== undefined) profile.linkedinUrl = linkedinUrl;
    if (portfolioUrl !== undefined) profile.portfolioUrl = portfolioUrl;
    if (isAvailableForJob !== undefined) profile.isAvailableForJob = isAvailableForJob;

    // Compute profile completion percentage
    let completion = 20;
    if (profile.headline) completion += 10;
    if (profile.education && profile.education.length > 0) completion += 20;
    if (profile.skills && profile.skills.length > 0) completion += 15;
    if (profile.experience && profile.experience.length > 0) completion += 15;
    if (profile.resumeUrl) completion += 20;
    profile.profileCompletion = Math.min(completion, 100);

    await profile.save();
    const updated = await CandidateProfile.findById(profile._id).populate('user', 'name email phone avatar');

    return sendSuccess(res, 'Profile updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Search and filter candidates (For employers, recruiters, admins)
// @route   GET /api/candidates
// @access  Public / Authorized
const searchCandidates = async (req, res, next) => {
  try {
    const {
      role,
      skill,
      city,
      experienceMin,
      experienceMax,
      availableOnly,
      keyword,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    if (skill) {
      query.skills = { $in: [new RegExp(skill, 'i')] };
    }
    if (role) {
      query.$or = [
        { headline: { $regex: role, $options: 'i' } },
        { preferredJobRoles: { $in: [new RegExp(role, 'i')] } },
      ];
    }
    if (availableOnly === 'true') {
      query.isAvailableForJob = true;
    }
    if (experienceMin || experienceMax) {
      query.experienceYears = {};
      if (experienceMin) query.experienceYears.$gte = Number(experienceMin);
      if (experienceMax) query.experienceYears.$lte = Number(experienceMax);
    }
    if (keyword) {
      query.$or = [
        { headline: { $regex: keyword, $options: 'i' } },
        { skills: { $in: [new RegExp(keyword, 'i')] } },
        { city: { $regex: keyword, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await CandidateProfile.countDocuments(query);
    const candidates = await CandidateProfile.find(query)
      .populate('user', 'name email phone avatar')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return sendSuccess(
      res,
      'Candidates fetched',
      candidates,
      200,
      {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate by ID
// @route   GET /api/candidates/:id
// @access  Public / Private
const getCandidateById = async (req, res, next) => {
  try {
    const candidate = await CandidateProfile.findById(req.params.id).populate('user', 'name email phone avatar');
    if (!candidate) {
      return sendError(res, 'Candidate not found', 404);
    }
    return sendSuccess(res, 'Candidate retrieved', candidate);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  searchCandidates,
  getCandidateById,
};
