export function getTimeName(): string {
  const ct = new Date();
  const hr = ct.getHours();
  if (hr > 6 && hr < 11) return 'morning';
  if (hr > 11 && hr < 18) return 'day';
  if (hr > 17 && hr < 23) return 'evening';
  return 'night';
}
