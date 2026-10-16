// Deterministic date formatting for blog post dates (plain "YYYY-MM-DD"
// strings stored in content). Deliberately avoids `new Date(...)` entirely —
// even a fixed-argument Date object is unnecessary here, and this keeps the
// function trivially pure for Cache Components' static shell.

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatBlogDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const monthName = MONTHS[(month ?? 1) - 1] ?? "";
  return `${monthName} ${day}, ${year}`;
}
