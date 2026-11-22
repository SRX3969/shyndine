import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_created_at")
      .order("desc")
      .collect();
  },
});

export const getByTrackingToken = query({
  args: { trackingToken: v.string() },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_tracking_token", (q) =>
        q.eq("trackingToken", args.trackingToken)
      )
      .first();
    if (!order) return null;

    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", order._id))
      .collect();

    const events = await ctx.db
      .query("orderEvents")
      .withIndex("by_order", (q) => q.eq("orderId", order._id))
      .collect();

    return { ...order, items, events };
  },
});

export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
    note: v.optional(v.string()),
    actorRole: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.orderId, {
      status: args.status,
      updatedAt: now,
    });

    await ctx.db.insert("orderEvents", {
      orderId: args.orderId,
      status: args.status,
      timestamp: now,
      note: args.note,
      actorRole: args.actorRole || "staff",
    });
  },
});
