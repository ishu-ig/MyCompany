/**
 * Standard Success Response
 * {
 *   success: true,
 *   message: "...",
 *   data: { ... },
 *   pagination: { ... } (optional)
 * }
 */
const sendSuccess = (res, message = 'Operation successful', data = {}, statusCode = 200, pagination = null) => {
  const response = {
    success: true,
    message,
    data,
  };
  if (pagination) {
    response.pagination = pagination;
  }
  return res.status(statusCode).json(response);
};

/**
 * Standard Error Response
 * {
 *   success: false,
 *   message: "...",
 *   errors: [ ... ]
 * }
 */
const sendError = (res, message = 'Something went wrong', statusCode = 500, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: Array.isArray(errors) ? errors : [errors],
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
