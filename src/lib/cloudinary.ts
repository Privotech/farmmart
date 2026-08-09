import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error(
    "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.",
  );
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export async function uploadImage(
  file: File | Buffer,
  folder: string = "farmmart",
) {
  try {
    if (typeof file === "string") {
      return await cloudinary.uploader.upload(file, {
        folder,
        resource_type: "auto",
        timeout: 60000,
      });
    }

    let buffer: Buffer;
    if (typeof Buffer !== "undefined" && file instanceof Buffer) {
      buffer = file;
    } else {
      const fileObj = file as File;
      const arrayBuffer = await fileObj.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    const filename =
      typeof File !== "undefined" && file instanceof File && file.name
        ? file.name
        : undefined;

    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
          timeout: 60000,
          filename_override: filename,
          use_filename: Boolean(filename),
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary upload failed"));
            return;
          }

          resolve(result);
        },
      );

      stream.end(buffer);
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}

export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
}

export default cloudinary;
