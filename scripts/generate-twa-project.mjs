import http from "http";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const clientDistDir = path.join(rootDir, "client", "dist");
const androidDir = path.join(rootDir, "android");

// 1. Temporary local static server to serve dist assets (icons, manifest)
const server = http.createServer((req, res) => {
  const safePath = path.normalize(decodeURIComponent(req.url.split("?")[0])).replace(/^(\.\.[\/\\])+/, "");
  let filePath = path.join(clientDistDir, safePath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  const mimeMap = {
    ".html": "text/html",
    ".json": "application/json",
    ".webmanifest": "application/manifest+json",
    ".png": "image/png",
    ".svg": "image/svg+xml"
  };
  res.writeHead(200, { "Content-Type": mimeMap[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
});

await new Promise((resolve) => server.listen(3099, "127.0.0.1", resolve));
console.log("Local asset server running on http://127.0.0.1:3099");

try {
  // Load bubblewrap core from npx cache or global
  const npxDir = "C:/Users/ACER/AppData/Local/npm-cache/_npx";
  let corePath = null;
  for (const id of fs.readdirSync(npxDir)) {
    const candidate = path.join(npxDir, id, "node_modules/@bubblewrap/core");
    if (fs.existsSync(candidate)) {
      corePath = candidate;
      break;
    }
  }

  if (!corePath) {
    throw new Error("Could not find @bubblewrap/core in npx cache");
  }

  const { TwaGenerator, TwaManifest, ConsoleLog } = await import(pathToFileURL(path.join(corePath, "dist/index.js")).href);

  const log = new ConsoleLog("twa-init");
  const generator = new TwaGenerator();

  const manifestData = {
    packageId: "in.bitsathy.bitcentral",
    host: "bitcentral.bitsathy.in",
    name: "BIT Central",
    launcherName: "BIT Central",
    display: "standalone",
    themeColor: "#2563eb",
    themeColorDark: "#0f172a",
    navigationColor: "#0f172a",
    navigationColorDark: "#0f172a",
    navigationDividerColor: "#334155",
    navigationDividerColorDark: "#334155",
    backgroundColor: "#0f172a",
    enableNotifications: true,
    startUrl: "/?utm_source=twa",
    iconUrl: "http://127.0.0.1:3099/icons/icon-512x512.png",
    maskableIconUrl: "http://127.0.0.1:3099/icons/icon-maskable-512x512.png",
    splashScreenFadeOutDuration: 300,
    signingKey: {
      path: path.join(androidDir, "bitcentral-release.keystore"),
      alias: "bitcentral"
    },
    appVersion: "1.0.0",
    appVersionCode: 1,
    shortcuts: [
      {
        name: "Question Bank",
        shortName: "Question Bank",
        url: "/#qb",
        chosenIconUrl: "http://127.0.0.1:3099/icons/icon-96x96.png"
      },
      {
        name: "Mess Menu",
        shortName: "Mess Menu",
        url: "/#mess",
        chosenIconUrl: "http://127.0.0.1:3099/icons/icon-96x96.png"
      },
      {
        name: "Hall Finder",
        shortName: "Hall Finder",
        url: "/#hallfinder",
        chosenIconUrl: "http://127.0.0.1:3099/icons/icon-96x96.png"
      },
      {
        name: "GPA Calculator",
        shortName: "GPA Calculator",
        url: "/#gpa",
        chosenIconUrl: "http://127.0.0.1:3099/icons/icon-96x96.png"
      }
    ],
    generatorApp: "bubblewrap-cli",
    webManifestUrl: "http://127.0.0.1:3099/manifest.webmanifest",
    fallbackType: "customtabs",
    features: {
      locationDelegation: { enabled: true }
    },
    alphaDependencies: { enabled: false },
    enableSiteSettingsShortcut: "true",
    orientation: "any"
  };

  const twaManifest = new TwaManifest(manifestData);

  console.log("Generating TWA Project in:", androidDir);
  await generator.createTwaProject(androidDir, twaManifest, log);

  // Write twa-manifest.json and checksum
  const manifestFile = path.join(androidDir, "twa-manifest.json");
  const manifestContent = JSON.stringify(manifestData, null, 2);
  fs.writeFileSync(manifestFile, manifestContent, "utf8");

  const checksum = crypto.createHash("sha1").update(manifestContent).digest("hex");
  fs.writeFileSync(path.join(androidDir, "manifest-checksum.txt"), checksum, "utf8");

  console.log("TWA Project generated successfully!");
} finally {
  server.close();
}
