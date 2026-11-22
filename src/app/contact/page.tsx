"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "Dinner (8:00 PM)",
    guests: "2 Guests",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
            Reservations & Inquiries
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#201E1A]">
            Table Reservations
          </h1>
          <p className="text-sm text-[#8A8175]">
            For private celebrations, corporate feasts, or specific seating in the Royal Courtyard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Reservation Form */}
          <div className="lg:col-span-7 bg-[#FFFEFC] p-8 sm:p-10 rounded-3xl border border-[#B39460]/20 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#B39460] mx-auto" />
                <h3 className="font-serif text-2xl text-[#201E1A]">
                  Reservation Request Received
                </h3>
                <p className="text-xs text-[#8A8175] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Our Guest Concierge will
                  contact you at <strong>{formData.phone}</strong> within 30 minutes to
                  confirm your table seating.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#201E1A] text-[#B39460] text-xs uppercase tracking-widest font-semibold"
                >
                  Make Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-2xl text-[#201E1A] mb-2">
                  Request Table Booking
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Vikram Malhotra"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/60 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                      Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/60 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                      Date *
                    </label>
                    <input
                      required
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/60 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                      Service Time
                    </label>
                    <select
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/60 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
                    >
                      <option>Lunch (12:30 PM)</option>
                      <option>Lunch (1:30 PM)</option>
                      <option>Dinner (7:30 PM)</option>
                      <option>Dinner (8:30 PM)</option>
                      <option>Dinner (9:30 PM)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                      Party Size
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) =>
                        setFormData({ ...formData, guests: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/60 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
                    >
                      <option>2 Guests</option>
                      <option>4 Guests</option>
                      <option>6 Guests</option>
                      <option>8 Guests (Private Dining)</option>
                      <option>10+ Guests (Royal Banquet)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Anniversary celebration, dietary restrictions, preferred seating..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/60 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] font-serif text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Table Request</span>
                </button>
              </form>
            )}
          </div>

          {/* Details & Map Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#201E1A] text-[#FFFEFC] p-8 rounded-3xl border border-[#B39460]/30 space-y-6">
              <h3 className="font-serif text-2xl text-[#B39460]">
                Contact & Location
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex gap-3">
                  <MapPin className="w-4 h-4 text-[#B39460] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">SHYN Restaurant</strong>
                    <p className="text-[#8A8175] mt-0.5">
                      14 Imperial Promenade, Connaught Place, New Delhi 110001
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="w-4 h-4 text-[#B39460] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Concierge & Helpline</strong>
                    <p className="text-[#8A8175] mt-0.5">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail className="w-4 h-4 text-[#B39460] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Electronic Mail</strong>
                    <p className="text-[#8A8175] mt-0.5">
                      reservations@shynrestaurant.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock className="w-4 h-4 text-[#B39460] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Service Hours</strong>
                    <p className="text-[#8A8175] mt-0.5">
                      Lunch: 12:00 PM – 3:30 PM <br />
                      Dinner: 7:00 PM – 11:45 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#8A8175]/30">
                <p className="text-[11px] text-[#8A8175]">
                  Valet parking available at the main courtyard portico. Dress code:
                  Smart Casual & Traditional Finery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
