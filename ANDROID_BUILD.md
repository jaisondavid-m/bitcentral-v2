# BIT Central - Android Trusted Web Activity (TWA) Build Guide

## Overview

The Android application is packaged using Google's official **Trusted Web Activity (TWA)** architecture, powered by AndroidX `androidbrowserhelper`. The app opens `https://bitcentral.bitsathy.in` in full-screen standalone mode using Chrome Custom Tabs without any browser URL bar.

---

## 1. Project Specifications

* **Application ID / Package Name:** `in.bitsathy.bitcentral`
* **Application Name:** `BIT Central`
* **Target Website:** `https://bitcentral.bitsathy.in/?utm_source=twa`
* **Minimum Android SDK:** API 24 (Android 7.0 Nougat)
* **Target Android SDK:** API 36 (Android 15)
* **Compile SDK:** API 36
* **Status Bar Theme Color:** `#2563eb` (Light) / `#0f172a` (Dark)
* **Splash Screen Background:** `#0f172a`
* **Signing Keystore:** `android/bitcentral-release.keystore`
* **Key Alias:** `bitcentral`

---

## 2. Prerequisites on Build Machine

1. **Java Development Kit:** JDK 17 (verified at `C:\Program Files\Java\jdk-17`).
2. **Android SDK:** Installed at `C:\Android\Sdk` with `build-tools`, `platform-tools`, `platforms;android-36`.
3. **Node.js & npm:** Node `v24+` and `npm 11+`.

---

## 3. Environment Setup (PowerShell)

Before running builds, ensure the environment variables point to your installed JDK and Android SDK:

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Android\Sdk"
$env:BUBBLEWRAP_KEYSTORE_PASSWORD = "bitcentral@2026"
$env:BUBBLEWRAP_KEY_PASSWORD = "bitcentral@2026"
```

---

## 4. Building the Signed Android App Bundle (.aab)

The Google Play Store requires apps to be uploaded as signed Android App Bundles (`.aab`).

Run the following command from the project root:

```powershell
cd android
.\gradlew.bat bundleRelease
```

### Output File
* **File Location:** `android/app/build/outputs/bundle/release/app-release.aab`
* **Size:** ~3.08 MB
* **Status:** Signed with `bitcentral-release.keystore` and optimized with R8 minification.

---

## 5. Building the Signed APK (.apk) for Local Testing

To test directly on an Android device or emulator without uploading to Google Play Console:

```powershell
cd android
.\gradlew.bat assembleRelease
```

### Output File
* **File Location:** `android/app/build/outputs/apk/release/app-release.apk`
* **Size:** ~2.94 MB

### Installing via ADB to Connected Phone
```powershell
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

---

## 6. Android Keystore Management

The production keystore was generated with RSA 2048-bit encryption valid for 10,000 days.

* **Keystore Path:** `android/bitcentral-release.keystore`
* **Alias:** `bitcentral`
* **SHA-256 Certificate Fingerprint:**
  `8C:BB:1A:86:83:6C:D3:1C:0D:39:C3:11:A0:FE:27:35:7F:41:09:AB:54:D2:79:B8:89:5B:F5:6E:20:43:CB:EF`
* **SHA-1 Fingerprint:**
  `EF:6D:6D:80:98:3A:3B:A6:AD:81:29:66:32:E9:2B:AE:01:E1:C1:0A`

> [!WARNING]
> Keep `android/bitcentral-release.keystore` backed up securely. If this keystore is permanently lost before configuring Google Play App Signing, future application updates cannot be published to Google Play.

