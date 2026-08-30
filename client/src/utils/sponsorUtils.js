/**
 * Processes raw sponsor data from API response into an aggregated and sorted list of patrons.
 * Groups by normalized phone number, email, or name and sums up contribution amounts.
 */
export function processLeaderboardData(sponsors = []) {
  if (!Array.isArray(sponsors)) return [];

  const aggregatedMap = new Map();

  sponsors.forEach((s) => {
    if (s.status && String(s.status).toLowerCase() !== "captured") {
      return;
    }

    const rawName = (s.name || "").trim();
    const rawPhone = (s.phone || s.contact || "").replace(/\D/g, "");
    const phoneKey = rawPhone.length >= 10 ? rawPhone.slice(-10) : rawPhone;

    const normKey = phoneKey
      ? `phone_${phoneKey}`
      : (s.email || "").toLowerCase()
      ? `email_${(s.email || "").toLowerCase()}`
      : `name_${rawName.toLowerCase() || s.id}`;

    const amt = Number(s.amount) || 0;

    if (aggregatedMap.has(normKey)) {
      const existing = aggregatedMap.get(normKey);
      existing.amount = (Number(existing.amount) || 0) + amt;
      if (rawName.length > (existing.name || "").length && rawName !== "Anonymous BITSian") {
        existing.name = rawName;
      }
    } else {
      aggregatedMap.set(normKey, {
        ...s,
        name: rawName || "Anonymous BITSian",
        amount: amt,
      });
    }
  });

  return Array.from(aggregatedMap.values()).sort((a, b) => {
    const diff = (Number(b.amount) || 0) - (Number(a.amount) || 0);
    if (diff !== 0) return diff;
    const dateA = a.date || a.created_at || "";
    const dateB = b.date || b.created_at || "";
    if (dateA !== dateB) return dateB.localeCompare(dateA);
    return (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" });
  });
}
