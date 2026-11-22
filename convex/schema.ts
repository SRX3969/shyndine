import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  restaurants: defineTable({
    name: v.string(),
    tagline: v.string(),
    description: v.string(),
    logoUrl: v.optional(v.string()),
    bannerUrl: v.optional(v.string()),
    phone: v.string(),
    email: v.string(),
    address: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      postalCode: v.string(),
      country: v.string(),
    }),
    openingHours: v.array(
      v.object({
        days: v.string(),
        open: v.string(),
        close: v.string(),
      })
    ),
    taxRatePercent: v.number(),
    serviceChargePercent: v.number(),
    currencySymbol: v.string(),
    currencyCode: v.string(),
    fssaiLicense: v.optional(v.string()),
    gstNumber: v.optional(v.string()),
  }),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.string(), // "admin" | "manager" | "kitchen" | "waiter"
    passwordHash: v.optional(v.string()),
    isActive: v.boolean(),
    avatarUrl: v.optional(v.string()),
    lastLogin: v.optional(v.number()),
  }).index("by_email", ["email"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    displayOrder: v.number(),
    isActive: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_display_order", ["displayOrder"]),

  dishes: defineTable({
    name: v.string(),
    slug: v.string(),
    categoryId: v.id("categories"),
    description: v.string(),
    shortDescription: v.optional(v.string()),
    pricePaise: v.number(),
    originalPricePaise: v.optional(v.number()),
    dietary: v.string(), // "veg" | "non-veg" | "vegan" | "egg"
    spiceLevel: v.number(), // 0, 1, 2, 3
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
    customizationGroups: v.optional(
      v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          minSelections: v.number(),
          maxSelections: v.number(),
          options: v.array(
            v.object({
              id: v.string(),
              name: v.string(),
              pricePaise: v.number(),
            })
          ),
        })
      )
    ),
    displayOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["categoryId"])
    .index("by_slug", ["slug"])
    .index("by_featured", ["isFeatured"])
    .index("by_availability", ["isAvailable"]),

  tables: defineTable({
    tableNumber: v.string(),
    section: v.string(), // "Main Hall", "Royal Courtyard", "Veranda", "Private Dining"
    capacity: v.number(),
    isActive: v.boolean(),
    isOccupied: v.boolean(),
    qrToken: v.string(),
    currentSessionId: v.optional(v.string()),
  })
    .index("by_table_number", ["tableNumber"])
    .index("by_qr_token", ["qrToken"]),

  tableSessions: defineTable({
    tableId: v.id("tables"),
    tableNumber: v.string(),
    qrToken: v.string(),
    status: v.string(), // "active" | "billed" | "closed"
    startTime: v.number(),
    endTime: v.optional(v.number()),
    orderIds: v.array(v.string()),
    totalBillPaise: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_table", ["tableId"])
    .index("by_status", ["status"]),

  customers: defineTable({
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    totalOrdersCount: v.number(),
    totalSpendPaise: v.number(),
    lastVisitedAt: v.number(),
  }).index("by_phone", ["phone"]),

  orders: defineTable({
    orderNumber: v.string(),
    restaurantId: v.optional(v.string()),
    tableId: v.id("tables"),
    tableNumber: v.string(),
    tableSessionId: v.string(),
    customerName: v.string(),
    customerPhone: v.string(),
    customerEmail: v.optional(v.string()),
    trackingToken: v.string(),
    status: v.string(), // "new" | "accepted" | "preparing" | "ready" | "served" | "completed" | "cancelled"
    specialInstructions: v.optional(v.string()),
    subtotalPaise: v.number(),
    taxPaise: v.number(),
    discountPaise: v.number(),
    totalPaise: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_order_number", ["orderNumber"])
    .index("by_tracking_token", ["trackingToken"])
    .index("by_table_session", ["tableSessionId"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),

  orderItems: defineTable({
    orderId: v.id("orders"),
    dishId: v.id("dishes"),
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
  }).index("by_order", ["orderId"]),

  orderEvents: defineTable({
    orderId: v.id("orders"),
    status: v.string(),
    timestamp: v.number(),
    note: v.optional(v.string()),
    actorRole: v.optional(v.string()),
  }).index("by_order", ["orderId"]),

  invoices: defineTable({
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
    issuedAt: v.number(),
    paymentSettlementNote: v.optional(v.string()),
    status: v.string(), // "draft" | "issued" | "settled"
  })
    .index("by_invoice_number", ["invoiceNumber"])
    .index("by_order", ["orderId"])
    .index("by_table_session", ["tableSessionId"]),

  auditLogs: defineTable({
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    performedBy: v.string(),
    details: v.string(),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]),
});
