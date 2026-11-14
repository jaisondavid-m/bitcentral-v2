import {
  Users,
  Contact,
  LayoutGrid,
  CalendarDays,
  BellRing,
  MessageSquare,
  Mail,
  Heart,
  ShieldAlert,
} from "lucide-react";

export const CURRENT_YEAR = new Date().getFullYear();
export const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

export const ADMIN_TABS = [
  {
    key: "users",
    label: "Users",
    href: "/admin/users",
    icon: Users,
    color: "blue",
    badge: "User Accounts",
    description: "Manage registered user accounts, system roles, admin permissions, and account access status.",
  },
  {
    key: "user-directory",
    label: "User Directory",
    href: "/admin/user-directory",
    icon: Contact,
    color: "indigo",
    badge: "Tracker Students",
    description: "Flexible search and view directory of student tracker profiles, batches, departments, and phone numbers.",
  },
  {
    key: "cards",
    label: "Cards & Links",
    href: "/admin/cards",
    icon: LayoutGrid,
    color: "cyan",
    badge: "Home Portals",
    description: "Control home screen portal cards, custom external links, visual badges, and drag-and-drop order.",
  },
  {
    key: "mess",
    label: "Mess Menu",
    href: "/admin/mess",
    icon: CalendarDays,
    color: "emerald",
    badge: "Daily Meals",
    description: "Upload and schedule boys & girls mess menu CSVs, meal closures, and inspect weekly menus.",
  },
  {
    key: "leaves",
    label: "Leave & Holidays",
    href: "/admin/leaves",
    icon: CalendarDays,
    color: "amber",
    badge: "College Calendar",
    description: "Configure college holidays, General Permission (GP), half-day sessions (FN/AN), and date schedules.",
  },
  {
    key: "notifications",
    label: "Notifications",
    href: "/admin/notifications",
    icon: BellRing,
    color: "rose",
    badge: "Announcements",
    description: "Dispatch campus-wide broadcasts and targeted alerts to specific students with live modal popups.",
  },
  {
    key: "feedback",
    label: "Feedback & Chats",
    href: "/admin/feedback",
    icon: MessageSquare,
    color: "blue",
    badge: "Support Desk",
    description: "Chat in real-time with students, answer queries, track feedback status, and send instant replies.",
  },
  {
    key: "mail",
    label: "Mail Sender",
    href: "/admin/mail",
    icon: Mail,
    color: "violet",
    badge: "SMTP & Queue",
    description: "Compose and dispatch direct or bulk HTML emails with live delivery queue logs and retry management.",
  },
  {
    key: "sponsors",
    label: "Sponsors & Donors",
    href: "/admin/sponsors",
    icon: Heart,
    color: "pink",
    badge: "Support Dev",
    description: "Track student supporters, Razorpay contributions, department leaderboards, and transaction logs.",
  },
  {
    key: "audit-logs",
    label: "Audit Logs",
    href: "/admin/audit-logs",
    icon: ShieldAlert,
    color: "amber",
    badge: "Security & DB 3",
    description: "Monitor live HTTP requests, API latency, user actions, IP addresses, and response status codes.",
  },
];

export function getAdminTabFromPath(pathname) {
  if (pathname === "/admin" || pathname === "/admin/") return "overview";
  if (pathname.startsWith("/admin/audit-logs")) return "audit-logs";
  if (pathname.startsWith("/admin/user-directory")) return "user-directory";
  if (pathname.startsWith("/admin/sponsors")) return "sponsors";
  if (pathname.startsWith("/admin/cards")) return "cards";
  if (pathname.startsWith("/admin/mess")) return "mess";
  if (pathname.startsWith("/admin/leaves")) return "leaves";
  if (pathname.startsWith("/admin/notifications")) return "notifications";
  if (pathname.startsWith("/admin/feedback")) return "feedback";
  if (pathname.startsWith("/admin/mail-sender") || pathname.startsWith("/admin/mail")) return "mail";
  if (pathname.startsWith("/admin/users")) return "users";
  return "overview";
}

export const DEPARTMENT_MASTER = {
  cs: { code: "CS", alt: "CSE", name: "Computer Science & Engineering (CS / CSE)" },
  ad: { code: "AD", alt: "AI&DS", name: "Artificial Intelligence & Data Science (AD / AI&DS)" },
  al: { code: "AL", alt: "AIML", name: "Artificial Intelligence & Machine Learning (AL / AIML)" },
  it: { code: "IT", alt: "IT", name: "Information Technology (IT)" },
  ec: { code: "EC", alt: "ECE", name: "Electronics & Communication Engineering (EC / ECE)" },
  ee: { code: "EE", alt: "EEE", name: "Electrical & Electronics Engineering (EE / EEE)" },
  ei: { code: "EI", alt: "EIE", name: "Electronics & Instrumentation Engineering (EI)" },
  me: { code: "ME", alt: "MECH", name: "Mechanical Engineering (ME / MECH)" },
  ce: { code: "CE", alt: "CIVIL", name: "Civil Engineering (CE / CIVIL)" },
  ag: { code: "AG", alt: "AGRI", name: "Agricultural Engineering (AG / AGRI)" },
  bt: { code: "BT", alt: "BT", name: "Biotechnology (BT)" },
  ft: { code: "FT", alt: "FT", name: "Fashion Technology (FT)" },
  fd: { code: "FD", alt: "FD", name: "Food Department / Food Technology (FD)" },
  tx: { code: "TX", alt: "TXT", name: "Textile Technology / Department (TX)" },
  bm: { code: "BM", alt: "BME", name: "Biomedical Engineering (BM / BME)" },
  mb: { code: "MB", alt: "MBA", name: "Management Studies (MB / MBA)" },
  cb: { code: "CB", alt: "CSBS", name: "Computer Science & Business Systems (CB / CSBS)" },
  cd: { code: "CD", alt: "CSD", name: "Computer Design (CD / CSD)" },
  ct: { code: "CT", alt: "CT", name: "Computer Technology (CT)" },
  mz: { code: "MZ", alt: "MCTR", name: "Mechatronics Engineering (MZ)" },
};

export const DEFAULT_DEPARTMENTS_LIST = [
  { code: "ALL", name: "All Departments" },
  { code: "CS", name: "Computer Science & Engineering (CS / CSE)" },
  { code: "AD", name: "Artificial Intelligence & Data Science (AD / AI&DS)" },
  { code: "AL", name: "Artificial Intelligence & Machine Learning (AL / AIML)" },
  { code: "IT", name: "Information Technology (IT)" },
  { code: "EC", name: "Electronics & Communication Engineering (EC / ECE)" },
  { code: "EE", name: "Electrical & Electronics Engineering (EE / EEE)" },
  { code: "EI", name: "Electronics & Instrumentation Engineering (EI)" },
  { code: "ME", name: "Mechanical Engineering (ME / MECH)" },
  { code: "CE", name: "Civil Engineering (CE / CIVIL)" },
  { code: "AG", name: "Agricultural Engineering (AG / AGRI)" },
  { code: "BT", name: "Biotechnology (BT)" },
  { code: "FT", name: "Fashion Technology (FT)" },
  { code: "FD", name: "Food Department / Food Technology (FD)" },
  { code: "TX", name: "Textile Technology / Department (TX)" },
  { code: "BM", name: "Biomedical Engineering (BM / BME)" },
  { code: "MB", name: "Management Studies (MB / MBA)" },
  { code: "CB", name: "Computer Science & Business Systems (CB / CSBS)" },
  { code: "CD", name: "Computer Design (CD / CSD)" },
  { code: "CT", name: "Computer Technology (CT)" },
  { code: "MZ", name: "Mechatronics Engineering (MZ)" },
];

export function parseStudentEmail(email) {
  if (!email || typeof email !== "string") return null;
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail.endsWith("@bitsathy.ac.in")) return null;

  const username = cleanEmail.split("@")[0];
  const parts = username.split(".");
  if (parts.length < 2) return null;

  const deptYear = parts[parts.length - 1];
  const match = deptYear.match(/^([a-z]{2})(\d{2})$/);
  if (!match) return null;

  const rawDept = match[1];
  const yearTwoDigits = match[2];
  const fullYear = 2000 + parseInt(yearTwoDigits, 10);

  const deptInfo = DEPARTMENT_MASTER[rawDept] || {
    code: rawDept.toUpperCase(),
    alt: rawDept.toUpperCase(),
    name: `${rawDept.toUpperCase()} Department`,
  };

  return {
    email: cleanEmail,
    deptCode: deptInfo.code,
    deptAlt: deptInfo.alt,
    deptName: deptInfo.name,
    yearCode: yearTwoDigits,
    fullYear: String(fullYear),
  };
}
