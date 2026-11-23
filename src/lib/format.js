// Date/time in Pacific time, e.g. "11/23/2026, 9:15:00 AM".
// Timestamps without a timezone are treated as UTC (that's how the database stores them).
export function formatPST(value, fallback = "—") {
  if (!value) return fallback;
  const normalized =
    typeof value === "string" && !value.endsWith("Z") && !/[+-]\d{2}:?\d{2}$/.test(value)
      ? value + "Z"
      : value;
  const d = new Date(normalized);
  return isNaN(d) ? fallback : d.toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
}
