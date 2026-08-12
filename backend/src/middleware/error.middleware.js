export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the full error server-side
  console.error(`[Error]: ${message}`, err.stack);

  // Never leak stack trace to the client
  res.status(statusCode).json({
    success: false,
    message: message,
  });
};
