import multer from "multer";
import path from "path";

// Store uploaded images in memory
const storage = multer.memoryStorage();

// Allowed image MIME types and extensions
const allowedTypes: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

// Validate uploaded file
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const expectedExtension = allowedTypes[file.mimetype];
  const actualExtension = path.extname(file.originalname).toLowerCase();

  if (!expectedExtension || actualExtension !== expectedExtension) {
    return cb(new Error("Only valid JPG, PNG and WebP images are allowed."));
  }

  cb(null, true);
};

// Configure secure Multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Maximum 5 MB
    files: 1,                 // Only one file per request
    fields: 10,
    parts: 11,
  },
});

export default upload;