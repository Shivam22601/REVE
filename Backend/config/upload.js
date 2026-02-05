const path = require('path');
const fs = require('fs');
const multer = require('multer');

const useCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

let storage;

if (useCloudinary) {
  try {
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    const cloudinary = require('./cloudinary');
    storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: process.env.CLOUDINARY_FOLDER || 'ecommerce',
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        public_id: (_req, file) => {
          const base = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9_-]/g, '');
          return `${Date.now()}-${Math.round(Math.random() * 1e9)}-${base}`;
        }
      }
    });
  } catch (error) {
    console.warn('Cloudinary not configured or failed to initialize, using local storage');
    console.error('Cloudinary initialization error:', error && error.message ? error.message : error);
  }
}

if (!storage) {
  const uploadPath = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadPath),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    }
  });
}

const maxMb = parseInt(process.env.UPLOAD_MAX_FILE_SIZE_MB || '10', 10);
const upload = multer({
  storage,
  limits: { fileSize: maxMb * 1024 * 1024 }
});

module.exports = upload;


