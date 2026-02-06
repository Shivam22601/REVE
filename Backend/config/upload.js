const multer = require('multer');

const storage = multer.memoryStorage();

const maxMb = parseInt(process.env.UPLOAD_MAX_FILE_SIZE_MB || '10', 10);
const maxFiles = parseInt(process.env.UPLOAD_MAX_FILES || '5', 10);
const allowedMimes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const upload = multer({
  storage,
  limits: { fileSize: maxMb * 1024 * 1024, files: maxFiles, fields: 50 },
  fileFilter: (_req, file, cb) => {
    if (allowedMimes.has(file.mimetype)) cb(null, true);
    else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
  }
});

module.exports = upload;
