export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://bitcentral.bitsathy.in").replace(/\/$/, "");

export const SEO_DEFAULTS = {
  siteName: "BIT CENTRAL",
  title: "BIT CENTRAL",
  description:
    "BIT CENTRAL helps BIT students access academics, reward points, mess menu updates, leave schedules, and exam resources from one platform.",
  keywords: [
    "BIT CENTRAL",
    "Bannari Amman Institute of Technology",
    "BIT Sathy",
    "student portal",
    "semester resources",
    "reward points",
    "exam hall",
    "mess menu",
  ],
  image: "/CardImgs/cropped_circle_image.png",
  type: "website",
};

export const ROUTE_SEO = {
  "/": {
    title: "BIT CENTRAL",
    description: "Central student platform for academic and campus resources.",
    keywords: ["BIT CENTRAL", "student platform"],
  },
  "/login": {
    title: "Login",
    description: "Sign in securely to access your BIT CENTRAL dashboard and campus tools.",
    keywords: ["BIT CENTRAL login", "student sign in", "BITSATHY login"],
  },
  "/home": {
    title: "Home",
    description: "Discover academic tools, exam support, reward points, and student services in one place.",
    keywords: ["BIT CENTRAL home", "student dashboard", "campus tools"],
  },
  "/dashboard": {
    title: "Profile Dashboard",
    description: "View your student profile, department details, and account activity on BIT CENTRAL.",
    keywords: ["student profile", "BIT dashboard", "account details"],
  },
  "/profile": {
    title: "My Profile",
    description: "Manage your profile and review your account information on BIT CENTRAL.",
    keywords: ["my profile", "student profile", "BIT CENTRAL"],
  },
  "/about": {
    title: "About",
    description: "Learn about BIT CENTRAL, its mission, and available features for students.",
    keywords: ["about BIT CENTRAL", "campus platform", "student resources"],
  },
  "/rpsite": {
    title: "Reward Points",
    description: "Search reward points, view rankings, and track student performance metrics.",
    keywords: ["reward points", "student ranking", "BIT RP"],
  },
  "/pcdp": {
    title: "PCDP App",
    description: "Explore and download the PCDP app for personalized skill development.",
    keywords: ["PCDP", "skill development", "student app"],
  },
  "/findmyway": {
    title: "FindMyWay Install",
    description: "Download the FindMyWay Android app to locate buildings, rooms, labs, and campus venues.",
    keywords: ["FindMyWay", "campus navigation", "Android APK", "college location app"],
  },
  "/exam-hall": {
    title: "Exam Hall Finder",
    description: "Search your exam hall details quickly by register number and course code.",
    keywords: ["exam hall finder", "hall ticket support", "course code search"],
  },
  "/leavedetails": {
    title: "Leave Details",
    description: "Check ongoing, upcoming, and past leave schedules from one dashboard.",
    keywords: ["leave schedule", "student leave details", "BIT leave"],
  },
  "/semester": {
    title: "Semester Resources",
    description: "Browse semester question banks and answer keys for module tests and exams.",
    keywords: ["semester question bank", "answer key", "study materials"],
  },
  "/mess": {
    title: "Mess Menu",
    description: "View daily hostel mess menus by date, hostel, and meal type.",
    keywords: ["mess menu", "hostel food", "daily menu"],
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description: "Read how BIT CENTRAL collects, uses, and protects user data.",
    keywords: ["privacy policy", "data protection", "BIT CENTRAL privacy"],
  },
  "/terms": {
    title: "Terms of Service",
    description: "Review the terms and conditions for using BIT CENTRAL services.",
    keywords: ["terms of service", "BIT CENTRAL terms", "usage policy"],
  },
  "/ak_22ph202": {
    title: "22PH202 Answer Key",
    description: "Reference answer key for 22PH202 and related semester exam preparation.",
    keywords: ["22PH202", "answer key", "semester exam"],
  },
  "/admin": {
    title: "Admin Dashboard",
    description: "Administrative dashboard for managing users, cards, and resources.",
    keywords: ["admin dashboard", "manage users", "BIT CENTRAL admin"],
    noIndex: true,
  },
  "/admin/users": {
    title: "Admin Users",
    description: "Manage student users and activity visibility in BIT CENTRAL.",
    keywords: ["admin users", "user management", "BIT CENTRAL"],
    noIndex: true,
  },
  "/admin/qb": {
    title: "Admin QB",
    description: "Upload and manage question bank resources in the admin panel.",
    keywords: ["question bank admin", "manage resources", "BIT CENTRAL admin"],
    noIndex: true,
  },
  "/admin/cards": {
    title: "Admin Cards",
    description: "Create and manage homepage cards and card metadata.",
    keywords: ["admin cards", "homepage cards", "content management"],
    noIndex: true,
  },
  "*": {
    title: "404 - Page Not Found",
    description: "The page you requested could not be found on BIT CENTRAL.",
    keywords: ["404", "page not found", "BIT CENTRAL"],
    noIndex: true,
  },
};

export const SITEMAP_ROUTES = [
  "/",
  "/login",
  "/home",
  "/dashboard",
  "/profile",
  "/about",
  "/rpsite",
  "/pcdp",
  "/findmyway",
  "/exam-hall",
  "/leavedetails",
  "/semester",
  "/mess",
  "/privacy-policy",
  "/terms",
  "/ak_22ph202",
];