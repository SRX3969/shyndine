import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name is too long"),
  phone: z
    .string()
    .min(10, "Please enter a valid 10-digit mobile number")
    .max(13, "Mobile number too long")
    .regex(/^[0-9+ ]+$/, "Please enter a valid phone number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  specialInstructions: z
    .string()
    .max(250, "Instructions cannot exceed 250 characters")
    .optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const dishSchema = z.object({
  name: z.string().min(2, "Dish name required"),
  slug: z.string().min(2, "Slug required"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description should be detailed"),
  shortDescription: z.string().max(120).optional(),
  priceRupees: z.number().min(1, "Price must be at least ₹1"),
  dietary: z.enum(["veg", "non-veg", "vegan", "egg"]),
  spiceLevel: z.number().min(0).max(3),
  portionSize: z.string().min(1, "Portion size required"),
  preparationTimeMinutes: z.number().min(1).max(180),
  ingredients: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isChefSpecial: z.boolean().default(false),
});

export type DishFormData = z.infer<typeof dishSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Category name required"),
  slug: z.string().min(2, "Slug required"),
  description: z.string().default(""),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().default(0),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const tableSchema = z.object({
  tableNumber: z.string().min(1, "Table number required"),
  section: z.enum(["Main Hall", "Royal Courtyard", "Veranda", "Private Dining"]),
  capacity: z.number().min(1).max(20),
  isActive: z.boolean().default(true),
});

export type TableFormData = z.infer<typeof tableSchema>;
