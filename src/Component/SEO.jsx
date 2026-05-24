import React from "react";
import { Helmet } from "react-helmet-async";
import { SEO_DEFAULTS, SITE_URL } from "../seo/routeSeo.js";

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
      item: `${SITE_URL}/home`,
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
  const canonical = toAbsoluteUrl(pathname || "/");
  const image = toAbsoluteUrl(meta.image || SEO_DEFAULTS.image);
  const noIndex = Boolean(meta.noIndex);
  const fullTitle = `${title} | ${SEO_DEFAULTS.siteName}`;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SEO_DEFAULTS.siteName,
    url: SITE_URL,
    logo: toAbsoluteUrl("/CardImgs/Logo.png"),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
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
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/home?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumbItems = createBreadcrumbList(pathname || "/", title);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={meta.type || SEO_DEFAULTS.type} />
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
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
    </Helmet>
  );
}