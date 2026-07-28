const MAX_IMAGE_BYTES = 2 * 1024 * 1024

/**
 * Resize & compress an image file to a JPEG data URL (smaller JSON payloads).
 * @param {File} file
 * @param {{ maxWidth?: number, maxHeight?: number, quality?: number }} [options]
 */
export async function compressImageFile(file, options = {}) {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.82 } = options

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Image must be under 2 MB')
  }

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height)
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not prepare image canvas')
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close?.()

  return canvas.toDataURL('image/jpeg', quality)
}
