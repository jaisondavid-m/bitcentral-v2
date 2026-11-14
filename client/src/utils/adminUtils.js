// Shared utility functions for Admin pages

export function normalizeError(error, fallback = "An unexpected error occurred") {
  return error?.response?.data?.message || error?.message || fallback;
}

export function parseISTDate(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed === "-") return null;

    if (/^\d{10,}$/.test(trimmed)) {
      const d = new Date(Number(trimmed));
      if (!Number.isNaN(d.getTime())) return d;
    }

    // Backend produces UTC timestamps formatted as "YYYY-MM-DD HH:mm:ss" without offset
    if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?(\.\d+)?$/.test(trimmed)) {
      const d = new Date(trimmed.replace(" ", "T") + "Z");
      if (!Number.isNaN(d.getTime())) return d;
    }

    const d = new Date(trimmed);
    if (!Number.isNaN(d.getTime())) return d;

    const fallbackDate = new Date(trimmed.replace(" ", "T"));
    if (!Number.isNaN(fallbackDate.getTime())) return fallbackDate;
  }
  return null;
}

export function formatDateTime(value) {
  const date = parseISTDate(value);
  if (!date) return "-";
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function isSeenToday(value) {
  const date = parseISTDate(value);
  if (!date) return false;
  const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const itemStr = date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  return todayStr === itemStr;
}

export function formatLastSeen(value) {
  const date = parseISTDate(value);
  if (!date) return "-";

  const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const itemStr = date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

  const timePart = date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (todayStr === itemStr) {
    return `Today, ${timePart}`;
  }

  const datePart = date.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    month: "short",
    day: "numeric",
  });

  return `${datePart}, ${timePart}`;
}

export function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function formatRouteLabel(value) {
  if (!value) return "-";
  return value;
}

export function formatBlockedAt(value) {
  if (!value) return "-";
  return formatDateTime(value);
}

export function parseDateValue(value) {
  const date = parseISTDate(value);
  return date ? date.getTime() : 0;
}

export function todayIST() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export function dateKeyFromValue(value) {
  const date = parseISTDate(value);
  if (!date) return "";
  return date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export function reorderList(items, fromIndex, toIndex) {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export const MESS_CSV_TEMPLATE = `date,day,meal_type,item
2026-04-01,Wednesday,Breakfast,Raw rice pongal
2026-04-01,Wednesday,Breakfast,Sambar
2026-04-01,Wednesday,Breakfast,Coffee/Milk/Tea
2026-04-01,Wednesday,Lunch,Rice
2026-04-01,Wednesday,Lunch,Brinjal Sambar
2026-04-01,Wednesday,Dinner,Chapatti
2026-04-01,Wednesday,Dinner,Egg masala
`;

export function downloadMessTemplate() {
  const blob = new Blob([MESS_CSV_TEMPLATE], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mess-menu-template.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
