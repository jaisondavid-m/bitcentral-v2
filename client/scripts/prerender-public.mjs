import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const siteUrl = (process.env.VITE_SITE_URL || "https://bitcentral.bitsathy.in").replace(/\/$/, "");
const imageUrl = `${siteUrl}/CardImgs/cropped_circle_image.png`;
const developer = {
  name: "Jaison David M",
  role: "Developer of BIT Central",
  email: "developer@bitsathy.in",
  phone: "+91 98437 77817",
  institution: "Bannari Amman Institute of Technology, Sathyamangalam",
  sameAs: [
    "https://github.com/jaisondavid-m",
    "https://www.linkedin.com/in/jaison-david-m-a14072360/",
    "https://herostack.netlify.app/",
  ],
};

const faqs = [
  ["What is BIT Central?", "BIT Central is a student portal for Bannari Amman Institute of Technology, also known as BIT Sathy. It brings academic resources, question banks, answer keys, mess menu information, campus tools, and student service links into one web application."],
  ["Who can use BIT Central?", "BIT Central is designed for students of Bannari Amman Institute of Technology. Public pages can be viewed by anyone, while protected tools require a valid BIT Sathy institutional Google account."],
  ["How do I log in?", "Open the login page and sign in with your BIT Sathy Google account, typically an institutional email account connected to bitsathy.ac.in. After authentication, the portal opens the protected student dashboard and tools."],
  ["What resources are available?", "BIT Central includes academic resources such as question banks, answer keys, semester materials, exam hall utilities, reward points access, mess menu updates, leave schedule information, FindMyWay support, and campus service links."],
  ["Is BIT Central official?", "BIT Central is a student-focused portal for the BIT Sathy community. Users should treat institutional systems and college announcements as the final authority for official academic, administrative, and policy decisions."],
  ["Who developed BIT Central?", "BIT Central was developed by Jaison David M for the BIT Sathy student community. The project is built to help students of Bannari Amman Institute of Technology access academic resources, question banks, answer keys, mess menu information, reward points links, and campus service tools."],
];

const routes = [
  {
    path: "/",
    title: "BIT Central - BIT Sathy Student Portal",
    description: "BIT Central is a public guide and student portal for BIT Sathy students, covering academic resources, question banks, answer keys, mess menu updates, student services, and campus tools.",
    h1: "BIT Central",
    body: "BIT Central helps students of Bannari Amman Institute of Technology find academic resources, question banks, answer keys, mess menu updates, reward points access, exam utilities, and campus services from one place. BIT Central was developed by Jaison David M for the BIT Sathy student community.",
    faq: true,
  },
  {
    path: "/about",
    title: "About BIT Central | BIT Central",
    description: "Learn what BIT Central is, who can use it, who built it, and how it supports BIT Sathy students with academic resources and campus services.",
    h1: "BIT Central is a student portal for BIT Sathy",
    body: "BIT Central was developed by Jaison David M for students of Bannari Amman Institute of Technology. It organizes question banks, answer keys, semester resources, mess menu information, and student service tools.",
  },
  {
    path: "/developer",
    title: "BIT Central Developer - Jaison David M | BIT Central",
    description: "BIT Central was developed by Jaison David M for the BIT Sathy student community at Bannari Amman Institute of Technology.",
    h1: "BIT Central was developed by Jaison David M",
    body: "Jaison David M developed BIT Central as a student-focused web application for the Bannari Amman Institute of Technology community. BIT Central helps BIT Sathy students access academic resources, question banks, answer keys, mess menu information, reward points links, and campus service tools.",
  },
  {
    path: "/features",
    title: "BIT Central Features | BIT Central",
    description: "Explore BIT Central features for BIT Sathy students, including question banks, answer keys, semester resources, mess menu updates, reward points, and campus tools.",
    h1: "BIT Central features",
    body: "BIT Central includes academic resources, question banks, answer keys, semester PDFs, mess menu updates, reward points access, exam hall utilities, leave schedules, and campus resources.",
  },
  {
    path: "/wifi-details",
    title: "BIT Sathy Wi-Fi Passwords & Setup Guide | BIT Central",
    description: "Default Wi-Fi passwords for BIT Sathy campus networks, Sapphire Hostel, Ruby Hostel, Emerald Hostel, and step-by-step password change instructions.",
    h1: "BIT Sathy Wi-Fi Passwords & Setup Guide",
    body: "Reference guide for default Wi-Fi passwords across BIT Sathy campus and hostel blocks (Sapphire, Ruby, Emerald) with step-by-step instructions on changing router passwords.",
  },
  {
    path: "/faq",
    title: "BIT Central FAQ | BIT Central",
    description: "Answers to common questions about BIT Central, the BIT Sathy student portal for academic resources, question banks, answer keys, mess menu updates, and student services.",
    h1: "BIT Central FAQ",
    body: "This FAQ explains what BIT Central is, who can use it, how BIT Sathy students log in, what resources are available, and how official information should be verified.",
    faq: true,
  },
  {
    path: "/contact",
    title: "Contact BIT Central | BIT Central",
    description: "Contact and feedback information for BIT Central, including suggestions for academic resources, question banks, answer keys, and student service updates.",
    h1: "Contact BIT Central",
    body: "Students can share feedback, suggest updates, report missing question banks or answer keys, and find public information related to Bannari Amman Institute of Technology.",
  },
  {
    path: "/support-dev",
    title: "Support BIT Central Developer | BIT Central",
    description: "Support the developer of BIT Central to help maintain servers, update academic question banks, answer keys, and student services for BIT Sathy.",
    h1: "Support BIT Central Developer",
    body: "Support Jaison David M in developing and maintaining BIT Central, providing academic resources, question banks, answer keys, mess menu updates, and campus tools for Bannari Amman Institute of Technology.",
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy | BIT Central",
    description: "BIT Central privacy policy for students and visitors using public pages and protected student portal tools.",
    h1: "Privacy Policy",
    body: "This policy explains what BIT Central may collect from students and visitors, how that information is used, and how users can contact the developer about privacy questions.",
  },
  {
    path: "/terms",
    title: "Terms of Service | BIT Central",
    description: "BIT Central terms of service for public information pages and protected BIT Sathy student portal tools.",
    h1: "Terms of Service",
    body: "These terms explain responsible use of BIT Central, including public information pages and protected student tools for academic resources and campus services.",
  },
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;");
}

function schemaFor(route) {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "BIT Central",
      alternateName: ["BIT CENTRAL", "BIT Sathy student portal"],
      url: siteUrl,
      inLanguage: "en-IN",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "BIT Central",
      url: siteUrl,
      logo: `${siteUrl}/CardImgs/Logo.png`,
      sameAs: ["https://www.bitsathy.ac.in/"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "BIT Central",
      url: siteUrl,
      applicationCategory: "EducationApplication",
      operatingSystem: "Web",
      description: "BIT Central is a student portal for Bannari Amman Institute of Technology students.",
      creator: { "@type": "Person", "@id": `${siteUrl}/developer#person`, name: developer.name, url: `${siteUrl}/developer` },
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${siteUrl}/developer#person`,
      name: developer.name,
      url: `${siteUrl}/developer`,
      jobTitle: developer.role,
      email: developer.email,
      telephone: developer.phone,
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: developer.institution,
        url: "https://www.bitsathy.ac.in/",
      },
      sameAs: developer.sameAs,
    },
    {
      "@context": "https://schema.org",
      "@type": route.faq ? "FAQPage" : "WebPage",
      name: route.title,
      headline: route.h1,
      description: route.description,
      url: route.path === "/" ? `${siteUrl}/` : `${siteUrl}${route.path}`,
      about: ["BIT Central", "BIT Sathy student portal", "Academic resources", "Question banks", "Answer keys", "Mess menu"],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: route.h1, item: route.path === "/" ? `${siteUrl}/` : `${siteUrl}${route.path}` },
      ],
    },
  ];

  if (route.faq) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    });
  }

  return schemas.map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`).join("\n");
}

function routeHtml(indexHtml, route) {
  const canonical = route.path === "/" ? `${siteUrl}/` : `${siteUrl}${route.path}`;
  const faqHtml = route.faq
    ? `<section><h2>Frequently Asked Questions</h2>${faqs.map(([question, answer]) => `<h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p>`).join("")}</section>`
    : "";
  const staticContent = [
    "<div class=\"seo-prerendered-content\">",
    `<h1>${escapeHtml(route.h1)}</h1>`,
    `<p>${escapeHtml(route.body)}</p>`,
    "<nav><a href=\"/about\">About</a> <a href=\"/developer\">Developer</a> <a href=\"/features\">Features</a> <a href=\"/faq\">FAQ</a> <a href=\"/contact\">Contact</a> <a href=\"/login\">Login</a></nav>",
    faqHtml,
    "</div>",
  ].join("");
  const head = [
    `<title>${escapeHtml(route.title)}</title>`,
    `<meta name="description" content="${escapeHtml(route.description)}">`,
    "<meta name=\"robots\" content=\"index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1\">",
    `<link rel="canonical" href="${canonical}">`,
    "<meta property=\"og:type\" content=\"website\">",
    "<meta property=\"og:site_name\" content=\"BIT Central\">",
    `<meta property="og:title" content="${escapeHtml(route.title)}">`,
    `<meta property="og:description" content="${escapeHtml(route.description)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:image" content="${imageUrl}">`,
    "<meta name=\"twitter:card\" content=\"summary_large_image\">",
    `<meta name="twitter:title" content="${escapeHtml(route.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}">`,
    `<meta name="twitter:image" content="${imageUrl}">`,
    schemaFor(route),
  ].join("\n");

  return indexHtml
    .replace(/<title>.*?<\/title>/s, "")
    .replace(/<meta\s+name="description"[\s\S]*?>\s*/gi, "")
    .replace(/<meta\s+name="robots"[\s\S]*?>\s*/gi, "")
    .replace(/<link\s+rel="canonical"[\s\S]*?>\s*/gi, "")
    .replace(/<meta\s+property="og:[\s\S]*?>\s*/gi, "")
    .replace(/<meta\s+name="twitter:[\s\S]*?>\s*/gi, "")
    .replace("</head>", `${head}\n</head>`)
    .replace("<div id=\"root\"></div>", `<div id="root">${staticContent}</div>`);
}

const indexHtml = await readFile(path.join(distDir, "index.html"), "utf8");

for (const route of routes) {
  const html = routeHtml(indexHtml, route);
  if (route.path === "/") {
    await writeFile(path.join(distDir, "index.html"), html, "utf8");
    continue;
  }

  const routeDir = path.join(distDir, route.path.slice(1));
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, "index.html"), html, "utf8");
}

console.log(`Prerendered ${routes.length} public routes into dist/`);
