const sharp = require('sharp');

/**
 * Optimize an image buffer for catalog / banner uploads.
 * @param {Buffer} buffer
 * @param {{ width?: number, height?: number, format?: 'webp'|'jpeg'|'png', quality?: number }} [options]
 */
const optimizeImage = async (buffer, options = {}) => {
  const {
    width = 1600,
    height,
    format = 'webp',
    quality = 80,
  } = options;

  let pipeline = sharp(buffer).rotate();

  pipeline = pipeline.resize({
    width,
    height,
    fit: 'inside',
    withoutEnlargement: true,
  });

  if (format === 'jpeg') {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true });
  } else if (format === 'png') {
    pipeline = pipeline.png({ compressionLevel: 8 });
  } else {
    pipeline = pipeline.webp({ quality });
  }

  const output = await pipeline.toBuffer({ resolveWithObject: true });

  return {
    buffer: output.data,
    info: output.info,
    contentType: `image/${format === 'jpeg' ? 'jpeg' : format}`,
    extension: format === 'jpeg' ? 'jpg' : format,
  };
};

/**
 * Generate a small thumbnail.
 * @param {Buffer} buffer
 */
const createThumbnail = async (buffer) =>
  optimizeImage(buffer, { width: 400, format: 'webp', quality: 75 });

module.exports = {
  optimizeImage,
  createThumbnail,
};
