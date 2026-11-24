import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  handler: async (ctx) => {
    // 1. Restaurant Details
    const existingRestaurant = await ctx.db.query("restaurants").first();
    if (!existingRestaurant) {
      await ctx.db.insert("restaurants", {
        name: "SHYN",
        tagline: "The Royal Indian Dining Experience",
        description:
          "An exquisite sanctuary where time-honoured royal Indian culinary secrets converge with modern gastronomy.",
        phone: "+91 98765 43210",
        email: "reservations@shynrestaurant.com",
        address: {
          street: "14 Imperial Promenade, Connaught Place",
          city: "New Delhi",
          state: "Delhi",
          postalCode: "110001",
          country: "India",
        },
        openingHours: [
          { days: "Monday - Thursday", open: "12:00 PM", close: "11:00 PM" },
          { days: "Friday - Sunday", open: "12:00 PM", close: "11:45 PM" },
        ],
        taxRatePercent: 5,
        serviceChargePercent: 0,
        currencySymbol: "₹",
        currencyCode: "INR",
        fssaiLicense: "FSSAI Lic. No. 10022011000452",
        gstNumber: "07AAAAA0000A1Z5",
      });
    }

    // 2. Categories
    const existingCategories = await ctx.db.query("categories").collect();
    const categoryMap = new Map<string, any>();

    if (existingCategories.length === 0) {
      const categoriesData = [
        {
          name: "Starters & Small Plates",
          slug: "starters",
          description: "Delicate beginnings infused with aromatic charcoal smoke.",
          imageUrl: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80",
          displayOrder: 1,
          isActive: true,
        },
        {
          name: "Royal Kebabs & Tandoor",
          slug: "tandoor",
          description: "Melt-in-mouth delicacies slow-cooked over live charcoal tandoor ovens.",
          imageUrl: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
          displayOrder: 2,
          isActive: true,
        },
        {
          name: "Heritage Main Course",
          slug: "main-course",
          description: "Rich gravies gently simmered for hours with hand-ground whole spices.",
          imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
          displayOrder: 3,
          isActive: true,
        },
        {
          name: "Dum Pukht Biryani",
          slug: "biryani",
          description: "Aged long-grain basmati layered with tender cuts and saffron milk.",
          imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
          displayOrder: 4,
          isActive: true,
        },
        {
          name: "Artisan Breads",
          slug: "breads",
          description: "Clay-oven baked leavened breads, enriched with ghee and fine herbs.",
          imageUrl: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80",
          displayOrder: 5,
          isActive: true,
        },
        {
          name: "Royal Desserts",
          slug: "desserts",
          description: "Decadent confections steeped in fragrant saffron and pistachios.",
          imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
          displayOrder: 6,
          isActive: true,
        },
        {
          name: "Elixirs & Beverages",
          slug: "beverages",
          description: "Refreshing botanical tonics, smoked coolers, and handcrafted infusions.",
          imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
          displayOrder: 7,
          isActive: true,
        },
      ];

      for (const cat of categoriesData) {
        const id = await ctx.db.insert("categories", cat);
        categoryMap.set(cat.slug, id);
      }
    } else {
      existingCategories.forEach((c) => categoryMap.set(c.slug, c._id));
    }

    // 3. Tables
    const existingTables = await ctx.db.query("tables").collect();
    if (existingTables.length === 0) {
      const tablesData = [
        { tableNumber: "T-01", section: "Main Hall", capacity: 4, isActive: true, isOccupied: false, qrToken: "tbl_royal_01" },
        { tableNumber: "T-02", section: "Main Hall", capacity: 2, isActive: true, isOccupied: false, qrToken: "tbl_royal_02" },
        { tableNumber: "T-03", section: "Royal Courtyard", capacity: 6, isActive: true, isOccupied: false, qrToken: "tbl_royal_03" },
        { tableNumber: "T-04", section: "Royal Courtyard", capacity: 4, isActive: true, isOccupied: false, qrToken: "tbl_royal_04" },
        { tableNumber: "T-05", section: "Private Dining", capacity: 8, isActive: true, isOccupied: false, qrToken: "tbl_royal_05" },
        { tableNumber: "T-06", section: "Veranda", capacity: 2, isActive: true, isOccupied: false, qrToken: "tbl_royal_06" },
      ];

      for (const t of tablesData) {
        await ctx.db.insert("tables", t);
      }
    }

    // 4. Dishes
    const existingDishes = await ctx.db.query("dishes").collect();
    if (existingDishes.length === 0) {
      const tandoorId = categoryMap.get("tandoor") || (await ctx.db.query("categories").first())?._id;
      const curriesId = categoryMap.get("main-course") || tandoorId;
      const biryaniId = categoryMap.get("biryani") || tandoorId;
      const breadsId = categoryMap.get("breads") || tandoorId;
      const dessertsId = categoryMap.get("desserts") || tandoorId;
      const beveragesId = categoryMap.get("beverages") || tandoorId;

      const dishesData = [
        {
          name: "Shahi Awadhi Galouti Kebab",
          slug: "shahi-awadhi-galouti-kebab",
          categoryId: tandoorId,
          shortDescription: "Finely minced smoked lamb patties, tender enough to dissolve on palate.",
          description: "Crafted according to the 200-year-old royal recipe of the Nawabs of Lucknow with 32 whole spices.",
          pricePaise: 85000,
          originalPricePaise: 95000,
          dietary: "non-veg",
          spiceLevel: 2,
          portionSize: "Serves 2 (4 skewers)",
          preparationTimeMinutes: 20,
          ingredients: ["Minced Lamb", "Raw Papaya", "Desi Ghee", "Saffron Sheermal"],
          allergens: ["Dairy", "Gluten"],
          images: [{ id: "img_01", url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=85", caption: "Galouti Kebab", isPrimary: true }],
          isAvailable: true,
          isFeatured: true,
          isChefSpecial: true,
          displayOrder: 1,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          name: "Dal SHYN Bukhara (18-Hour Simmer)",
          slug: "dal-shyn-bukhara",
          categoryId: curriesId,
          shortDescription: "Whole black urad lentils slow-cooked overnight with churned butter.",
          description: "Our magnum opus. Hand-selected whole black lentils slow-simmered over gentle coal embers for 18 hours.",
          pricePaise: 62000,
          dietary: "veg",
          spiceLevel: 1,
          portionSize: "Serves 2-3 (450g)",
          preparationTimeMinutes: 15,
          ingredients: ["Whole Black Lentils", "White Butter", "Kasuri Methi", "Organic Cream"],
          allergens: ["Dairy"],
          images: [{ id: "img_02", url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=85", caption: "Dal SHYN Bukhara", isPrimary: true }],
          isAvailable: true,
          isFeatured: true,
          isChefSpecial: true,
          displayOrder: 2,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          name: "Awadhi Gosht Dum Biryani",
          slug: "awadhi-gosht-dum-biryani",
          categoryId: biryaniId,
          shortDescription: "Aged basmati rice sealed in earthen pots with fragrant saffron milk.",
          description: "Tender prime cuts cooked with aged 2-year old basmati rice in a sealed earthen handi using Purdah Dum.",
          pricePaise: 92000,
          dietary: "non-veg",
          spiceLevel: 2,
          portionSize: "Serves 2 (650g)",
          preparationTimeMinutes: 25,
          ingredients: ["Aged Basmati", "Prime Meat", "Kashmiri Saffron", "Brown Onions"],
          allergens: ["Dairy"],
          images: [{ id: "img_03", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=85", caption: "Dum Biryani", isPrimary: true }],
          isAvailable: true,
          isFeatured: true,
          isChefSpecial: true,
          displayOrder: 3,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          name: "Truffle & Garlic Butter Naan",
          slug: "truffle-garlic-butter-naan",
          categoryId: breadsId,
          shortDescription: "Clay oven blistered flatbread brushed with black truffle butter.",
          description: "Hand-stretched leavened dough baked on hot clay wall, brushed with imported black truffle oil.",
          pricePaise: 24000,
          dietary: "veg",
          spiceLevel: 0,
          portionSize: "1 large bread (4 quarters)",
          preparationTimeMinutes: 8,
          ingredients: ["Fine Flour", "Black Truffle Butter", "Toasted Garlic", "Kalonji"],
          allergens: ["Gluten", "Dairy"],
          images: [{ id: "img_06", url: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=1200&q=85", caption: "Truffle Butter Naan", isPrimary: true }],
          isAvailable: true,
          isFeatured: false,
          isChefSpecial: true,
          displayOrder: 6,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          name: "Zafrani Phirni in Clay Kasora",
          slug: "zafrani-phirni-clay-kasora",
          categoryId: dessertsId,
          shortDescription: "Silky ground rice pudding scented with royal saffron & pistachios.",
          description: "Slow-reduced full cream milk infused with stone-ground rice and wild Kashmiri saffron threads.",
          pricePaise: 38000,
          dietary: "veg",
          spiceLevel: 0,
          portionSize: "Terracotta bowl (180g)",
          preparationTimeMinutes: 5,
          ingredients: ["Basmati Rice", "Buffalo Milk", "Kashmiri Saffron", "Silver Vark"],
          allergens: ["Dairy", "Nuts"],
          images: [{ id: "img_08", url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=85", caption: "Zafrani Phirni", isPrimary: true }],
          isAvailable: true,
          isFeatured: true,
          isChefSpecial: true,
          displayOrder: 8,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      for (const d of dishesData) {
        await ctx.db.insert("dishes", d);
      }
    }

    return { status: "success", message: "Convex database seeded successfully!" };
  },
});
