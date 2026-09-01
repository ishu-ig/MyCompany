const Attendance = require('../models/Attendance');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Mark attendance for students
// @route   POST /api/attendance
// @access  Private (Trainer/Admin)
const markAttendance = async (req, res, next) => {
  try {
    const { courseId, records, date = new Date() } = req.body;
    // records: [{ candidateId: "...", status: "present"|"absent"|"leave", remarks: "..." }]

    if (!courseId || !Array.isArray(records) || records.length === 0) {
      return sendError(res, 'Course ID and attendance records are required', 400);
    }

    const savedRecords = [];
    for (const record of records) {
      const attendance = await Attendance.findOneAndUpdate(
        {
          course: courseId,
          candidate: record.candidateId,
          date: {
            $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
            $lte: new Date(new Date(date).setHours(23, 59, 59, 999)),
          },
        },
        {
          course: courseId,
          candidate: record.candidateId,
          trainer: req.user._id,
          date: new Date(date),
          status: record.status || 'present',
          remarks: record.remarks || '',
        },
        { upsert: true, new: true }
      );
      savedRecords.push(attendance);
    }

    return sendSuccess(res, 'Attendance marked successfully', savedRecords, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance for a course
// @route   GET /api/attendance/course/:courseId
// @access  Private (Trainer/Admin/Candidate)
const getCourseAttendance = async (req, res, next) => {
  try {
    const { date } = req.query;
    const query = { course: req.params.courseId };

    if (date) {
      query.date = {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        $lte: new Date(new Date(date).setHours(23, 59, 59, 999)),
      };
    }

    const records = await Attendance.find(query)
      .populate('candidate', 'name email phone avatar')
      .populate('trainer', 'name')
      .sort({ date: -1 });

    return sendSuccess(res, 'Attendance records retrieved', records);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markAttendance,
  getCourseAttendance,
};
