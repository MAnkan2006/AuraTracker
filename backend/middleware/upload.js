const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const ALLOWED_MIMES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    return cb(new Error('Only PDF and image files (JPEG, PNG, WebP) are allowed'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});

module.exports = upload;
