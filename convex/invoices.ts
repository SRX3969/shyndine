import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("invoices").order("desc").collect();
  },
});

export const getById = query({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.invoiceId);
  },
});

export const create = mutation({
  args: {
    invoiceNumber: v.string(),
    orderId: v.optional(v.string()),
    tableSessionId: v.optional(v.string()),
    tableNumber: v.string(),
    customerName: v.string(),
    customerPhone: v.string(),
    customerEmail: v.optional(v.string()),
    items: v.array(
      v.object({
        id: v.string(),
        dishId: v.string(),
        dishName: v.string(),
        pricePaise: v.number(),
        quantity: v.number(),
        dietary: v.string(),
        customizations: v.array(
          v.object({
            groupId: v.string(),
            groupTitle: v.string(),
            optionId: v.string(),
            optionName: v.string(),
            pricePaise: v.number(),
          })
        ),
        specialInstructions: v.optional(v.string()),
        itemTotalPaise: v.number(),
      })
    ),
    subtotalPaise: v.number(),
    taxPaise: v.number(),
    taxRatePercent: v.number(),
    serviceChargePaise: v.number(),
    discountPaise: v.number(),
    grandTotalPaise: v.number(),
    paymentSettlementNote: v.optional(v.string()),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("invoices", {
      ...args,
      issuedAt: Date.now(),
    });
  },
});

export const markSettled = mutation({
  args: {
    invoiceId: v.id("invoices"),
    paymentSettlementNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.invoiceId, {
      status: "settled",
      paymentSettlementNote: args.paymentSettlementNote || "Settled at counter (Cash/POS)",
    });
  },
});
