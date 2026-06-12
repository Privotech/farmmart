import Link from "next/link";

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-[#F9FBF4] py-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
          Our Vision
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Coming soon - See our vision for the future of agriculture.
        </p>
        <div className="flex justify-center">
          <Link href="/" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
