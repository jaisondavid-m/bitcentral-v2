/**
 * Processes raw sponsor data from API response into an aggregated and sorted list of patrons.
 * Groups by normalized phone number, email, or name and sums up contribution amounts.
 */
export function cleanPhoneDigits(phone) {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

export function processLeaderboardData(sponsors = []) {
  if (!Array.isArray(sponsors)) return [];

  const aggregatedMap = new Map();

  sponsors.forEach((s) => {
    if (s.status && String(s.status).toLowerCase() !== "captured") {
      return;
    }

    const rawName = (s.name || "").trim();
    const phoneKey = cleanPhoneDigits(s.phone || s.contact);
    const rawEmail = (s.email || "").trim().toLowerCase();

    const normKey =
      rawEmail
        ? `email_${rawEmail}`
        : s.donor_key && !s.donor_key.startsWith("phone_")
        ? s.donor_key
        : `name_${rawName.toLowerCase() || s.id}`;

    const amt = Number(s.amount) || 0;

    if (aggregatedMap.has(normKey)) {
      const existing = aggregatedMap.get(normKey);
      existing.amount = (Number(existing.amount) || 0) + amt;
      if (rawName.length > (existing.name || "").length && rawName !== "Anonymous BITSian") {
        existing.name = rawName;
      }
      if (!existing.email && rawEmail) {
        existing.email = rawEmail;
      }
    } else {
      aggregatedMap.set(normKey, {
        ...s,
        donor_key: normKey,
        email: rawEmail || s.email,
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

/**
 * Robust check if a leaderboard sponsor item matches the current user.
 * Matches by donor_key, email, phone, or name+amount fallback.
 */
export function isCurrentUserSponsor(userContribution, sponsor, userEmail = "", userPhone = "") {
  if (!userContribution?.found && !userEmail && !userPhone) return false;

  const targetEmail = (userContribution?.email || userEmail || "").trim().toLowerCase();
  const sponsorEmail = (sponsor?.email || "").trim().toLowerCase();
  if (targetEmail && sponsorEmail && targetEmail === sponsorEmail) {
    return true;
  }

  const targetPhone = cleanPhoneDigits(userContribution?.phone || userPhone);
  const sponsorPhone = cleanPhoneDigits(sponsor?.phone || sponsor?.contact);
  if (targetPhone && sponsorPhone && targetPhone === sponsorPhone) {
    return true;
  }

  if (userContribution?.donor_key && sponsor?.donor_key && userContribution.donor_key === sponsor.donor_key) {
    return true;
  }

  if (
    userContribution?.name &&
    sponsor?.name &&
    userContribution.name.trim().toLowerCase() === sponsor.name.trim().toLowerCase() &&
    Number(userContribution.amount) === Number(sponsor.amount)
  ) {
    return true;
  }

  return false;
}
