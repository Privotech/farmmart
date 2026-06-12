"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadImageAction } from "@/lib/uploadAction";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
}

export default function ImageUpload({
  onImageUpload,
  currentImage,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImageAction(formData, "farmmart/animals");
      onImageUpload(result.secure_url);
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {currentImage && (
        <div className="relative w-full h-48">
          <Image
            src={currentImage}
            alt="Animal preview"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Animal Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        {uploading && (
          <p className="text-sm text-gray-600 mt-2">Uploading image...</p>
        )}
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  );
}
