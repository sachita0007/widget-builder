import { PrismaClient } from "../generated/prisma/index.js";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await db.review.deleteMany();
  await db.widget.deleteMany();

  // --- WHISKAS ---
  const whiskasId = "whiskas-july-2025";

  await db.widget.create({
    data: {
      name: "Whiskas Homepage Feed",
      campaignId: whiskasId,
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

  await db.review.createMany({
    data: [
      { rating: 5, reviewer: "Arnav Sharma", text: "We used to feed home cooked food but Whiskas is much easier and my 2-year-old Persian cat loved it! Her coat is much shinier now.", campaignId: whiskasId },
      { rating: 5, reviewer: "Ananya Gupta", text: "My 10-month-old kitten meows for Whiskas every morning. It's so much more convenient than preparing fresh chicken every day.", campaignId: whiskasId },
      { rating: 4, reviewer: "Vikram Malhotra", text: "Switched from local butcher meat to Whiskas for my adult cat. He's much more active and his digestion has improved significantly.", campaignId: whiskasId },
      { rating: 5, reviewer: "Priya Das", text: "Best value for money. My cat was a fussy eater with home food, but she finished her bowl of Whiskas in seconds!", campaignId: whiskasId },
      { rating: 5, reviewer: "Ishaan Verma", text: "Great quality ingredients. You can tell they care about feline nutrition. My 3-year-old Indie cat is thriving.", campaignId: whiskasId },
      { rating: 4, reviewer: "Rahul Mehra", text: "Good quality, but wish the packaging was resealable. My cat loves the taste though, better than the home cooked fish we used to give.", campaignId: whiskasId },
      { rating: 5, reviewer: "Sanya Iyer", text: "Whiskas has been a game changer for my senior cat. She used to struggle with dry home food, but the wet Whiskas pouches are perfect.", campaignId: whiskasId },
      { rating: 5, reviewer: "Aavya Reddy", text: "I was skeptical about packaged food, but my vet recommended Whiskas. My 6-month-old kitten is growing so fast and healthy!", campaignId: whiskasId },
      { rating: 4, reviewer: "Karan Singh", text: "Convenient and my cat loves it. Definitely easier than boiling chicken every day for him.", campaignId: whiskasId },
      { rating: 5, reviewer: "Meera Nair", text: "The variety of flavors in Whiskas keeps my cat interested. He never got this excited for home cooked meals.", campaignId: whiskasId },
      { rating: 5, reviewer: "Aditya Joshi", text: "Affordable and nutritious. My cat's energy levels have been amazing since we switched to Whiskas.", campaignId: whiskasId },
      { rating: 4, reviewer: "Riya Kapoor", text: "My kitten's fur feels much softer after a month on Whiskas. Great product for young cats.", campaignId: whiskasId },
      { rating: 5, reviewer: "Zoya Khan", text: "Perfect portion sizes. No more wasting food like we did with home prepared meals. My cat loves the gravy!", campaignId: whiskasId },
      { rating: 5, reviewer: "Kabir Bhat", text: "Only Whiskas keeps him energetic all day. He's a very active 4-year-old and this food supports him well.", campaignId: whiskasId },
      { rating: 4, reviewer: "Diya Saxena", text: "Great alternative to home cooked food. My cat is much happier and less bloated now.", campaignId: whiskasId },
      { rating: 5, reviewer: "Vivaan Shah", text: "Simple to serve and my cat loves every bit. The home cooked food transition was surprisingly easy.", campaignId: whiskasId },
      { rating: 5, reviewer: "Kiara Bose", text: "Excellent for kittens. My little one has reached all her growth milestones perfectly on Whiskas.", campaignId: whiskasId },
      { rating: 4, reviewer: "Aryan Pillai", text: "High quality cat food. My cat prefers this over any home cooked meal I've tried to make.", campaignId: whiskasId },
      { rating: 5, reviewer: "Myra Ghose", text: "Whiskas is the only brand my picky eater will touch. So glad we found something she enjoys!", campaignId: whiskasId },
      { rating: 5, reviewer: "Devansh Tyagi", text: "A must-have for cat owners. Nutrient rich and very palatable for cats of all ages.", campaignId: whiskasId },
    ],
  });

  // --- PEDIGREE ---
  const pedigreeId = "pedigree-aug-2025";

  await db.widget.create({
    data: {
      name: "Pedigree Trust Card",
      campaignId: pedigreeId,
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

  await db.review.createMany({
    data: [
      { rating: 5, reviewer: "Abhishek Kumar", text: "My 5-year-old Labrador has been on Pedigree since he was a puppy. His coat is shiny and he's full of energy!", campaignId: pedigreeId },
      { rating: 4, reviewer: "Sneha Patel", text: "Switched to Pedigree for my 2-year-old German Shepherd. He finished the bowl in seconds! His digestion has improved.", campaignId: pedigreeId },
      { rating: 5, reviewer: "Rohan Mehta", text: "The only brand I trust for my 7-year-old Golden Retriever. His joint health is excellent even at this age.", campaignId: pedigreeId },
      { rating: 5, reviewer: "Divya Krishnan", text: "My 3-year-old Indie dog loves Pedigree. His teeth are healthy and his energy levels are perfect.", campaignId: pedigreeId },
      { rating: 4, reviewer: "Aarav Desai", text: "Good value for money. My 1-year-old Beagle is growing well and his coat is beautiful.", campaignId: pedigreeId },
    ],
  });

  // --- DOVE ---
  const doveId = "dove-skincare-2025";

  await db.widget.create({
    data: {
      name: "Dove Product Grid",
      campaignId: doveId,
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

  await db.review.createMany({
    data: [
      { rating: 5, reviewer: "Nisha Agarwal", text: "I've been using Dove for 3 years now. My skin feels softer and more hydrated, especially during Mumbai's humid weather.", campaignId: doveId },
      { rating: 5, reviewer: "Pooja Sharma", text: "Doesn't irritate my sensitive skin at all. Perfect for daily use and my skin looks healthier.", campaignId: doveId },
      { rating: 4, reviewer: "Kavya Menon", text: "Great moisturizing soap. My skin used to be very dry but after 6 months of using Dove, it's much better.", campaignId: doveId },
      { rating: 5, reviewer: "Ritika Bansal", text: "Gentle on skin and the fragrance is subtle. My dermatologist recommended it and I've seen real improvement.", campaignId: doveId },
    ],
  });

  // --- PEPSI ---
  const pepsiId = "pepsi-summer-2025";

  await db.widget.create({
    data: {
      name: "Pepsi Test Widget",
      campaignId: pepsiId,
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

  console.log("Seeding completed!");
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
