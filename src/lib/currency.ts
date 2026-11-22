/**
 * Format price in paise (integer) to formatted INR string
 * 100 paise = ₹1.00
 */
export function formatPaise(paise: number, showSymbol = true): string {
  const rupees = (paise / 100).toFixed(2);
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(rupees));

  return showSymbol ? `₹${formatted}` : formatted;
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

export function calculateOrderTotals(
  items: { pricePaise: number; quantity: number; customizationPricePaise?: number }[],
  taxRatePercent = 5,
  discountPaise = 0
) {
  const subtotalPaise = items.reduce((sum, item) => {
    const itemUnit = item.pricePaise + (item.customizationPricePaise || 0);
    return sum + itemUnit * item.quantity;
  }, 0);

  const taxableAmount = Math.max(0, subtotalPaise - discountPaise);
  const taxPaise = Math.round(taxableAmount * (taxRatePercent / 100));
  const totalPaise = taxableAmount + taxPaise;

  return {
    subtotalPaise,
    taxPaise,
    discountPaise,
    totalPaise,
  };
}
