import React from "react";
import { Helmet } from "react-helmet-async";
import { SEO_DEFAULTS, SITE_URL } from "../seo/routeSeo.js";
import { developerProfile, faqs } from "../content/publicContent.js";

function toAbsoluteUrl(value) {
  if (!value) return SITE_URL;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

function createBreadcrumbList(pathname, pageTitle) {
  const cleanedPath = pathname === "/" ? "" : pathname;
  const segments = cleanedPath.split("/").filter(Boolean);

  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${SITE_URL}/`,
    },
  ];

  if (segments.length === 0) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: pageTitle,
      item: `${SITE_URL}${pathname}`,
    });
    return items;
  }

  segments.forEach((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}`;
    const fallbackLabel = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const isLast = index === segments.length - 1;

    items.push({
      "@type": "ListItem",
      position: index + 2,
      name: isLast ? pageTitle : fallbackLabel,
      item: `${SITE_URL}${path}`,
    });
  });

  return items;
}

export default function SEO({ pathname, meta = {} }) {
  const title = meta.title || SEO_DEFAULTS.title;
  const description = meta.description || SEO_DEFAULTS.description;
  const keywords = (meta.keywords && meta.keywords.length ? meta.keywords : SEO_DEFAULTS.keywords).join(", ");
  const canonical = toAbsoluteUrl(meta.canonical || pathname || "/");
  const image = toAbsoluteUrl(meta.image || SEO_DEFAULTS.image);
  const noIndex = Boolean(meta.noIndex);
  const fullTitle = title.includes(SEO_DEFAULTS.siteName) ? title : `${title} | ${SEO_DEFAULTS.siteName}`;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SEO_DEFAULTS.siteName,
    url: SITE_URL,
    logo: toAbsoluteUrl("/CardImgs/Logo.png"),
    sameAs: ["https://www.bitsathy.ac.in/"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "technical support",
        email: "developer@bitsathy.in",
        telephone: "+91-98437-77817",
        areaServed: "IN",
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SEO_DEFAULTS.siteName,
    alternateName: ["BIT CENTRAL", "BIT Sathy student portal"],
    url: SITE_URL,
    inLanguage: "en-IN",
    publisher: {
      "@type": "Organization",
      name: SEO_DEFAULTS.siteName,
      url: SITE_URL,
    },
  };

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SEO_DEFAULTS.siteName,
    url: SITE_URL,
    applicationCategory: "EducationApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires a modern web browser and JavaScript for protected student tools.",
    description: SEO_DEFAULTS.description,
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      audienceType: "BIT Sathy students",
    },
    creator: {
      "@type": "Person",
      "@id": `${SITE_URL}/developer#person`,
      name: developerProfile.name,
      url: `${SITE_URL}/developer`,
    },
  };

  const developerSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/developer#person`,
    name: developerProfile.name,
    url: `${SITE_URL}/developer`,
    email: developerProfile.email,
    telephone: developerProfile.phone,
    jobTitle: developerProfile.role,
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: developerProfile.institution,
      url: "https://www.bitsathy.ac.in/",
    },
    sameAs: developerProfile.sameAs,
    knowsAbout: ["React", "Vite", "student portals", "academic resources", "BIT Central"],
  };

  const breadcrumbItems = createBreadcrumbList(pathname || "/", title);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": meta.pageType || "WebPage",
    name: fullTitle,
    headline: title,
    description,
    url: canonical,
    isPartOf: {
      "@type": "WebSite",
      name: SEO_DEFAULTS.siteName,
      url: SITE_URL,
    },
    about: [
      { "@type": "Thing", name: "BIT Central" },
      { "@type": "CollegeOrUniversity", name: "Bannari Amman Institute of Technology", url: "https://www.bitsathy.ac.in/" },
      { "@type": "Thing", name: "BIT Sathy student portal" },
      { "@type": "Thing", name: "Academic resources" },
      { "@type": "Thing", name: "Question banks" },
      { "@type": "Thing", name: "Answer keys" },
      { "@type": "Thing", name: "Mess menu" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />
      <meta name="author" content="Jaison David M" />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={meta.type || SEO_DEFAULTS.type} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:site_name" content={SEO_DEFAULTS.siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(webApplicationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(developerSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(webpageSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      {meta.faq ? <script type="application/ld+json">{JSON.stringify(faqSchema)}</script> : null}
    </Helmet>
  );
}
