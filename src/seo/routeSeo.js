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

  "/docs/about": {
    title: "About BIT CENTRAL Documentation",
    description: "Learn about BIT CENTRAL features, mission, and system design.",
    keywords: ["BIT CENTRAL docs"],
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
  "/docs/about",
];