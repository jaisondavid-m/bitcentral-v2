# JSON-LD schema templates

Use these as starting points for STRUCT-01 through STRUCT-06. Every value in angle brackets is a placeholder that must be replaced with a real value supplied by the user. Do not ship a file that still contains a placeholder. Embed each block inside a `<script type="application/ld+json">` tag (or the framework equivalent), and validate the JSON before shipping.

## Organization (site wide)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "<organization legal or brand name>",
  "url": "<https://canonical-domain>",
  "logo": "<https://canonical-domain/path-to-logo.png>",
  "sameAs": [
    "<https://www.linkedin.com/company/...>",
    "<https://x.com/...>",
    "<https://github.com/...>"
  ]
}
```

## WebSite with search action (site wide)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "<site name>",
  "url": "<https://canonical-domain>",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "<https://canonical-domain/search?q={search_term_string}>",
    "query-input": "required name=search_term_string"
  }
}
```

Include the SearchAction only if the site has a working search endpoint at that URL. If it does not, omit potentialAction rather than inventing a search path.

## BreadcrumbList (deep pages)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "<top level>", "item": "<https://canonical-domain/section>" },
    { "@type": "ListItem", "position": 2, "name": "<this page>", "item": "<https://canonical-domain/section/page>" }
  ]
}
```

## FAQPage (only where a visible FAQ exists)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "<the exact visible question>",
      "acceptedAnswer": { "@type": "Answer", "text": "<the exact visible answer>" }
    }
  ]
}
```

The questions and answers in the markup must match what the user actually sees on the page. Do not add FAQ markup to a page that has no visible FAQ.

## LocalBusiness (local or physical businesses only)

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "<business name>",
  "image": "<https://canonical-domain/photo.jpg>",
  "url": "<https://canonical-domain>",
  "telephone": "<+country and number>",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "<street>",
    "addressLocality": "<city>",
    "addressRegion": "<region>",
    "postalCode": "<postal code>",
    "addressCountry": "<country code>"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": "<lat>", "longitude": "<lng>" },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "<HH:MM>",
      "closes": "<HH:MM>"
    }
  ]
}
```

Keep the name, address, and phone identical to the values used elsewhere on the site (NAP consistency for STRUCT-06).
