import { format } from "date-fns";

const currency = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});
const numberFormatter = new Intl.NumberFormat("ms-MY");

export function formatValue(
  value?: string | number,
  opts?: { currency?: boolean }
) {
  if (value === undefined || value === null) return "-";
  if (typeof value === "number") {
    return opts?.currency
      ? `${currency.format(value)} ETH`
      : numberFormatter.format(value);
  }
  return value;
}

export function formatDate(value?: Date | string) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (isNaN(date.getTime())) return "";
  return format(date, "PPP");
}
