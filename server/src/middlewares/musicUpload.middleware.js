const multer = require('multer');
const ApiError = require('../utils/ApiError');

const ALLOWED_MIME = new Set([
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
  'audio/ogg',
  'audio/webm',
  'audio/mp4',
  'audio/aac',
  'audio/x-m4a',
  'audio/m4a',
]);

const ALLOWED_EXT = /\.(mp3|wav|ogg|m4a|aac|webm)$/i;

const musicMulter = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype) || ALLOWED_EXT.test(file.originalname || '')) {
      cb(null, true);
      return;
    }
    cb(ApiError.badRequest('Upload an MP3, WAV, OGG, or M4A file'));
  },
}).single('file');

const musicUpload = (req, res, next) => {
  musicMulter(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(ApiError.badRequest('Song must be under 8 MB'));
    }
    if (err instanceof ApiError) return next(err);
    return next(ApiError.badRequest(err.message || 'Could not upload song'));
  });
};

module.exports = { musicUpload };
