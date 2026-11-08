import cloudinary from "../config/cloudinary";
import { Readable } from "stream";

interface UploadedImage {
  url: string;
  publicId: string;
}

export const uploadImage = async (
  file: Express.Multer.File
): Promise<UploadedImage> => {
  return new Promise<UploadedImage>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "devconnect",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error("Image upload failed"));
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};