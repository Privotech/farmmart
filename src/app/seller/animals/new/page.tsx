"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import MultiImageUpload from "@/components/MultiImageUpload";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { AlertTriangleIcon } from "@/components/ui/Icons";
import { AnimalsCategory } from "@/types";

function getListingQualityScore(
  formData: {
    name: string;
    category: string;
    breed: string;
    age: string;
    weight: string;
    price: string;
    description: string;
    location: string;
    state: string;
    isNegotiable: boolean;
  },
  imageCount: number,
) {
  const checks = [
    { key: "Photos", label: "Photos", weight: 2, passed: imageCount >= 3 },
    { key: "SomePhotos", label: "At least 1 photo", weight: 1, passed: imageCount >= 1 },
    { key: "Name", label: "Name / Title", weight: 1, passed: formData.name.trim().length >= 3 },
    { key: "Category", label: "Category", weight: 1, passed: !!formData.category },
    { key: "Breed", label: "Breed", weight: 1, passed: formData.breed.trim().length >= 2 },
    { key: "Age", label: "Age", weight: 1, passed: !!formData.age && Number(formData.age) > 0 },
    { key: "Weight", label: "Weight", weight: 1, passed: !!formData.weight && Number(formData.weight) > 0 },
    { key: "Price", label: "Price", weight: 2, passed: !!formData.price && Number(formData.price) > 0 },
    { key: "Description", label: "Description", weight: 2, passed: formData.description.trim().length >= 40 },
    { key: "HealthStatus", label: "Health status mention", weight: 1, passed: /health|vaccin|treat|sick|fit|sound|ok|good|okay|deworm|confirm/i.test(formData.description) },
    { key: "Location", label: "Location", weight: 1, passed: formData.location.trim().length >= 3 },
    { key: "State", label: "State", weight: 1, passed: formData.state.trim().length >= 2 },
  ];

  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const earnedWeight = checks.reduce((sum, c) => sum + (c.passed ? c.weight : 0), 0);
  const percentage = Math.round((earnedWeight / totalWeight) * 100);

  const displayChecks = [
    { key: "Photos", label: "Photos (3+)", passed: imageCount >= 3 },
    { key: "Price", label: "Price", passed: !!formData.price && Number(formData.price) > 0 },
    { key: "HealthStatus", label: "Health status", passed: /health|vaccin|treat|sick|fit|sound|ok|good|okay|deworm|confirm/i.test(formData.description) },
    { key: "Weight", label: "Weight", passed: !!formData.weight && Number(formData.weight) > 0 },
    { key: "Description", label: "Description (40+ chars)", passed: formData.description.trim().length >= 40 },
    { key: "Breed", label: "Breed", passed: formData.breed.trim().length >= 2 },
    { key: "Age", label: "Age", passed: !!formData.age && Number(formData.age) > 0 },
    { key: "Location", label: "Location / State", passed: (formData.location.trim().length >= 3) || (formData.state.trim().length >= 2) },
  ];

  let tier: { label: string; color: string; barColor: string; tips: string } = {
    label: "Needs work",
    color: "text-rose-600",
    barColor: "bg-rose-500",
    tips: "Add more details to help buyers decide.",
  };

  if (percentage >= 85) {
    tier = {
      label: "Excellent! ⭐",
      color: "text-emerald-700",
      barColor: "bg-emerald-500",
      tips: "Your listing is well-optimized — publish with confidence!",
    };
  } else if (percentage >= 65) {
    tier = {
      label: "Good ✓",
      color: "text-teal-700",
      barColor: "bg-teal-500",
      tips: "Almost there — top up the missing fields below for maximum reach.",
    };
  } else if (percentage >= 40) {
    tier = {
      label: "Fair",
      color: "text-amber-600",
      barColor: "bg-amber-500",
      tips: "Listings with more details sell 3× faster on FarmMart.",
    };
  }

  return { percentage, checks: displayChecks, tier };
}

function ListingQualityMeter({
  formData,
  imageCount,
}: {
  formData: {
    name: string;
    category: string;
    breed: string;
    age: string;
    weight: string;
    price: string;
    description: string;
    location: string;
    state: string;
    isNegotiable: boolean;
  };
  imageCount: number;
}) {
  const { percentage, checks, tier } = getListingQualityScore(formData, imageCount);

  return (
    <Card className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-200 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-emerald-900 inline-flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-600">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            Listing Quality Score
          </h3>
          <p className={`text-sm mt-1 ${tier.color}`}>{tier.tips}</p>
        </div>
        <div className="text-right">
          <span className={`text-4xl font-extrabold tracking-tight ${tier.color}`}>
            {percentage}%
          </span>
          <span className={`block text-sm font-semibold ${tier.color}`}>
            {tier.label}
          </span>
        </div>
      </div>

      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-4 shadow-inner">
        <div
          className={`h-full ${tier.barColor} transition-all duration-500 ease-out rounded-full shadow-sm`}
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex-1 border-r border-white/50 last:border-r-0" />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {checks.map((c) => (
          <span
            key={c.key}
            className={`inline-flex items-center gap-1.5 font-medium ${
              c.passed ? "text-primary" : "text-text-secondary"
            }`}
          >
            <span
              className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                c.passed
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-gray-300 bg-white text-gray-400"
              }`}
            >
              {c.passed ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <span className="text-[10px] font-bold leading-none">✗</span>
              )}
            </span>
            {c.label}
          </span>
        ))}
      </div>
    </Card>
  );
}

export default function NewAnimalPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "CATTLE" as AnimalsCategory,
    breed: "",
    age: "",
    weight: "",
    price: "",
    description: "",
    location: "",
    state: "",
    isNegotiable: false,
    termsAccepted: false,
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.termsAccepted) {
      setError(
        "You must agree to the seller terms: all communications and transactions must stay ON the FarmMart platform.",
      );
      return;
    }

    if (imageUrls.length === 0) {
      setError("Please upload at least one image of the animal.");
      return;
    }

    if (!session || !session.user) {
      setError("No active session found");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sellerId: session.user.id,
          images: JSON.stringify(imageUrls),
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert(
          "Animal listed successfully! Buyers will see your listing and can contact you ONLY through FarmMart's inquiry system.",
        );
        router.push("/seller/animals");
      } else {
        setError(result.error || "Failed to create listing");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            List New Animal
          </h1>
          <p className="text-gray-600">
            Add a new animal to your inventory. All fields marked with * are
            required.
          </p>
        </div>

        <Card className="border-2 border-rose-200 bg-rose-50/60 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-3xl flex-shrink-0 text-rose-500">
              <AlertTriangleIcon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-rose-900 mb-1">
                Seller Rules — Important Before You List
              </h3>
              <ul className="text-rose-800 text-sm space-y-1 list-disc list-inside">
                <li>
                  <strong>NO off-platform contact sharing</strong> — never
                  include WhatsApp numbers, emails, Facebook, or phone in
                  descriptions.
                </li>
                <li>
                  <strong>
                    All negotiations & payments must happen through FarmMart
                  </strong>{" "}
                  checkout / inquiries only.
                </li>
                <li>
                  Accounts found circumventing this rule will have their
                  verified status revoked and may be permanently banned.
                </li>
                <li>
                  <strong>Photos MUST be of the ACTUAL animal</strong> being
                  sold. Stock photos will be removed by moderation.
                </li>
                <li>
                  <Link href="/terms" className="underline font-medium">
                    Read full Terms & Conditions
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-4 h-4 inline-block ml-1"
                    >
                      <path d="M5 12h14" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <ListingQualityMeter formData={formData} imageCount={imageUrls.length} />

        <Card>
          {error && (
            <div className="bg-rose-100 text-rose-800 p-4 rounded-lg mb-6 border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-3 text-gray-900 border-b pb-2">
                <span className="inline-flex items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-5 h-5"
                  >
                    <path d="M3 7h3l1.5-2h8L17 7h3a2 2 0 012 2v9a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  Animal Photos ({imageUrls.length} added)
                </span>
              </h3>
              <MultiImageUpload
                onImagesChange={setImageUrls}
                currentImages={imageUrls}
                maxImages={10}
                folder="farmmart/animals"
              />
              <p className="text-xs text-gray-500 mt-2">
                Tip: Upload sharp, well-lit photos from multiple angles. At
                least 3 photos (front, side, and close-up) helps buyers make a
                decision.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
              <Input
                type="text"
                name="name"
                label="Animal Name / Title *"
                placeholder="e.g., Healthy Brown Fulani Bull"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  disabled={isLoading}
                >
                  <option value="CATTLE">Cattle (Cow, Bull, Ox)</option>
                  <option value="GOAT">Goat</option>
                  <option value="SHEEP">Sheep / Ram</option>
                  <option value="PIG">Pig / Hog</option>
                  <option value="POULTRY">
                    Poultry (Chicken, Turkey, etc.)
                  </option>
                  <option value="RABBIT">Rabbit</option>
                  <option value="HORSE">Horse</option>
                  <option value="OTHER">Other Livestock</option>
                </select>
              </div>

              <Input
                type="text"
                name="breed"
                label="Breed *"
                placeholder="e.g., White Fulani, Sokoto Gudali, N'dama..."
                value={formData.breed}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />

              <Input
                type="number"
                name="age"
                label="Age (months)"
                placeholder="e.g., 24"
                value={formData.age}
                onChange={handleInputChange}
                disabled={isLoading}
              />

              <Input
                type="number"
                name="weight"
                label="Weight (kg) - Optional"
                placeholder="e.g., 350"
                value={formData.weight}
                onChange={handleInputChange}
                disabled={isLoading}
              />

              <Input
                type="number"
                name="price"
                label="Price (₦) *"
                placeholder="e.g., 120000"
                value={formData.price}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />

              <Input
                type="text"
                name="location"
                label="Location / Address"
                placeholder="e.g., Farm 45, Abeokuta Expressway"
                value={formData.location}
                onChange={handleInputChange}
                disabled={isLoading}
              />

              <Input
                type="text"
                name="state"
                label="State *"
                placeholder="e.g., Ogun State"
                value={formData.state}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />

              <div className="md:col-span-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isNegotiable"
                  name="isNegotiable"
                  checked={formData.isNegotiable}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-5 h-5 text-emerald-600 rounded"
                />
                <label
                  htmlFor="isNegotiable"
                  className="text-sm font-medium text-gray-700"
                >
                  Price is negotiable (buyers can make offers via inquiry)
                </label>
                {formData.isNegotiable && (
                  <Badge variant="warning">Negotiable</Badge>
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
                placeholder={`Describe the animal in detail:\n- Health status, vaccinations history\n- Temperament, feeding habits\n- Purpose (breeding, meat, dairy, etc.)\n- Any special traits the buyer should know\n\nNOTE: Do NOT include your phone number, WhatsApp, email, Facebook, or any off-platform contact info here. Doing so will get your listing removed.`}
                required
                disabled={isLoading}
              />
            </div>

            <div className="border-t pt-6 bg-emerald-50 -mx-8 -mb-8 p-8 md:rounded-b-2xl">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  className="mt-1 w-5 h-5 text-emerald-600 rounded"
                />
                <span className="text-sm text-gray-800">
                  <strong className="text-gray-900">
                    I agree to FarmMart&apos;s Seller Rules and Terms
                  </strong>{" "}
                  — I will NOT share or ask for off-platform contact info
                  (WhatsApp, phone, email, social media, personal meetings). I
                  understand that if I communicate or transact outside FarmMart,
                  the platform bears NO responsibility if I receive fake
                  payments, chargebacks, or encounter any fraud. I confirm these
                  photos are of the actual animal I am selling and all
                  descriptions are accurate.
                </span>
              </label>
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="inline-flex items-center gap-2"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-5 h-5"
                >
                  <path d="M5 12V8a2 2 0 012-2h3l1-2h4l1 2h3a2 2 0 012 2v4" />
                  <path d="M5 12h14v3a3 3 0 01-3 3H8a3 3 0 01-3-3v-3z" />
                </svg>
                Publish Listing
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/seller/animals")}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
