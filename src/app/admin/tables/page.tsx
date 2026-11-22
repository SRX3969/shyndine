"use client";

import { useState } from "react";
import Link from "next/link";
import {
  QrCode,
  Plus,
  Printer,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Users,
  Copy,
  Check,
} from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { Table } from "@/types";

export default function AdminTablesPage() {
  const { tables, saveTable, closeTableSession } = useRestaurant();
  const [selectedTable, setSelectedTable] = useState<Table | null>(tables[0] || null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // New Table Form Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState("");
  const [newSection, setNewSection] = useState<Table["section"]>("Main Hall");
  const [newCapacity, setNewCapacity] = useState(4);

  const handleCreateTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNumber.trim()) return;

    saveTable({
      tableNumber: newTableNumber.trim(),
      section: newSection,
      capacity: Number(newCapacity),
    });

    setShowAddModal(false);
    setNewTableNumber("");
  };

  const handleCopyLink = (token: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/order/${token}`;
      navigator.clipboard.writeText(url);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
            Floor Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#201E1A]">
            Tables & QR Stands ({tables.length})
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-full bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Table</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tables Floor Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tables.map((table) => {
              const isSelected = selectedTable?._id === table._id;

              return (
                <div
                  key={table._id}
                  onClick={() => setSelectedTable(table)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#201E1A] text-[#FFFEFC] border-[#B39460] shadow-md scale-102"
                      : "bg-[#FFFEFC] border-[#B39460]/20 hover:border-[#B39460]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-xl block">
                        Table {table.tableNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          table.isOccupied
                            ? "bg-rose-100 text-rose-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {table.isOccupied ? "Seated" : "Available"}
                      </span>
                    </div>

                    <p className="text-xs opacity-75 mt-1 font-sans">
                      {table.section} • {table.capacity} Guests
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-current/20 flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] opacity-70 truncate max-w-[120px]">
                      {table.qrToken}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-[#B39460]">
                      Inspect QR Stand →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Table Printable QR Stand Generator */}
        <div className="lg:col-span-4">
          {selectedTable ? (
            <div className="bg-[#FFFEFC] p-6 rounded-3xl border border-[#B39460]/30 shadow-md space-y-6">
              <div className="text-center border-b border-[#B39460]/20 pb-4 space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[#B39460] font-semibold">
                  Table QR Stand Preview
                </span>
                <h3 className="font-serif text-2xl text-[#201E1A]">
                  Table {selectedTable.tableNumber} Stand
                </h3>
                <p className="text-xs text-[#8A8175]">
                  {selectedTable.section} • Seating {selectedTable.capacity}
                </p>
              </div>

              {/* Printable Stand Visual */}
              <div className="bg-[#201E1A] text-[#FFFEFC] p-6 rounded-2xl border-2 border-[#B39460] shadow-xl text-center space-y-4">
                <div className="space-y-1">
                  <span className="font-serif text-xl tracking-[0.25em] text-[#B39460] uppercase block">
                    SHYN
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-[#8A8175] block">
                    The Royal Dining Experience
                  </span>
                </div>

                {/* Simulated High-Res QR Block */}
                <div className="w-44 h-44 bg-white p-3 rounded-xl mx-auto flex flex-col items-center justify-center border border-[#B39460]/40 shadow-inner">
                  {/* Visual QR representation */}
                  <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-gray-50 rounded">
                    {[...Array(36)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          (i % 2 === 0 && i % 3 === 0) || i < 6 || i % 6 === 0
                            ? "bg-[#201E1A]"
                            : "bg-transparent"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-serif font-bold text-2xl text-white block">
                    TABLE {selectedTable.tableNumber}
                  </span>
                  <p className="text-[10px] text-[#8A8175]">
                    Scan with smartphone camera to browse menu & order directly
                  </p>
                </div>
              </div>

              {/* Stand Action Controls */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => handleCopyLink(selectedTable.qrToken)}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#B39460] text-[#201E1A] hover:bg-[#B39460]/10 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  {copiedToken === selectedTable.qrToken ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>URL Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#B39460]" />
                      <span>Copy Customer Scan URL</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/order/${selectedTable.qrToken}`}
                  target="_blank"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Test Customer Journey</span>
                </Link>

                {selectedTable.isOccupied && (
                  <button
                    onClick={() => {
                      if (confirm(`Close table session for Table ${selectedTable.tableNumber}?`)) {
                        closeTableSession(selectedTable._id);
                      }
                    }}
                    className="w-full py-2 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-all"
                  >
                    Clear & Free Table Session
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#8A8175] bg-white rounded-3xl border border-dashed border-[#B39460]/30">
              Select a table from the floor to view QR details
            </div>
          )}
        </div>
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTable}
            className="bg-[#FFFEFC] max-w-md w-full p-6 sm:p-8 rounded-3xl border border-[#B39460] shadow-2xl space-y-4"
          >
            <h3 className="font-serif text-2xl text-[#201E1A]">Add New Table</h3>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                Table Number *
              </label>
              <input
                required
                type="text"
                value={newTableNumber}
                onChange={(e) => setNewTableNumber(e.target.value)}
                placeholder="e.g. T-07"
                className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                Section
              </label>
              <select
                value={newSection}
                onChange={(e) => setNewSection(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A]"
              >
                <option value="Main Hall">Main Hall</option>
                <option value="Royal Courtyard">Royal Courtyard</option>
                <option value="Veranda">Veranda</option>
                <option value="Private Dining">Private Dining</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                Guest Capacity
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={newCapacity}
                onChange={(e) => setNewCapacity(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A]"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-full border border-gray-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] text-xs font-semibold uppercase tracking-wider"
              >
                Create Table
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
