import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");

const siteUrl = (process.env.VITE_SITE_URL || "https://bitcentral.bitsathy.in").replace(/\/$/, "");
const routes = [
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

const now = new Date().toISOString();

const urls = routes
  .map((route) => {
    const loc = route === "/" ? `${siteUrl}/` : `${siteUrl}${route}`;
    return [
      "  <url>",
      `    <loc>${loc}</loc>`,
      `    <lastmod>${now}</lastmod>`,
      "    <changefreq>weekly</changefreq>",
      "    <priority>0.7</priority>",
      "  </url>",
    ].join("\n");
  })
  .join("\n");

const sitemap = [
  "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
  "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
  urls,
  "</urlset>",
  "",
].join("\n");

await mkdir(publicDir, { recursive: true });
await writeFile(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");

console.log("Sitemap generated at public/sitemap.xml");