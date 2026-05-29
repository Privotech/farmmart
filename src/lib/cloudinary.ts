import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: File | Buffer, folder: string = 'farmmart') {
  try {
    let data: Buffer | string;

    if (typeof Buffer !== 'undefined' && file instanceof Buffer) {
      data = file;
    } else if (typeof File !== 'undefined' && file instanceof File) {
      data = Buffer.from(await file.arrayBuffer());
    } else {
      // Fallback: assume Buffer or data URI string
      data = file as unknown as Buffer | string;
    }

    const dataUri = typeof data === 'string' ? data : `data:;base64,${data.toString('base64')}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: 'auto',
    });

    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
}

export default cloudinary;
