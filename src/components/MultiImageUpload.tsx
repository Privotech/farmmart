"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadImageAction } from "@/lib/uploadAction";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface MultiImageUploadProps {
  onImagesChange: (imageUrls: string[]) => void;
  currentImages?: string[];
  maxImages?: number;
  folder?: string;
}

export default function MultiImageUpload({
  onImagesChange,
  currentImages = [],
  maxImages = 10,
  folder = "farmmart/animals",
}: MultiImageUploadProps) {
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [images, setImages] = useState<string[]>(currentImages);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const syncUpdate = (newImages: string[]) => {
    setImages(newImages);
    onImagesChange(newImages);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setError(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }

    setError("");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tempIndex = images.length + i;
      setUploadingIndex(tempIndex);

      try {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadImageAction(formData, folder);

        if (result?.secure_url) {
          const newImages = [...images];
          newImages[tempIndex] = result.secure_url;
          syncUpdate(newImages);
        } else {
          setError("Failed to obtain image URL for one or more images.");
        }
      } catch (err) {
        setError("Failed to upload one or more images. Please try again.");
        console.error(err);
      }
    }

    setUploadingIndex(null);
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleAddUrl = () => {
    const url = urlInput.trim();
    if (!url) {
      setError("Please enter a valid image URL");
      return;
    }
    if (images.length >= maxImages) {
      setError(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }
    setError("");
    const newImages = [...images, url];
    syncUpdate(newImages);
    setUrlInput("");
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    syncUpdate(newImages);
    if (selectedIndex >= newImages.length) {
      setSelectedIndex(Math.max(0, newImages.length - 1));
    }
  };

  const handleSetPrimary = (index: number) => {
    const newImages = [...images];
    const [moved] = newImages.splice(index, 1);
    newImages.unshift(moved);
    syncUpdate(newImages);
    setSelectedIndex(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant="primary">
          {images.length} / {maxImages} Images Added
        </Badge>
        {images.length > 0 && (
          <span className="text-xs text-gray-500">
            First image is the cover / primary thumbnail
          </span>
        )}
      </div>

      {images.length > 0 && (
        <div className="space-y-3">
          <div className="relative w-full h-64 md:h-80 bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
            {images[selectedIndex] && (
              <Image
                src={images[selectedIndex]}
                alt={`Preview ${selectedIndex + 1}`}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute top-2 left-2">
              <Badge
                variant="primary"
                className="inline-flex items-center gap-1"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-3.5 h-3.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
                {selectedIndex === 0
                  ? "Primary (Cover)"
                  : `Image ${selectedIndex + 1}`}
              </Badge>
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              {selectedIndex !== 0 && (
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  onClick={() => handleSetPrimary(selectedIndex)}
                >
                  <span className="inline-flex items-center gap-1">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-4 h-4"
                    >
                      <path d="M12 2l2.9 6.1L21 9l-5 4.9L17.2 21 12 17.6 6.8 21 8 13.9 3 9l6.1-.9L12 2z" />
                    </svg>
                    Set Primary
                  </span>
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant="danger"
                onClick={() => handleRemoveImage(selectedIndex)}
              >
                <span className="inline-flex items-center gap-1">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-4 h-4"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                  </svg>
                  Remove
                </span>
              </Button>
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 p-1">
              {images.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                    index === selectedIndex
                      ? "border-emerald-500 ring-2 ring-emerald-300"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-emerald-600 text-white text-[10px] font-bold text-center py-0.5">
                      COVER
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {images.length < maxImages && (
        <>
          <div className="flex gap-2 border-b border-gray-200 pb-2">
            <button
              type="button"
              onClick={() => setUploadMode("file")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                uploadMode === "file"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload from PC
              </span>
            </button>
            <button
              type="button"
              onClick={() => setUploadMode("url")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                uploadMode === "url"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  <path d="M10 13a5 5 0 007.08 0l3-3a5 5 0 00-7.08-7.08l-1.3 1.3" />
                  <path d="M14 11a5 5 0 00-7.08 0l-3 3a5 5 0 007.08 7.08l1.3-1.3" />
                </svg>
                Paste Image URL
              </span>
            </button>
          </div>

          <div>
            {uploadMode === "file" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select images from computer (up to {maxImages - images.length}{" "}
                  more)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  disabled={uploadingIndex !== null}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700 bg-white"
                />
                {uploadingIndex !== null && (
                  <p className="text-sm text-emerald-600 mt-2 flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-4 h-4 animate-spin"
                    >
                      <path d="M21 12a9 9 0 11-9-9" />
                    </svg>
                    Uploading images to cloud...
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Web URL Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddUrl();
                      }
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleAddUrl}
                    disabled={images.length >= maxImages}
                  >
                    + Add Image
                  </Button>
                </div>
              </div>
            )}

            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>
        </>
      )}

      {images.length >= maxImages && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm text-amber-800 inline-flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9.5 12.5l1.5 1.5 3.5-3.5" />
          </svg>
          Maximum of {maxImages} images reached. Remove an image to add more.
        </div>
      )}
    </div>
  );
}
