# Google Play Store Publishing Guide - BIT Central

This document details every step required to publish **BIT Central** (`in.bitsathy.bitcentral`) to the Google Play Store using your built Android App Bundle.

---

## 1. Release Deliverables Checklist

All required assets have been created in the repository:

* [x] **Signed App Bundle (.aab):** `android/app/build/outputs/bundle/release/app-release.aab`
* [x] **Signed APK for Testing (.apk):** `android/app/build/outputs/apk/release/app-release.apk`
* [x] **High-Res App Icon (512 × 512 PNG):** `android/store_icon.png`
* [x] **Feature Graphic (1024 × 500 PNG):** `android/feature_graphic.png`
* [x] **Screenshots (Wide 1280 × 720 & Narrow 720 × 1280):** `client/public/icons/screenshot-*.png`
* [x] **Release Keystore:** `android/bitcentral-release.keystore`
* [x] **Digital Asset Links:** `client/public/.well-known/assetlinks.json`

---

## 2. Store Listing Information

### App Name
**BIT Central** (or `BIT Central - BIT Sathy Student Portal`)

### Short Description (Up to 80 characters)
> The official student portal for BIT Sathy resources, question banks & mess menu.

### Full Description (Up to 4000 characters)
```text
BIT Central is the unified academic and campus services portal designed specifically for students and faculty of Bannari Amman Institute of Technology (BIT Sathy).

Key Features:
- Question Bank & Answer Keys: Access previous semester question papers, model papers, and verified answer keys across all engineering departments.
- Campus Mess Menus: Live updates on daily and weekly menus across all student dining halls.
- Hall Finder: Instantly locate examination halls, department classrooms, and campus labs.
- GPA & CGPA Calculator: Accurately calculate semester grade point averages and projected CGPA with autonomous credit regulation schemas.
- Faculty Directory: Contact information, cabins, and office hours for institute professors and department heads.
- Student Leave & Gate Pass Portal: Direct integration with campus transit and outing services.
- Offline Capability: Fast, instant-loading offline support for saved question papers and schedule information.

Built with performance, privacy, and seamless mobile responsiveness for the entire BIT community.
```

### Categorization
* **Application Category:** Education / Productivity
* **Tags:** College, Education, Student Portal, Productivity, Utilities

### Contact Information
* **Email:** developer@bitsathy.ac.in (or your administrative contact email)
* **Website:** `https://bitcentral.bitsathy.in`
* **Privacy Policy URL:** `https://bitcentral.bitsathy.in/privacy-policy`

---

## 3. Data Safety Form Preparation

Based on the codebase inspection:

1. **Does the app collect or share user data?**
   * **Yes**.
2. **What data is collected?**
   * **Personal Info:** Name, Email address (`@bitsathy.ac.in` Google Workspace accounts for student authentication).
   * **User IDs:** Google User ID.
   * **Financial Info (Optional):** Purchase history / transaction IDs for donations via Razorpay (no card/UPI details stored on BIT servers).
   * **App Activity & Performance:** Crash logs and page interaction analytics (Vercel Analytics, Google Analytics).
3. **Is user data encrypted in transit?**
   * **Yes**, all communications use HTTPS (TLS 1.2+).
4. **Can users request account or data deletion?**
   * **Yes**, through the institutional admin or developer contact email.

---

## 4. App Access & Review Instructions (Crucial for Google Play Reviewers)

Google Play reviewers test the app before approval. Because BIT Central restricts login to `@bitsathy.ac.in` domain accounts:

1. In Google Play Console -> **Policy** -> **App Content** -> **App access**.
2. Select **"All or some functionality is restricted"**.
3. Click **Add new instructions**:
   * **Title:** Institutional Student Login
   * **Username / Email:** Provide a dedicated test account (e.g. `guest.tester@bitsathy.ac.in`) or explain that public pages (Question Banks, Guides, Mess Menu, GPA Calculator) are accessible without logging in.
   * **Password / Credentials:** Provide test credentials or instructions.
   * **Notes:** "BIT Central uses Google OAuth for institutional login. Public sections (Landing, Guides, Features, Mess Menu) are completely accessible without sign-in."

---

## 5. Step-by-Step Publishing Steps on Google Play Console

### Step 1: Create the Application
1. Log in to [Google Play Console](https://play.google.com/console).
2. Click **Create app**.
3. Set **App name**: `BIT Central`.
4. Default language: **English (United States)**.
5. App or game: **App**. Free or paid: **Free**.
6. Accept Declarations and click **Create app**.

### Step 2: Complete the Dashboard Tasks
Under **Set up your app**:
1. **Privacy policy**: Enter `https://bitcentral.bitsathy.in/privacy-policy`.
2. **App access**: Enter the review instructions prepared in Section 4.
3. **Ads**: Select "No, my app does not contain ads" (or Yes if AdSense is active on your domain).
4. **Content rating**: Complete the questionnaire (Educational utility -> Rating: Everyone / 3+).
5. **Target audience**: Select age 18 and over (University students).
6. **Data safety**: Fill out according to Section 3.
7. **Government apps**: Select "No".
8. **Financial features**: Select "None" or "Personal finance / donation".

### Step 3: Set Up Store Listing
1. Navigate to **Grow** -> **Store presence** -> **Main store listing**.
2. Paste the **Short description** and **Full description**.
3. Upload **App icon**: `android/store_icon.png` (512 × 512).
4. Upload **Feature graphic**: `android/feature_graphic.png` (1024 × 500).
5. Upload phone screenshots from `client/public/icons/`:
   * `screenshot-narrow.png` (Mobile portrait view)
   * `screenshot-wide.png` (Tablet / wide dashboard view)

### Step 4: Create Internal Testing Release
1. Navigate to **Release** -> **Testing** -> **Internal testing**.
2. Click **Create new release**.
3. Upload `android/app/build/outputs/bundle/release/app-release.aab`.
4. Release name: `1.0.0 (1)`.
5. Release notes:
   ```text
   Initial production release of BIT Central for Android.
   - Fast access to course question papers and answer keys
   - Live campus mess menus and dining schedules
   - Exam hall finder and GPA calculator
   - Offline support for academic resources
   ```
6. Click **Next** -> **Save and publish to Internal testing**.

### Step 5: Configure Digital Asset Links in Production
1. In Google Play Console, go to **Release** -> **Setup** -> **App Integrity**.
2. Copy the **SHA-256 certificate fingerprint** from the **App signing key certificate**.
3. If different from the upload certificate, append it to `client/public/.well-known/assetlinks.json`.
4. Deploy the website to production.
5. Verify on your phone that launching BIT Central opens full screen with no browser URL bar!

