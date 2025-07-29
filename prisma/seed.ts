import { PrismaClient, Unit } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  await db.order.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();

  await db.category.createMany({
    data: [
      { id: "cereales", name: "Céréales", color:"#fedada" },
      { id: "fruits-secs", name: "Fruits secs", color:"#faffde" },
      { id: "epices", name: "Épices", color:"#cfdd" },
      { id: "miel", name: "Miel", color:"#234568" },
      { id: "cafe", name: "Café", color:"#f3ee" },
    ],
  });

  await db.product.createMany({
    data: [
      {
        name: "Riz rouge de Madagascar",
        description: "Riz local cultivé sur les hauts plateaux, 1kg.",
        priceInCents: 2500,
        imagePath: "/products/riz-rouge.jpg",
        stock: 120,
        unit: Unit.KG,
        categoryId: "cereales",
      },
      {
        name: "Mangues séchées",
        description: "Mangues séchées artisanales sans sucre ajouté, 200g.",
        priceInCents: 3000,
        imagePath: "/products/mangue-sechee.jpg",
        stock: 80,
        unit: Unit.GRAM,
        categoryId: "fruits-secs",
      },
      {
        name: "Poivre noir en grain",
        description: "Poivre noir entier, origine Sambava, 100g.",
        priceInCents: 2000,
        imagePath: "/products/poivre.jpg",
        stock: 60,
        unit: Unit.GRAM,
        categoryId: "epices",
      },
      {
        name: "Miel sauvage bio",
        description: "Miel 100% naturel récolté dans la forêt sèche.",
        priceInCents: 4000,
        imagePath: "/products/miel.jpg",
        stock: 50,
        unit: Unit.LITER,
        categoryId: "miel",
      },
      {
        name: "Café Arabica moulu",
        description: "Café Arabica moulu, torréfaction artisanale, 250g.",
        priceInCents: 3500,
        imagePath: "/products/cafe.jpg",
        stock: 100,
        unit: Unit.GRAM,
        categoryId: "cafe",
      },
    ],
  });

  console.log("✅ Seeding terminé");
}

main()
  .catch((err) => {
    console.error("❌ Erreur de seed:", err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
