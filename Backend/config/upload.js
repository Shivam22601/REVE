const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadPath),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

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
