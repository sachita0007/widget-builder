
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

    // Clear existing data to avoid duplicates for the specific demo user
    console.log("Cleaning up existing data for campaigns...");
    await db.review.deleteMany({ where: { campaign: { createdById: user.id } } });
    await db.persona.deleteMany({ where: { campaign: { createdById: user.id } } });
    await db.widget.deleteMany({ where: { campaign: { createdById: user.id } } });
    await db.campaign.deleteMany({ where: { createdById: user.id } });

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
                    { rating: 5, reviewer: "Arnav Sharma", text: "We used to feed home cooked food but Whiskas is much easier and my 2-year-old Persian cat loved it! Her coat is much shinier now." },
                    { rating: 5, reviewer: "Ananya Gupta", text: "My 10-month-old kitten meows for Whiskas every morning. It's so much more convenient than preparing fresh chicken every day." },
                    { rating: 4, reviewer: "Vikram Malhotra", text: "Switched from local butcher meat to Whiskas for my adult cat. He's much more active and his digestion has improved significantly." },
                    { rating: 5, reviewer: "Priya Das", text: "Best value for money. My cat was a fussy eater with home food, but she finished her bowl of Whiskas in seconds!" },
                    { rating: 5, reviewer: "Ishaan Verma", text: "Great quality ingredients. You can tell they care about feline nutrition. My 3-year-old Indie cat is thriving." },
                    { rating: 4, reviewer: "Rahul Mehra", text: "Good quality, but wish the packaging was resealable. My cat loves the taste though, better than the home cooked fish we used to give." },
                    { rating: 5, reviewer: "Sanya Iyer", text: "Whiskas has been a game changer for my senior cat. She used to struggle with dry home food, but the wet Whiskas pouches are perfect." },
                    { rating: 5, reviewer: "Aavya Reddy", text: "I was skeptical about packaged food, but my vet recommended Whiskas. My 6-month-old kitten is growing so fast and healthy!" },
                    { rating: 4, reviewer: "Karan Singh", text: "Convenient and my cat loves it. Definitely easier than boiling chicken every day for him." },
                    { rating: 5, reviewer: "Meera Nair", text: "The variety of flavors in Whiskas keeps my cat interested. He never got this excited for home cooked meals." },
                    { rating: 5, reviewer: "Aditya Joshi", text: "Affordable and nutritious. My cat's energy levels have been amazing since we switched to Whiskas." },
                    { rating: 4, reviewer: "Riya Kapoor", text: "My kitten's fur feels much softer after a month on Whiskas. Great product for young cats." },
                    { rating: 5, reviewer: "Zoya Khan", text: "Perfect portion sizes. No more wasting food like we did with home prepared meals. My cat loves the gravy!" },
                    { rating: 5, reviewer: "Kabir Bhat", text: "Only Whiskas keeps him energetic all day. He's a very active 4-year-old and this food supports him well." },
                    { rating: 4, reviewer: "Diya Saxena", text: "Great alternative to home cooked food. My cat is much happier and less bloated now." },
                    { rating: 5, reviewer: "Vivaan Shah", text: "Simple to serve and my cat loves every bit. The home cooked food transition was surprisingly easy." },
                    { rating: 5, reviewer: "Kiara Bose", text: "Excellent for kittens. My little one has reached all her growth milestones perfectly on Whiskas." },
                    { rating: 4, reviewer: "Aryan Pillai", text: "High quality cat food. My cat prefers this over any home cooked meal I've tried to make." },
                    { rating: 5, reviewer: "Myra Ghose", text: "Whiskas is the only brand my picky eater will touch. So glad we found something she enjoys!" },
                    { rating: 5, reviewer: "Devansh Tyagi", text: "A must-have for cat owners. Nutrient rich and very palatable for cats of all ages." }
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
                    { rating: 5, reviewer: "Abhishek Kumar", text: "My 5-year-old Labrador has been on Pedigree since he was a puppy. His coat is shiny and he's full of energy!" },
                    { rating: 4, reviewer: "Sneha Patel", text: "Switched to Pedigree for my 2-year-old German Shepherd. He finished the bowl in seconds! His digestion has improved." },
                    { rating: 5, reviewer: "Rohan Mehta", text: "The only brand I trust for my 7-year-old Golden Retriever. His joint health is excellent even at this age." },
                    { rating: 5, reviewer: "Divya Krishnan", text: "My 3-year-old Indie dog loves Pedigree. His teeth are healthy and his energy levels are perfect." },
                    { rating: 4, reviewer: "Aarav Desai", text: "Good value for money. My 1-year-old Beagle is growing well and his coat is beautiful." }
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
                    { rating: 5, reviewer: "Nisha Agarwal", text: "I've been using Dove for 3 years now. My skin feels softer and more hydrated, especially during Mumbai's humid weather." },
                    { rating: 5, reviewer: "Pooja Sharma", text: "Doesn't irritate my sensitive skin at all. Perfect for daily use and my skin looks healthier." },
                    { rating: 4, reviewer: "Kavya Menon", text: "Great moisturizing soap. My skin used to be very dry but after 6 months of using Dove, it's much better." },
                    { rating: 5, reviewer: "Ritika Bansal", text: "Gentle on skin and the fragrance is subtle. My dermatologist recommended it and I've seen real improvement." }
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

    // --- CAMPAIGN 4: PEPSI ---
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
