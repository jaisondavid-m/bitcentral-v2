# Digital Asset Links Verification Guide

## What is Digital Asset Links?

When an Android Trusted Web Activity (TWA) launches, Android verifies the cryptographic association between the Android package (`in.bitsathy.bitcentral`) and the production website domain (`bitcentral.bitsathy.in`).

* **If verification SUCCEEDS:** The application launches in true standalone mode with **zero browser address bars**, looking and feeling exactly like a 100% native Android app.
* **If verification FAILS:** Chrome displays a browser URL bar at the top with a lock icon.

---

## 1. Digital Asset Links File

The manifest is located at:
`client/public/.well-known/assetlinks.json`

And after `npm run build`, it is copied to:
`client/dist/.well-known/assetlinks.json`

### File Content

```json
[
  {
    "relation": [
      "delegate_permission/common.handle_all_urls"
    ],
    "target": {
      "namespace": "android_app",
      "package_name": "in.bitsathy.bitcentral",
      "sha256_cert_fingerprints": [
        "8C:BB:1A:86:83:6C:D3:1C:0D:39:C3:11:A0:FE:27:35:7F:41:09:AB:54:D2:79:B8:89:5B:F5:6E:20:43:CB:EF"
      ]
    }
  }
]
```

---

## 2. Server Deployment Requirements

The file must be publicly reachable over HTTPS at:
`https://bitcentral.bitsathy.in/.well-known/assetlinks.json`

### Mandatory HTTP Headers
1. `Content-Type: application/json`
2. `Access-Control-Allow-Origin: *`
3. Status code `200 OK` (No HTTP redirects `301`/`302` allowed by Google TWA verifier).

---

## 3. Configuration by Hosting Provider

### Option A: Vercel (Configured in `client/vercel.json`)
```json
{
  "headers": [
    {
      "source": "/.well-known/assetlinks.json",
      "headers": [
        { "key": "Content-Type", "value": "application/json" },
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
```

### Option B: Cloudflare Pages / Netlify (Configured in `client/public/_headers`)
```ini
/.well-known/assetlinks.json
  Cache-Control: public, max-age=86400
  Content-Type: application/json; charset=utf-8
  Access-Control-Allow-Origin: *
```

### Option C: Nginx / Docker
```nginx
location /.well-known/assetlinks.json {
    default_type application/json;
    add_header Access-Control-Allow-Origin *;
    add_header Cache-Control "public, max-age=86400";
}
```

---

## 4. Google Play App Signing (Dual Fingerprints)

When you upload `app-release.aab` to Google Play Console, Google re-signs your app with the **Play App Signing key**.

1. Go to **Google Play Console** -> Select **BIT Central**.
2. Navigate to **Release** -> **Setup** -> **App Integrity**.
3. Under **App signing key certificate**, copy the **SHA-256 certificate fingerprint**.
4. Add that second fingerprint into `assetlinks.json`:

```json
[
  {
    "relation": [
      "delegate_permission/common.handle_all_urls"
    ],
    "target": {
      "namespace": "android_app",
      "package_name": "in.bitsathy.bitcentral",
      "sha256_cert_fingerprints": [
        "8C:BB:1A:86:83:6C:D3:1C:0D:39:C3:11:A0:FE:27:35:7F:41:09:AB:54:D2:79:B8:89:5B:F5:6E:20:43:CB:EF",
        "<PASTE_GOOGLE_PLAY_APP_SIGNING_SHA256_HERE>"
      ]
    }
  }
]
```

---

## 5. Verifying Digital Asset Links Online

You can test that Google's verifier accepts your assetlinks file using Google's Statement List verification API:

```powershell
curl -s "https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://bitcentral.bitsathy.in&relation=delegate_permission/common.handle_all_urls"
```
Or via the Google Asset Links Assistant online testing tool:
[Google Statement List Verification Tool](https://developers.google.com/digital-asset-links/tools/generator)

