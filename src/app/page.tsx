import Link from "next/link";
import { AnimalCard } from "@/components/features/AnimalCard";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const latestAnimals = await prisma.animals.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { created_at: "desc" },
    take: 6,
    include: { users: true },
  });

  const listings = latestAnimals.map((animal) => ({
    ...animal,
    price: Number(animal.price),
    weight: animal.weight ? Number(animal.weight) : null,
  }));

  return (
    <div className="min-h-screen bg-[#071a14] text-emerald-50">
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-950 via-emerald-900 to-[#071a14]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(52,211,153,0.18),_transparent_45%)]" />
        <div className="relative container mx-auto px-4 py-24 text-center sm:py-32">
          <p className="mb-5 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200">
            Nigeria&apos;s trusted livestock marketplace
          </p>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Buy verified livestock from trusted Nigerian farmers
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-emerald-100/80">
            Find quality cattle, goats, sheep, poultry, and more. Shop with
            confidence, pay securely, and arrange delivery in one place.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/buyer/listings"
              className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-emerald-950 shadow-lg transition hover:bg-emerald-400"
            >
              Browse Livestock
            </Link>
            <Link
              href="/register?role=SELLER"
              className="rounded-lg border border-emerald-300/60 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#0a2119] py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">Simple and secure</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">How FarmMart works</h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              ["1", "Browse", "Explore available livestock and compare verified seller listings."],
              ["2", "Pay securely", "Complete your purchase securely through Paystack."],
              ["3", "Get delivered", "Confirm delivery details and track your order through to handover."],
            ].map(([number, title, description]) => (
              <article key={number} className="rounded-2xl border border-emerald-800 bg-emerald-950/60 p-7">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 font-bold text-emerald-950">
                  {number}
                </span>
                <h3 className="mt-5 text-xl font-bold text-white">{title}</h3>
                <p className="mt-2 leading-7 text-emerald-100/70">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">Available now</p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Latest livestock listings</h2>
            </div>
            <Link href="/buyer/listings" className="font-semibold text-emerald-300 transition hover:text-emerald-200">
              View all livestock &rarr;
            </Link>
          </div>

          {listings.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {listings.map((animal) => (
                <AnimalCard key={animal.id} animal={animal} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-emerald-800 bg-emerald-950/50 p-10 text-center">
              <h3 className="text-xl font-bold text-white">New livestock listings are coming soon</h3>
              <p className="mt-2 text-emerald-100/70">Be among the first farmers to list your animals on FarmMart.</p>
              <Link href="/register?role=SELLER" className="mt-6 inline-flex rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-emerald-950 transition hover:bg-emerald-400">
                Start Selling
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-emerald-800 bg-emerald-950/70 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Have livestock to sell?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100/75">
            Reach serious buyers with clear listings, secure payments, and order management built for livestock sellers.
          </p>
          <Link href="/register?role=SELLER" className="mt-7 inline-flex rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-emerald-950 transition hover:bg-emerald-400">
            Create a seller account
          </Link>
        </div>
      </section>
    </div>
  );
}
