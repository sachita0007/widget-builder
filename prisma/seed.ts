import { PrismaClient } from "../generated/prisma/index.js";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await db.widget.deleteMany();

  // --- WHISKAS ---
  await db.widget.create({
    data: {
      name: "Whiskas Homepage Feed",
      campaignId: "whiskas-july-2025",
      template: "GOOGLE",
      settings: {
        primaryColor: "#5D2D88",
        secondaryColor: "#ffffff",
        cornerRadius: "rounded-xl",
        fontStyle: "sans",
        showBadge: true,
      },
    },
  });

  // --- PEDIGREE ---
  await db.widget.create({
    data: {
      name: "Pedigree Trust Card",
      campaignId: "pedigree-aug-2025",
      template: "AGGREGATED",
      settings: {
        primaryColor: "#EAB308",
        secondaryColor: "#FFFBEB",
        cornerRadius: "rounded-lg",
        fontStyle: "serif",
        showBadge: true,
      },
    },
  });

  // --- DOVE ---
  await db.widget.create({
    data: {
      name: "Dove Product Grid",
      campaignId: "dove-skincare-2025",
      template: "IMAGE",
      settings: {
        primaryColor: "#003087",
        secondaryColor: "#F0F9FF",
        cornerRadius: "rounded-3xl",
        fontStyle: "sans",
        showBadge: true,
      },
    },
  });

  // --- PEPSI ---
  await db.widget.create({
    data: {
      name: "Pepsi Test Widget",
      campaignId: "pepsi-summer-2025",
      template: "GOOGLE",
      settings: {
        primaryColor: "#005CB4",
        secondaryColor: "#ffffff",
        cornerRadius: "rounded-md",
        fontStyle: "mono",
        showBadge: true,
      },
    },
  });

  console.log("Seeding completed! (Reviews come from Go backend)");
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
