export const sendSuccess = (res, statusCode, message, data) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, statusCode, message, error) => {
  const payload = { success: false, message };
  if (process.env.NODE_ENV === "development" && error) {
    payload.error = typeof error === "string" ? { message: error } : { stack: error?.stack || error };
  }
  return res.status(statusCode).json(payload);
};
