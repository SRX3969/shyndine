import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("restaurants").first();
  },
});

export const update = mutation({
  args: {
    name: v.string(),
    tagline: v.string(),
    description: v.string(),
    phone: v.string(),
    email: v.string(),
    taxRatePercent: v.number(),
    serviceChargePercent: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("restaurants").first();
    if (existing) {
      return await ctx.db.patch(existing._id, args);
    }
    return await ctx.db.insert("restaurants", {
      ...args,
      address: {
        street: "14 Imperial Promenade",
        city: "New Delhi",
        state: "Delhi",
        postalCode: "110001",
        country: "India",
      },
      openingHours: [
        { days: "Daily", open: "12:00 PM", close: "11:30 PM" },
      ],
      currencySymbol: "₹",
      currencyCode: "INR",
    });
  },
});
