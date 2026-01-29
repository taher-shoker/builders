export function convertToDateOnly(date: Date | null): string | null {
  if (!date) return null;

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // getMonth is 0-based
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
