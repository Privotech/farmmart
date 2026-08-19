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
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState(currentImage || "");

  // Handle local file upload from PC
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImageAction(formData, "farmmart/animals");
      
      if (result?.secure_url) {
        setUrlInput(result.secure_url);
        onImageUpload(result.secure_url);
      } else {
        setError("Failed to obtain image URL.");
      }
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // Handle direct image URL link input
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrlInput(value);
    onImageUpload(value);
  };

  return (
    <div className="space-y-4">
      {/* Mode Selector Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setUploadMode("file")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
            uploadMode === "file"
              ? "bg-primary text-primary-foreground"
              : "bg-primary-50 text-text-secondary hover:bg-primary-100"
          }`}
        >
          Upload File from PC
        </button>
        <button
          type="button"
          onClick={() => setUploadMode("url")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
            uploadMode === "url"
              ? "bg-primary text-primary-foreground"
              : "bg-primary-50 text-text-secondary hover:bg-primary-100"
          }`}
        >
          Paste Image URL Link
        </button>
      </div>

      {/* Image Preview */}
      {currentImage && (
        <div className="relative w-full h-48 bg-primary-50 rounded-lg overflow-hidden">
          <Image
            src={currentImage}
            alt="Animal preview"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}

      {/* Inputs according to selected mode */}
      <div>
        {uploadMode === "file" ? (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Animal Image from Computer
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="w-full px-4 py-2 border-border border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-secondary bg-surface transition-all"
            />
            {uploading && (
              <p className="text-sm text-primary mt-2">Uploading image to cloud...</p>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Image Web URL Link
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={urlInput}
              onChange={handleUrlChange}
              className="w-full px-4 py-2 border-border border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground bg-surface transition-all"
            />
          </div>
        )}

        {error && <p className="text-sm text-danger mt-2">{error}</p>}
      </div>
    </div>
  );
}