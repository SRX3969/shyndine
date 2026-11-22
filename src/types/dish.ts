export type DietaryClassification = "veg" | "non-veg" | "vegan" | "egg";

export interface CustomizationOption {
  id: string;
  name: string;
  pricePaise: number; // 0 if free, e.g. 5000 = ₹50.00
}

export interface CustomizationGroup {
  id: string;
  title: string;
  minSelections: number; // 0 for optional, 1 for required
  maxSelections: number;
  options: CustomizationOption[];
}

export interface DishImage {
  id: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
}

export interface Dish {
  _id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  description: string;
  shortDescription?: string;
  pricePaise: number; // Integer in paise (₹1 = 100 paise)
  originalPricePaise?: number; // For strikethrough or special offers
  dietary: DietaryClassification;
  spiceLevel: 0 | 1 | 2 | 3; // 0: Mild/None, 1: Low, 2: Medium, 3: High
  portionSize: string; // e.g., "Serves 1-2 (350g)"
  preparationTimeMinutes: number; // e.g. 20
  ingredients: string[];
  allergens: string[];
  images: DishImage[];
  isAvailable: boolean;
  isFeatured: boolean;
  isChefSpecial: boolean;
  customizationGroups?: CustomizationGroup[];
  displayOrder: number;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
  dishCount?: number;
}
