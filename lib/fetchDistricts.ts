export async function fetchDistrictSuggestions(query: string): Promise<string[]> {
  const q = query.trim();
  if (!q) return [];

  // Try public API
  try {
    const res = await fetch(`https://api.indiaapi.in/api/v1/districts`);
    if (!res.ok) throw new Error("indiaapi fetch failed");
    const all = await res.json(); // expect array of { district: "...", state: "..." } or strings
    // normalize to names
    const names: string[] = Array.isArray(all)
      ? all.map((item: any) => (typeof item === "string" ? item : item.district || item.name))
      : [];
    const filtered = names.filter((n) => n.toLowerCase().includes(q.toLowerCase())).slice(0, 12);
    return filtered;
  } catch (err) {
    // fallback local minimal list (extend as needed)
    const fallback = ["Nalbari", "Patna", "Jaipur", "Pune", "Kolkata", "Bengaluru", "Hyderabad"];
    return fallback.filter((n) => n.toLowerCase().includes(q.toLowerCase())).slice(0, 12);
  }
}
