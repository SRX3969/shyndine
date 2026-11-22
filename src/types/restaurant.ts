export interface Restaurant {
  _id?: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  openingHours: {
    days: string;
    open: string;
    close: string;
  }[];
  taxRatePercent: number; // e.g. 5 for 5% GST
  serviceChargePercent: number; // e.g. 0 or 5
  currencySymbol: string; // e.g. "₹"
  currencyCode: string; // "INR"
  fssaiLicense?: string;
  gstNumber?: string;
}

export interface RestaurantGalleryItem {
  id: string;
  title: string;
  category: "ambiance" | "culinary" | "chef" | "events";
  imageUrl: string;
  caption: string;
}
