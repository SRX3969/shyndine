import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { categoryId: v.optional(v.id("categories")) },
  handler: async (ctx, args) => {
    if (args.categoryId) {
      return await ctx.db
        .query("dishes")
        .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId!))
        .collect();
    }
    return await ctx.db.query("dishes").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("dishes")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getFeatured = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("dishes")
      .withIndex("by_featured", (q) => q.eq("isFeatured", true))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    categoryId: v.id("categories"),
    description: v.string(),
    shortDescription: v.optional(v.string()),
    pricePaise: v.number(),
    originalPricePaise: v.optional(v.number()),
    dietary: v.string(),
    spiceLevel: v.number(),
    portionSize: v.string(),
    preparationTimeMinutes: v.number(),
    ingredients: v.array(v.string()),
    allergens: v.array(v.string()),
    images: v.array(
      v.object({
        id: v.string(),
        url: v.string(),
        caption: v.optional(v.string()),
        isPrimary: v.boolean(),
      })
    ),
    isAvailable: v.boolean(),
    isFeatured: v.boolean(),
    isChefSpecial: v.boolean(),
    displayOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("dishes", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateAvailability = mutation({
  args: { id: v.id("dishes"), isAvailable: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isAvailable: args.isAvailable,
      updatedAt: Date.now(),
    });
  },
});
