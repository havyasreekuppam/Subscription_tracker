export function formatCurrency(amount: number, currency: string = "INR") {
  const locale = currency === "INR" ? "en-IN" : "en-US"

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount || 0)
}