"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CheckIcon, ClockIcon, XIcon, BanIcon } from "@/components/ui/Icons";
import ImageUpload from "@/components/ImageUpload";
import Image from "next/image";
import { submitSellerVerification } from "@/actions/users";
import { User } from "@/types";

export default function SellerSettingsClient({ seller }: { seller: User }) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    phone: seller.phone || "",
    state: seller.state || "",
    city: seller.city || "",
    address: seller.address || "",
    farmName: seller.farm_name || "",
    farmAddress: seller.farm_address || "",
    cacNumber: seller.cac_number || "",
    bio: seller.bio || "",
    documentType: seller.verification_document_type || "",
    documentUrl: seller.verification_document_url || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, documentUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.documentType) {
      setError("Please select a document type for verification");
      return;
    }
    if (!formData.documentUrl) {
      setError("Please upload or provide a URL for your verification document");
      return;
    }

    startTransition(async () => {
      const res = await submitSellerVerification({
        phone: formData.phone,
        state: formData.state,
        city: formData.city,
        address: formData.address,
        farmName: formData.farmName,
        farmAddress: formData.farmAddress,
        cacNumber: formData.cacNumber,
        bio: formData.bio,
        documentType: formData.documentType,
        documentUrl: formData.documentUrl,
      });

      if (res.success) {
        setSuccess(
          "Verification application submitted successfully! Awaiting admin review.",
        );
      } else {
        setError(res.error || "Failed to submit verification");
      }
    });
  };

  const getVerificationStatus = () => {
    if (seller.is_verified || seller.verification_status === "APPROVED") {
      return {
        badge: (
          <Badge variant="success" className="inline-flex items-center gap-1">
            <CheckIcon className="w-3.5 h-3.5" /> VERIFIED SELLER
          </Badge>
        ),
        title: "You are a Verified Seller!",
        description:
          "Your account has been verified. Buyers will see a verified badge on your listings. Continue to update your profile details below.",
        color: "bg-green-50 border-green-200 text-green-800",
      };
    }
    if (seller.verification_status === "PENDING") {
      return {
        badge: (
          <Badge variant="warning" className="inline-flex items-center gap-1">
            <ClockIcon className="w-3.5 h-3.5" /> PENDING ADMIN REVIEW
          </Badge>
        ),
        title: "Verification Under Review",
        description:
          "Your verification documents have been submitted and are being reviewed by our admin team. This usually takes 24-48 hours.",
        color: "bg-amber-50 border-amber-200 text-amber-800",
      };
    }
    if (seller.verification_status === "REJECTED") {
      return {
        badge: (
          <Badge variant="danger" className="inline-flex items-center gap-1">
            <XIcon className="w-3.5 h-3.5" /> VERIFICATION REJECTED
          </Badge>
        ),
        title: "Verification Application Rejected",
        description:
          "Your verification was rejected. Please review the requirements and re-submit valid documents. See admin notes below.",
        color: "bg-rose-50 border-rose-200 text-rose-800",
      };
    }
    if (seller.verification_status === "SUSPENDED") {
      return {
        badge: (
          <Badge variant="danger" className="inline-flex items-center gap-1">
            <BanIcon className="w-3.5 h-3.5" /> ACCOUNT SUSPENDED
          </Badge>
        ),
        title: "Your Seller Account is Suspended",
        description:
          "Your seller privileges have been suspended. Please contact support for assistance.",
        color: "bg-rose-50 border-rose-200 text-rose-800",
      };
    }
    return {
      badge: <Badge variant="secondary">NOT VERIFIED</Badge>,
      title: "Become a Verified Seller",
      description:
        "Submit your identification documents to get verified. Verified sellers get higher trust from buyers, priority placement in search, and reduced platform fees!",
      color: "bg-gray-50 border-gray-200 text-gray-800",
    };
  };

  const status = getVerificationStatus();

  return (
    <div className="seller-settings space-y-6">
      <Card className={`border-2 ${status.color}`}>
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="flex-1">
            <div className="mb-2">{status.badge}</div>
            <h3 className="text-xl font-bold mb-1">{status.title}</h3>
            <p className="text-sm opacity-90">{status.description}</p>
            {seller.verification_notes && (
              <div className="mt-3 p-3 bg-white/60 rounded-lg border">
                <div className="text-xs font-semibold opacity-70 mb-1">
                  Admin Notes:
                </div>
                <p className="font-medium">{seller.verification_notes}</p>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 flex flex-col gap-2 text-sm">
            {seller.verified_at && (
              <div className="font-medium">
                Verified:{" "}
                {new Date(seller.verified_at as string).toLocaleDateString()}
              </div>
            )}
            {seller.verification_document_type && (
              <div>
                <span className="opacity-70">Document:</span>{" "}
                <span className="font-medium">
                  {seller.verification_document_type}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {error && (
        <div className="bg-rose-100 text-rose-800 p-4 rounded-lg border border-rose-200">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg border border-green-200">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h3 className="text-xl font-bold mb-4 text-gray-900">
            Profile Information
          </h3>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden border-2 border-emerald-200">
              {seller.avatar_url ? (
                <Image
                  src={seller.avatar_url}
                  alt={seller.name}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              ) : (
                <span className="text-emerald-700 font-bold text-3xl">
                  {seller.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <div className="font-bold text-lg text-gray-900">
                {seller.name}
              </div>
              <div className="text-gray-500 text-sm">{seller.email}</div>
              <div className="text-gray-400 text-xs">
                Member since:{" "}
                {seller.created_at
                  ? new Date(seller.created_at as string).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +234 801 234 5678"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Lagos"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City / LGA
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Ikeja"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Residential Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. 123 Farm Road"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seller Bio (Introduce yourself to buyers)
            </label>
            <textarea
              rows={4}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell buyers about your farming experience, your farm, breeds you specialize in, and any certifications..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-bold mb-4 text-gray-900">
            Farm / Business Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farm / Business Name
              </label>
              <input
                type="text"
                name="farmName"
                value={formData.farmName}
                onChange={handleChange}
                placeholder="e.g. Greenfield Livestock Farms"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CAC Registration Number (Optional)
              </label>
              <input
                type="text"
                name="cacNumber"
                value={formData.cacNumber}
                onChange={handleChange}
                placeholder="e.g. RC 1234567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Farm Address
            </label>
            <input
              type="text"
              name="farmAddress"
              value={formData.farmAddress}
              onChange={handleChange}
              placeholder="Full physical address of your farm / business premises"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-bold mb-2 text-gray-900">
            Verification Documents
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Upload a valid government-issued ID to verify your identity. This
            document will only be seen by FarmMart admins and NEVER shared with
            buyers.
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type <span className="text-rose-600">*</span>
            </label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">Select document type...</option>
              <option value="NATIONAL_ID">National ID Card (NIN slip)</option>
              <option value="PASSPORT">International Passport</option>
              <option value="DRIVERS_LICENSE">Drivers License (FRSC)</option>
              <option value="VOTERS_CARD">Permanent Voters Card (PVC)</option>
              <option value="CAC">CAC Business Registration Certificate</option>
              <option value="UTILITY_BILL">
                Utility Bill + Selfie (for address verification)
              </option>
            </select>
          </div>

          <ImageUpload
            onImageUpload={handleDocumentUpload}
            currentImage={formData.documentUrl}
          />

          {seller.verification_document_url &&
            formData.documentUrl === seller.verification_document_url && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                <span className="text-xs text-gray-500">
                  Currently uploaded document:{" "}
                </span>
                <a
                  href={seller.verification_document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-600 underline font-medium"
                >
                  View Current Document →
                </a>
              </div>
            )}
        </Card>

        <div className="bg-emerald-50 border-2 border-emerald-200 p-5 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="text-2xl text-emerald-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-6 h-6"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-emerald-900 mb-1">
                Benefits of Getting Verified:
              </h4>
              <ul className="text-emerald-800 text-sm space-y-1 list-disc list-inside">
                <li>
                  <strong>Trust Badge</strong> on all your listings — buyers pay
                  more for verified sellers
                </li>
                <li>
                  <strong>Priority Ranking</strong> in search results and
                  category pages
                </li>
                <li>
                  Reduced platform fee from 5% to <strong>3%</strong> on all
                  sales
                </li>
                <li>
                  Access to premium advertising and featured listing slots
                </li>
                <li>Faster dispute resolution and priority customer support</li>
                <li>
                  Eligibility for FarmMart&apos;s bulk logistics discount
                  program
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.location.reload()}
          >
            Reset Changes
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isPending}
          >
            {seller.verification_status === "PENDING"
              ? "Re-submit Verification"
              : "Submit For Verification"}
          </Button>
        </div>
      </form>
    </div>
  );
}
