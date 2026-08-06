import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ANIMAL_CATEGORIES = [
  "CATTLE",
  "GOAT",
  "SHEEP",
  "PIG",
  "POULTRY",
  "RABBIT",
  "HORSE",
  "OTHER",
] as const;

type AnimalCategory = (typeof ANIMAL_CATEGORIES)[number];

const BREEDS: Record<AnimalCategory, string[]> = {
  CATTLE: ["White Fulani", "Red Bororo", "Sokoto Gudali", "Muturu", "Angus"],
  GOAT: ["Red Sokoto", "West African Dwarf", "Boer", "Kano Brown"],
  SHEEP: ["Balami", "Yankasa", "Uda", "West African Dwarf Sheep"],
  PIG: ["Large White", "Landrace", "Duroc"],
  POULTRY: ["Broiler", "Noiler", "Layer", "Turkey", "Cockerel"],
  RABBIT: ["Chinchilla", "New Zealand White", "Dutch"],
  HORSE: ["Arewa Local", "Sudan Stallion"],
  OTHER: ["Standard"],
};

const NIGERIAN_STATES = [
  "Oyo",
  "Ogun",
  "Kano",
  "Kaduna",
  "Lagos",
  "Plateau",
  "Benue",
  "Enugu",
];

async function main() {
  console.log("Starting database seeding...");

  // Fetch the MOST RECENTLY created SELLER user
  const seller = await prisma.users.findFirst({
    where: { role: "SELLER" },
    orderBy: { created_at: "desc" },
  });

  if (!seller) {
    console.error(
      "No SELLER account found in the database. Please create a seller account first.",
    );
    return;
  }

  console.log(
    `👤 Adding 50 listings to Seller: ${seller.name} (${seller.email})`,
  );

  const listingsToCreate = [];

  for (let i = 1; i <= 50; i++) {
    const category =
      ANIMAL_CATEGORIES[Math.floor(Math.random() * ANIMAL_CATEGORIES.length)];
    const breedsList = BREEDS[category] || ["Standard"];
    const breed = breedsList[Math.floor(Math.random() * breedsList.length)];
    const state =
      NIGERIAN_STATES[Math.floor(Math.random() * NIGERIAN_STATES.length)];
    const price = (Math.floor(Math.random() * 450) + 50) * 1000; // ₦50,000 to ₦500,000

    listingsToCreate.push({
      name: `Healthy ${breed} ${category.toLowerCase()}`,
      category: category as any,
      breed,
      age: Math.floor(Math.random() * 24) + 6,
      weight: Math.floor(Math.random() * 150) + 20,
      price,
      description: `Premium quality ${breed} ${category.toLowerCase()} raised on balanced organic feed. Fully vaccinated and ready for immediate delivery or pickup.`,
      images:
        "https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&q=80&w=800",
      status: "AVAILABLE" as const,
      location: `${state} Farm Zone`,
      state,
      is_negotiable: Math.random() > 0.5,
      seller_id: seller.id,
    });
  }

  // Bulk insert 50 records
  await prisma.animals.createMany({
    data: listingsToCreate,
  });

  console.log("Successfully added 50 listings!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
