"use client";

import { useState } from "react";
import { Settings, Save, Check, ShieldCheck, Sparkles } from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";

export default function AdminSettingsPage() {
  const { restaurant } = useRestaurant();
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(restaurant.name);
  const [tagline, setTagline] = useState(restaurant.tagline);
  const [phone, setPhone] = useState(restaurant.phone);
  const [email, setEmail] = useState(restaurant.email);
  const [street, setStreet] = useState(restaurant.address.street);
  const [city, setCity] = useState(restaurant.address.city);
  const [gstNumber, setGstNumber] = useState(restaurant.gstNumber || "07AAAAA0000A1Z5");
  const [fssai, setFssai] = useState(restaurant.fssaiLicense || "10022011000452");
  const [taxRate, setTaxRate] = useState(restaurant.taxRatePercent || 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <span className="text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
          Platform Configuration
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#201E1A]">
          Restaurant Profile & Tax Settings
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFEFC] p-8 rounded-3xl border border-[#B39460]/20 shadow-xs space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
              Restaurant Brand Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
              Concierge Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
              Reservations Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
              City / State
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#B39460]/20 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
              GSTIN Number
            </label>
            <input
              type="text"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 font-mono text-[#201E1A]"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
              FSSAI License
            </label>
            <input
              type="text"
              value={fssai}
              onChange={(e) => setFssai(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 font-mono text-[#201E1A]"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
              Dine-In GST Tax Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="28"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A]"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] font-serif text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-2"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved Settings</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Update Configuration</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
