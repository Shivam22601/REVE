const notFound = (_req, res, _next) => {
  res.status(404).json({ message: 'Route not found' });
};

const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  let status = err.statusCode || 500;
  let message = err.message || 'Server error';
  let details;

  // Multer-specific errors
  if (err.name === 'MulterError') {
    status = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large';
      details = { maxMb: parseInt(process.env.UPLOAD_MAX_FILE_SIZE_MB || '10', 10) };
    } else {
      message = `Upload error: ${err.code}`;
    }
    // Cloudinary storage errors attached by multer-storage-cloudinary
    if (Array.isArray(err.storageErrors) && err.storageErrors.length) {
      details = {
        storageErrors: err.storageErrors.map(e => ({
          message: e.message,
          field: e.field,
          http_code: e.http_code
        }))
      };
    }
  }

  res.status(status).json({
    message,
    ...(details ? { details } : {}),
  });
};

module.exports = { notFound, errorHandler };


