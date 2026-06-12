"use server";

import { uploadImage } from "./cloudinary";

export async function uploadImageAction(formData: FormData, folder: string = "farmmart") {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  const result = await uploadImage(file, folder);
  return { secure_url: result.secure_url };
}
