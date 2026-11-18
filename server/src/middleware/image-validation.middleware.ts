import { RequestHandler } from "express";
import path from "path";

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const allowedExtensions: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const validateImageContent: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required.",
      });
    }

    // Dynamically import ESM package
    const { fileTypeFromBuffer } = await import("file-type");

    // Detect actual file type using binary content
    const detectedType = await fileTypeFromBuffer(file.buffer);

    if (!detectedType) {
      return res.status(400).json({
        success: false,
        message: "Invalid or unsupported image file.",
      });
    }

    // Verify actual MIME type
    if (!allowedMimeTypes.includes(detectedType.mime)) {
      return res.status(400).json({
        success: false,
        message: "Only JPG, PNG and WebP images are allowed.",
      });
    }

    // Verify actual extension
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const validExtensions = allowedExtensions[detectedType.mime];

    if (!validExtensions.includes(extension)) {
      return res.status(400).json({
        success: false,
        message: "Image extension does not match its actual content.",
      });
    }

    // Verify declared MIME type against detected MIME type
    if (file.mimetype !== detectedType.mime) {
      return res.status(400).json({
        success: false,
        message: "Image MIME type mismatch.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default validateImageContent;