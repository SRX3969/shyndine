# SHYN — The Royal Indian Dining Experience

A complete, production-oriented premium restaurant platform with a real-time dine-in ordering system, Reelmark-inspired curved 3D hero food carousel, and integrated restaurant management administration dashboard.

## Highlights

- **Dine-In QR Ordering**: Secure token-validated table entry (`/order/[tableToken]`), table session management, and live order tracking (`/order/track/[trackingToken]`).
- **Real-Time Kitchen Dispatch & Kanban**: Instant reactive updates between customer table orders, Staff Kanban Board (`/admin/orders`), and Kitchen Display System (`/admin/kitchen`).
- **A4 & Thermal Billing**: Complete invoice generation, thermal 80mm receipt mode, and Kitchen Order Ticket (KOT) printing.
- **Payment Policy**: Deliberately excludes online payment gateways; bills are calculated with accurate GST breakdowns and settled manually at tables.
- **Reelmark-Inspired Cylindrical Carousel**: Mathematical 3D curved food image carousel with inertia dragging, momentum, and continuous auto-scroll.
- **Luxury Design System**: Warm ivory, charcoal, antique gold, Cormorant Garamond editorial serif typography, and Inter UI sans.

## Tech Stack

- **Framework**: Next.js App Router (TypeScript)
- **Styling**: Tailwind CSS
- **Animation**: GSAP & Framer Motion
- **Database / Sync**: Convex backend schema & reactive real-time store
- **Icons**: Lucide React
- **Forms**: React Hook Form & Zod
- **Charts**: Recharts

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)
   - Public Website: `/`
   - Menu: `/menu`
   - Dine-In QR Demo: `/order/tbl_royal_01`
   - Admin Dashboard: `/admin/dashboard`
   - Live Kanban: `/admin/orders`
   - Kitchen Display (KDS): `/admin/kitchen`
