const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const CourseEnrollment = require('../models/CourseEnrollment');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get assessments for a course
// @route   GET /api/assessments/course/:courseId
// @access  Public / Private
const getCourseAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ course: req.params.courseId, isActive: true });
    return sendSuccess(res, 'Assessments retrieved', assessments);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single assessment with questions
// @route   GET /api/assessments/:id
// @access  Private
const getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('course', 'title category');
    if (!assessment) {
      return sendError(res, 'Assessment not found', 404);
    }
    return sendSuccess(res, 'Assessment retrieved', assessment);
  } catch (error) {
    next(error);
  }
};

// @desc    Create an assessment
// @route   POST /api/assessments
// @access  Private (Trainer/Admin)
const createAssessment = async (req, res, next) => {
  try {
    const { course, title, description, totalMarks, passingMarks, questions, durationMinutes, startDate, endDate } =
      req.body;

    if (!course || !title || !Array.isArray(questions) || questions.length === 0) {
      return sendError(res, 'Course, title, and questions are required', 400);
    }

    const assessment = await Assessment.create({
      course,
      title,
      description,
      totalMarks: totalMarks || questions.length,
      passingMarks: passingMarks || Math.ceil(questions.length * 0.6),
      questions,
      durationMinutes: durationMinutes || 30,
      startDate: startDate || new Date(),
      endDate,
    });

    return sendSuccess(res, 'Assessment created successfully', assessment, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Submit assessment answers
// @route   POST /api/assessments/:id/submit
// @access  Private (Candidate)
const submitAssessment = async (req, res, next) => {
  try {
    const { answers } = req.body; // [{ questionIndex: 0, selectedOption: 1 }]
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return sendError(res, 'Assessment not found', 404);
    }

    // Check existing
    const existing = await AssessmentResult.findOne({
      assessment: assessment._id,
      candidate: req.user._id,
    });
    if (existing) {
      return sendSuccess(res, 'You have already submitted this assessment', existing);
    }

    let score = 0;
    const evaluatedAnswers = [];

    assessment.questions.forEach((q, idx) => {
      const submission = answers?.find((a) => a.questionIndex === idx);
      const isCorrect = submission && submission.selectedOption === q.correctOptionIndex;
      if (isCorrect) {
        score += q.marks || 1;
      }
      evaluatedAnswers.push({
        questionIndex: idx,
        selectedOption: submission ? submission.selectedOption : -1,
        isCorrect,
      });
    });

    const percentage = Math.round((score / assessment.totalMarks) * 100);
    const status = score >= assessment.passingMarks ? 'passed' : 'failed';

    const result = await AssessmentResult.create({
      assessment: assessment._id,
      candidate: req.user._id,
      score,
      totalMarks: assessment.totalMarks,
      percentage,
      status,
      answers: evaluatedAnswers,
    });

    // Update enrollment assessment score
    await CourseEnrollment.findOneAndUpdate(
      { course: assessment.course, candidate: req.user._id },
      { assessmentScore: percentage, progress: Math.min(100, (percentage > 60 ? 100 : 80)) }
    );

    return sendSuccess(res, `Assessment submitted! You scored ${score}/${assessment.totalMarks} (${percentage}%) - ${status.toUpperCase()}`, result, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's assessment results
// @route   GET /api/assessments/results/my-results
// @access  Private (Candidate)
const getMyResults = async (req, res, next) => {
  try {
    const results = await AssessmentResult.find({ candidate: req.user._id })
      .populate({
        path: 'assessment',
        populate: { path: 'course', select: 'title category' },
      })
      .sort({ submittedAt: -1 });

    return sendSuccess(res, 'Assessment results retrieved', results);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourseAssessments,
  getAssessmentById,
  createAssessment,
  submitAssessment,
  getMyResults,
};
