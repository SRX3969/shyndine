import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("tables").collect();
  },
});

export const getByToken = query({
  args: { qrToken: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tables")
      .withIndex("by_qr_token", (q) => q.eq("qrToken", args.qrToken))
      .first();
  },
});

export const create = mutation({
  args: {
    tableNumber: v.string(),
    section: v.string(),
    capacity: v.number(),
    isActive: v.boolean(),
    qrToken: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tables", {
      ...args,
      isOccupied: false,
    });
  },
});
