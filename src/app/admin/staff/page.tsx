"use client";

import { ShieldCheck, UserCheck, ChefHat, UtensilsCrossed } from "lucide-react";

const staffRoster = [
  {
    name: "Vikram Rathore",
    role: "General Manager & Admin",
    email: "manager@shynrestaurant.com",
    badge: "Super Admin",
    status: "Active",
  },
  {
    name: "Chef Ranveer Rathore",
    role: "Executive Head Chef",
    email: "chef@shynrestaurant.com",
    badge: "Kitchen Lead",
    status: "Active",
  },
  {
    name: "Sunil Joshi",
    role: "Senior Captain & Waiter",
    email: "sunil.j@shynrestaurant.com",
    badge: "Floor Staff",
    status: "Active",
  },
  {
    name: "Kabir Khan",
    role: "Tandoor & Kebab Master",
    email: "kabir.k@shynrestaurant.com",
    badge: "Kitchen Station",
    status: "Active",
  },
];

export default function AdminStaffPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
          Access & Roles
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#201E1A]">
          Staff & Team Permissions
        </h1>
      </div>

      <div className="bg-[#FFFEFC] rounded-3xl border border-[#B39460]/20 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#201E1A] text-[#FFFEFC] uppercase tracking-wider font-semibold text-[10px]">
            <tr>
              <th className="py-4 px-6">Staff Member</th>
              <th className="py-4 px-4">Role Title</th>
              <th className="py-4 px-4">Department Badge</th>
              <th className="py-4 px-4">Account Email</th>
              <th className="py-4 px-6 text-right">Access Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F7F4EE]">
            {staffRoster.map((staff, i) => (
              <tr key={i} className="hover:bg-[#F7F4EE]/50">
                <td className="py-4 px-6 font-serif font-medium text-sm text-[#201E1A]">
                  {staff.name}
                </td>
                <td className="py-4 px-4 text-[#8A8175]">{staff.role}</td>
                <td className="py-4 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#B39460]/15 text-[#917544]">
                    {staff.badge}
                  </span>
                </td>
                <td className="py-4 px-4 font-mono text-[11px] text-[#8A8175]">
                  {staff.email}
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="text-emerald-700 font-bold uppercase text-[10px]">
                    Active • Authorized
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
