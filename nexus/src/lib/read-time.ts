export function calculateReadTime(content: string) {
  const words = content
    .replace(/[#*]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return `${minutes} min`;
}
