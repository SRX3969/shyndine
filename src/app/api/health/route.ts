import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: Date.now(),
    service: "SHYN Restaurant Ordering & Management Platform",
    version: "1.0.0",
    features: {
      dineInQrOrdering: true,
      onlinePayments: false, // Deliberately excluded as per design specification
      manualTableSettlement: true,
      realTimeKanban: true,
      kitchenDisplaySystem: true,
      printingInvoicesA4AndThermal: true,
    },
  });
}
