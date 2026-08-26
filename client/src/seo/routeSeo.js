export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://bitcentral.bitsathy.in").replace(/\/$/, "");

export const SEO_DEFAULTS = {
  siteName: "BIT Central",
  title: "BIT Central Student Portal",
  description:
    "BIT Central is a student portal for Bannari Amman Institute of Technology that helps BIT Sathy students access academic resources, question banks, answer keys, mess menu updates, and campus services.",
  keywords: [
    "BIT Central",
    "Bannari Amman Institute of Technology",
    "BIT Sathy",
    "BIT Sathy student portal",
    "student portal",
    "academic resources",
    "question banks",
    "answer keys",
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
    title: "BIT Central - BIT Sathy Student Portal",
    description:
      "BIT Central is a public guide and student portal for BIT Sathy students, covering academic resources, question banks, answer keys, mess menu updates, student services, and campus tools.",
    keywords: ["BIT Central", "BIT Sathy student portal", "academic resources", "question banks", "answer keys", "mess menu"],
    pageType: "CollectionPage",
    faq: true,
  },

  "/login": {
    title: "Login to BIT Central",
    description: "Sign in with a BIT Sathy institutional Google account to access protected BIT Central student tools.",
    keywords: ["BIT Central login", "BIT Sathy login", "student sign in"],
    noIndex: true,
  },

  "/student-report": {
    title: "Student Detailed Report - BIT Central",
    description: "Detailed student profile report, attendance, personalized skills, assessment logs, points, and academic details.",
    keywords: ["student report", "BIT Central student profile", "attendance report", "PS skills"],
  },

  "/ps-assessment-history": {
    title: "PS Assessment History - BIT Central",
    description: "View PS assessment details including cleared/not cleared results, timing, venue, and course names for student ID 2025UCS1023.",
    keywords: ["PS Assessment History", "PS skills", "assessment logs", "BIT Central"],
    noIndex: true,
  },

  "/ps-assessment": {
    title: "PS Assessment History - BIT Central",
    description: "View PS assessment details including cleared/not cleared results, timing, venue, and course names for student ID 2025UCS1023.",
    keywords: ["PS Assessment History", "PS skills", "assessment logs", "BIT Central"],
    noIndex: true,
  },

  "/home": {
    title: "Student Home",
    description: "Protected BIT Central home page for academic tools, exam support, reward points, and student services.",
    keywords: ["BIT Central home", "student dashboard", "campus tools"],
    noIndex: true,
  },

  "/dashboard": {
    title: "Student Profile Dashboard",
    description: "Protected BIT Central dashboard for student profile, department details, and account activity.",
    keywords: ["student profile", "BIT dashboard", "account details"],
    noIndex: true,
  },

  "/profile": {
    title: "My Profile",
    description: "Protected BIT Central profile page for student account information.",
    keywords: ["my profile", "student profile", "BIT Central"],
    noIndex: true,
  },

  "/profile/v2": {
    title: "My Profile V2",
    description: "Protected BIT Central profile v2 page for student account information.",
    keywords: ["my profile", "student profile", "BIT Central"],
    noIndex: true,
  },

  "/about": {
    title: "About BIT Central",
    description:
      "Learn what BIT Central is, who can use it, who built it, and how it supports BIT Sathy students with academic resources and campus services.",
    keywords: ["about BIT Central", "Bannari Amman Institute of Technology", "BIT Sathy", "student resources"],
    pageType: "AboutPage",
  },

  "/developer": {
    title: "BIT Central Developer - Jaison David M",
    description:
      "BIT Central was developed by Jaison David M for the BIT Sathy student community at Bannari Amman Institute of Technology.",
    keywords: ["BIT Central developer", "Jaison David M", "BIT Sathy", "Bannari Amman Institute of Technology"],
    pageType: "ProfilePage",
  },

  "/features": {
    title: "BIT Central Features",
    description:
      "Explore BIT Central features for BIT Sathy students, including question banks, answer keys, semester resources, mess menu updates, reward points, and campus tools.",
    keywords: ["BIT Central features", "question banks", "answer keys", "mess menu", "campus resources"],
    pageType: "CollectionPage",
  },

  "/faq": {
    title: "BIT Central FAQ",
    description:
      "Answers to common questions about BIT Central, the BIT Sathy student portal for academic resources, question banks, answer keys, mess menu updates, and student services.",
    keywords: ["BIT Central FAQ", "BIT Sathy student portal", "academic resources FAQ"],
    pageType: "FAQPage",
    faq: true,
  },

  "/contact": {
    title: "Contact BIT Central",
    description:
      "Contact and feedback information for BIT Central, including suggestions for academic resources, question banks, answer keys, and student service updates.",
    keywords: ["contact BIT Central", "BIT Sathy feedback", "student portal contact"],
    pageType: "ContactPage",
  },

  "/privacy-policy": {
    title: "Privacy Policy",
    description:
      "BIT Central privacy policy for students and visitors using public pages and protected student portal tools.",
    keywords: ["BIT Central privacy policy", "student portal privacy", "BIT Sathy"],
    pageType: "WebPage",
  },

  "/terms": {
    title: "Terms of Service",
    description:
      "BIT Central terms of service for public information pages and protected BIT Sathy student portal tools.",
    keywords: ["BIT Central terms", "student portal terms", "BIT Sathy"],
    pageType: "WebPage",
  },

  "/rpsite": {
    title: "Reward Points",
    description: "Protected BIT Central reward points access page for signed-in BIT Sathy students.",
    keywords: ["BIT Sathy reward points", "BIT Central"],
    noIndex: true,
  },

  "/pcdp": {
    title: "PCDP Setup",
    description: "Protected BIT Central PCDP setup support page for signed-in BIT Sathy students.",
    keywords: ["PCDP", "BIT Central"],
    noIndex: true,
  },

  "/findmyway": {
    title: "FindMyWay",
    description: "Protected BIT Central FindMyWay installation support page for signed-in BIT Sathy students.",
    keywords: ["FindMyWay", "BIT Sathy campus resources"],
    noIndex: true,
  },

  "/apsite": {
    title: "PS Rewards Breakdown",
    description: "Look up and review PS activity reward breakdowns by user ID.",
    keywords: ["PS rewards", "activity points", "reward breakdown"],
    noIndex: true,
  },

  "/exam-hall": {
    title: "Exam Hall Utility",
    description: "Protected BIT Central exam hall utility for signed-in BIT Sathy students.",
    keywords: ["BIT Sathy exam hall", "exam hall utility"],
    noIndex: true,
  },

  "/exam-hall-manual": {
    title: "Exam Hall Manual Search",
    description: "Protected BIT Central manual exam hall search for signed-in BIT Sathy students.",
    keywords: ["BIT Sathy exam hall search"],
    noIndex: true,
  },

  "/leavedetails": {
    title: "Leave Schedule",
    description: "Protected BIT Central leave schedule page for signed-in BIT Sathy students.",
    keywords: ["BIT Sathy leave schedule"],
    noIndex: true,
  },

  "/semester": {
    title: "Semester Resources",
    description: "Protected BIT Central semester resources page with academic materials for signed-in BIT Sathy students.",
    keywords: ["semester resources", "question banks", "answer keys", "BIT Sathy"],
    noIndex: true,
  },

  "/mess": {
    title: "Mess Menu",
    description: "Protected BIT Central mess menu page for signed-in BIT Sathy students.",
    keywords: ["BIT Sathy mess menu", "hostel mess menu"],
    noIndex: true,
  },

  "/user-directory": {
    title: "User Directory",
    description: "Search and explore user directory records across User ID, ID, Name, and Email.",
    keywords: ["user directory", "tracker users", "student search", "user search"],
    noIndex: true,
  },

  "/ak_22ph202": {
    title: "22PH202 Answer Key",
    description: "Protected BIT Central answer key resource for signed-in BIT Sathy students.",
    keywords: ["22PH202 answer key", "BIT Sathy answer key"],
    noIndex: true,
  },

  "/tamil_ak": {
    title: "22HS006 Answer Key",
    description: "Protected BIT Central Tamil answer key resource for signed-in BIT Sathy students.",
    keywords: ["22HS006 answer key", "BIT Sathy Tamil answer key"],
    noIndex: true,
  },

  "/support-dev": {
    title: "Support BIT Central Developer",
    description:
      "Support Jaison David M in maintaining server hosting, database costs, and developing free student tools for the BIT Sathy community.",
    keywords: ["support developer", "BIT Central donation", "Razorpay support", "BIT Sathy student portal"],
    pageType: "WebPage",
  },

  "/wifi-details": {
    title: "BIT Sathy Wi-Fi Passwords & Setup Guide",
    description: "Default Wi-Fi passwords for BIT Sathy campus networks, Sapphire Hostel, Ruby Hostel, Emerald Hostel, and step-by-step password change instructions.",
    keywords: ["BIT Sathy Wi-Fi", "Sapphire Hostel Wi-Fi", "Ruby Hostel Wi-Fi", "Emerald Hostel Wi-Fi", "Wi-Fi password change", "BIT Sathy hostel Wi-Fi"],
    pageType: "WebPage",
  },

  "/payment-successful": {
    title: "Thank You for Supporting BIT Central!",
    description: "Verified contribution acknowledgment page with inspirational quotes for BIT Central supporters.",
    keywords: ["payment successful", "BIT Central patron", "donator honor"],
    noIndex: true,
  },

  "/docs/about": {
    title: "About BIT CENTRAL Documentation",
    description: "Learn about BIT CENTRAL features, mission, and system design.",
    keywords: ["BIT CENTRAL docs"],
  },

  "*": {
    title: "404 - Page Not Found",
    description: "The page you requested could not be found on BIT Central.",
    keywords: ["404", "page not found", "BIT Central"],
    noIndex: true,
  },
  "/ps-points": {
    title: "PS Point Details - BIT Central",
    description: "Track your Activity Points, Opportunity Points, and Responsive Score on BIT Central.",
    keywords: ["PS Points", "Activity Points", "Opportunity Points", "Responsive Score"],
    pageType: "CollectionPage",
  },
  "/ps-biometrics": {
    title: "PS Biometric Details - BIT Central",
    description: "View fingerprint punch-in logs and daily attendance session records on BIT Central.",
    keywords: ["PS Biometric", "Biometric Scans", "Daily Attendance", "Punch In Log"],
    pageType: "CollectionPage",
  },
};

export const SITEMAP_ROUTES = [
  "/",
  "/about",
  "/developer",
  "/features",
  "/wifi-details",
  "/faq",
  "/contact",
  "/support-dev",
  "/privacy-policy",
  "/terms",
  "/apsite",
];
