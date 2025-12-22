
import { PrismaClient } from "../generated/prisma/index.js";

const db = new PrismaClient();

async function main() {
    console.log("Seeding database with extensive dummy data...");

    // 1. Ensure Demo User exists
    let user = await db.user.findFirst({
        where: { email: "demo@freestand.in" }
    });

    if (!user) {
        user = await db.user.create({
            data: {
                name: "Demo User",
                email: "demo@freestand.in",
            },
        });
        console.log("Created demo user:", user.id);
    } else {
        console.log("Using existing user:", user.id);
    }

    // Clear existing data to avoid duplicates if needed, but for now we just create.

    // --- CAMPAIGN 1: WHISKAS ---
    const whiskas = await db.campaign.create({
        data: {
            name: "Whiskas July 2025",
            brand: "Whiskas",
            status: "Active",
            createdById: user.id,
            personas: {
                create: [
                    // Rating Personas
                    { label: "High Satisfaction", rating: 5, count: 11306, brand: "Whiskas", foodType: "Packaged Pet Food", catAge: "Between 1-7 Years", boughtFrom: "Nearest Retailer", issue: "None" },
                    { label: "Positive Experience", rating: 4, count: 4131, brand: "Whiskas", foodType: "Dry Food", catAge: "Less than 12 Months", boughtFrom: "Amazon", issue: "None" },
                    { label: "Neutral Feeders", rating: 3, count: 1246, brand: "Other", foodType: "Mix of Dry and Wet Food", catAge: "Between 1-7 Years", boughtFrom: "Blinkit", issue: "None" },
                    { label: "Lower Satisfaction", rating: 2, count: 422, brand: "Whiskas", foodType: "Dry Food", catAge: "7+ Years", boughtFrom: "Nearest Retailer", issue: "My Cat did not eat it" },
                    { label: "Negative Feedback", rating: 1, count: 880, brand: "Whiskas", foodType: "Dry Food", catAge: "Less than 12 Months", boughtFrom: "Amazon", issue: "Delivery Package Issue" },

                    // Demographic Personas (Additional counts to match your stats)
                    { label: "Home Cooked Segment", rating: 5, count: 48696, brand: "None", foodType: "Home Cooked Food", catAge: "Less than 12 Months", boughtFrom: "None", issue: "None" },
                    { label: "Loyal Purepet Users", rating: 4, count: 10141, brand: "Purepet", foodType: "Dry Food", catAge: "Between 1-7 Years", boughtFrom: "Nearest Retailer", issue: "None" },
                    { label: "Drools Switchers", rating: 4, count: 9606, brand: "Drools", foodType: "Dry Food", catAge: "Between 1-7 Years", boughtFrom: "Amazon", issue: "None" },
                    { label: "Me-O Community", rating: 5, count: 7576, brand: "Me-O", foodType: "Dry Food", catAge: "Between 1-7 Years", boughtFrom: "Nearest Retailer", issue: "None" },
                    { label: "Retail Preference Group", rating: 5, count: 6559, brand: "Whiskas", foodType: "Wet Food", catAge: "Between 1-7 Years", boughtFrom: "Nearest Retailer", issue: "None" }
                ]
            },
            reviews: {
                create: [
                    { rating: 5, reviewer: "Maria Lopez", text: "My tabby cat absolutely loves this food. Her coat is shinier than ever!" },
                    { rating: 5, reviewer: "Sarah Jenkins", text: "Subscription on Amazon is a lifesaver. Never run out of food now." },
                    { rating: 4, reviewer: "Amit Verma", text: "Good quality, but wish the packaging was resealable." },
                    { rating: 5, reviewer: "Priya Das", text: "Best value for money in the premium segment." },
                    { rating: 5, reviewer: "Jonathan Doe", text: "Great quality ingredients. You can tell they care about nutrition." },
                    { rating: 5, reviewer: "Emily Rogers", text: "Best purchase for my kitten. She meows for it every morning!" }
                ]
            }
        }
    });

    await db.widget.create({
        data: {
            name: "Whiskas Homepage Feed",
            campaignId: whiskas.id,
            template: "GOOGLE",
            settings: {
                primaryColor: "#5D2D88",
                secondaryColor: "#ffffff",
                cornerRadius: "rounded-xl",
                fontStyle: "sans",
                showBadge: true
            }
        }
    });

    // --- CAMPAIGN 2: PEDIGREE ---
    const pedigree = await db.campaign.create({
        data: {
            name: "Pedigree August 2025",
            brand: "Pedigree",
            status: "Active",
            createdById: user.id,
            personas: {
                create: [
                    { label: "Dog Lovers (Mumbai)", rating: 5, count: 8900, brand: "Pedigree", foodType: "Dry", catAge: "Adult", boughtFrom: "PetShop", issue: "None" }
                ]
            },
            reviews: {
                create: [
                    { rating: 5, reviewer: "John Doe", text: "Classic Pedigree quality. My lab is energetic and has a great coat." },
                    { rating: 4, reviewer: "Jane Smith", text: "He finished the bowl in seconds! Recommended." },
                    { rating: 5, reviewer: "Rockie R.", text: "The only brand I trust for my golden retriever." },
                    { rating: 3, reviewer: "Doge Much", text: "It's okay, but the smell is quite strong." },
                    { rating: 5, reviewer: "Bark Bark", text: "WOOF WOOF (Translation: I love it!)" }
                ]
            }
        }
    });

    await db.widget.create({
        data: {
            name: "Pedigree Trust Card",
            campaignId: pedigree.id,
            template: "AGGREGATED",
            settings: {
                primaryColor: "#EAB308",
                secondaryColor: "#FFFBEB",
                cornerRadius: "rounded-lg",
                fontStyle: "serif",
                showBadge: true
            }
        }
    });

    // --- CAMPAIGN 3: DOVE ---
    const dove = await db.campaign.create({
        data: {
            name: "Dove Skin Care 2025",
            brand: "Dove",
            status: "Scheduled",
            createdById: user.id,
            reviews: {
                create: [
                    { rating: 5, reviewer: "Elena G.", text: "Softest skin I've had in years. The moisture is real." },
                    { rating: 5, reviewer: "Chris P.", text: "Doesn't irritate my sensitive skin. A staple in my shower." },
                    { rating: 5, reviewer: "Markus S.", text: "Great scent, not too overpowering." },
                    { rating: 4, reviewer: "Sophie T.", text: "A bit pricier than others but worth it for the quality." }
                ]
            }
        }
    });

    await db.widget.create({
        data: {
            name: "Dove Product Grid",
            campaignId: dove.id,
            template: "IMAGE",
            settings: {
                primaryColor: "#003087",
                secondaryColor: "#F0F9FF",
                cornerRadius: "rounded-3xl",
                fontStyle: "sans",
                showBadge: true
            }
        }
    });

    // --- CAMPAIGN 4: PEPSI (Empty for testing) ---
    const pepsi = await db.campaign.create({
        data: {
            name: "Pepsi Summer Blast",
            brand: "Pepsi",
            status: "Active",
            createdById: user.id
        }
    });

    await db.widget.create({
        data: {
            name: "Pepsi Test Widget",
            campaignId: pepsi.id,
            template: "GOOGLE",
            settings: {
                primaryColor: "#005CB4",
                secondaryColor: "#ffffff",
                cornerRadius: "rounded-md",
                fontStyle: "mono",
                showBadge: true
            }
        }
    });

    console.log("Seeding completed successfully!");
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
