import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const cloudinaryUrl = process.env.CLOUDINARY_URL;

if ((!cloudName || !apiKey || !apiSecret) && !cloudinaryUrl) {
  throw new Error(
    "Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
  );
}

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
} else {
  // The Cloudinary SDK reads CLOUDINARY_URL automatically. This supports
  // deployment providers that expose only this standard environment variable.
  cloudinary.config({ secure: true });
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

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

    const rawName =
      typeof File !== "undefined" && file instanceof File && file.name
        ? file.name.replace(/\.[^.]+$/, "")
        : null;

    const sanitized = rawName ? sanitizeFilename(rawName) : null;

    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
          timeout: 60000,
          ...(sanitized
            ? { public_id: `${folder}/${sanitized}-${Date.now()}` }
            : {}),
          // REMOVED: filename_override and use_filename
          // Spaces in filename_override broke Cloudinary's HMAC-SHA256 signature
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
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
}

export default cloudinary;
