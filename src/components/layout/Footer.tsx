import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Award,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#201E1A] text-[#F7F4EE] border-t border-[#B39460]/30 mt-auto">
      {/* Top Banner Ornament */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-[#B39460] flex items-center justify-center text-[#B39460]">
                <span className="font-serif font-bold text-base">S</span>
              </div>
              <span className="font-serif text-2xl tracking-[0.25em] text-[#FFFEFC] uppercase">
                SHYN
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#8A8175] font-sans">
              A tribute to royal Indian dining heritage. Slow-cooked Dum Pukht,
              charcoal tandoori artistry, and generational recipes served in an
              ambiance of understated luxury.
            </p>
            <div className="pt-2 text-[11px] text-[#B39460] space-y-1">
              <p>FSSAI Lic. No. 10022011000452</p>
              <p>GSTIN: 07AAAAA0000A1Z5</p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg tracking-widest text-[#B39460] uppercase">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs text-[#F7F4EE]/80">
              <li>
                <Link href="/menu" className="hover:text-[#B39460] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#B39460]" />
                  Explore Full Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#B39460] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#B39460]" />
                  Our Heritage & Culinary Story
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#B39460] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#B39460]" />
                  Restaurant & Food Photography
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#B39460] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#B39460]" />
                  Reservations & Inquiries
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#B39460] transition-colors flex items-center gap-1.5 text-[#B39460]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Staff Portal & KDS
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Hours & Timing */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg tracking-widest text-[#B39460] uppercase flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#B39460]" />
              Dining Hours
            </h3>
            <div className="text-xs space-y-2 text-[#8A8175]">
              <div>
                <p className="text-[#FFFEFC] font-medium">Lunch Service</p>
                <p>Daily: 12:00 PM – 3:30 PM</p>
              </div>
              <div>
                <p className="text-[#FFFEFC] font-medium">Dinner & Royal Feast</p>
                <p>Monday – Thursday: 7:00 PM – 11:00 PM</p>
                <p>Friday – Sunday: 7:00 PM – 11:45 PM</p>
              </div>
              <p className="text-[11px] text-[#B39460] pt-1">
                * Table reservations recommended on weekends
              </p>
            </div>
          </div>

          {/* Column 4: Contact & Address */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg tracking-widest text-[#B39460] uppercase flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#B39460]" />
              The Palace
            </h3>
            <div className="text-xs space-y-2 text-[#8A8175]">
              <p className="leading-relaxed text-[#FFFEFC]">
                14 Imperial Promenade, Connaught Place, New Delhi 110001
              </p>
              <p className="flex items-center gap-2 pt-1 text-[#F7F4EE]">
                <Phone className="w-3.5 h-3.5 text-[#B39460]" />
                +91 98765 43210
              </p>
              <p className="flex items-center gap-2 text-[#F7F4EE]">
                <Mail className="w-3.5 h-3.5 text-[#B39460]" />
                reservations@shynrestaurant.com
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#8A8175]/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8A8175] gap-4">
          <p>© {new Date().getFullYear()} SHYN Restaurant. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Dine-In Only • Manual Counter / Table Payment Settlement • Real-Time Kitchen Dispatch
          </p>
        </div>
      </div>
    </footer>
  );
}
