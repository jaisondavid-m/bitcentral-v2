import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import FullScreenLoader from "@/components/common/FullScreenLoader.jsx";
import SEO from "@/components/common/SEO.jsx";
import DailySupportModal from "@/components/modals/DailySupportModal.jsx";
import FloatingMenu from "@/components/layout/FloatingMenu.jsx";
import ErrorBoundary from "@/components/common/ErrorBoundary.jsx";
import { lazyWithRetry } from "@/utils/lazyWithRetry.js";
import { ROUTE_SEO } from "@/seo/routeSeo.js";

const Login = lazyWithRetry(() => import("@/pages/public/Login.jsx"));
const LandingPage = lazyWithRetry(() => import("@/pages/public/LandingPage.jsx"));
const Dashboard = lazyWithRetry(() => import("@/pages/student/Dashboard.jsx"));
const ProfileV2 = lazyWithRetry(() => import("@/pages/student/ProfileV2.jsx"));
const Home = lazyWithRetry(() => import("@/pages/student/Home.jsx"));
const About = lazyWithRetry(() => import("@/pages/public/About.jsx"));
const Developer = lazyWithRetry(() => import("@/pages/public/Developer.jsx"));
const Features = lazyWithRetry(() => import("@/pages/public/Features.jsx"));
const FAQ = lazyWithRetry(() => import("@/pages/public/FAQ.jsx"));
const Contact = lazyWithRetry(() => import("@/pages/public/Contact.jsx"));
const PrivacyPolicy = lazyWithRetry(() => import("@/pages/public/PrivacyPolicy.jsx"));
const Terms = lazyWithRetry(() => import("@/pages/public/Terms.jsx"));
const Disclaimer = lazyWithRetry(() => import("@/pages/public/Disclaimer.jsx"));
const GuidesIndex = lazyWithRetry(() => import("@/pages/public/GuidesIndex.jsx"));
const GuideDetail = lazyWithRetry(() => import("@/pages/public/GuideDetail.jsx"));
const Rpsite = lazyWithRetry(() => import("@/pages/student/Rpsite.jsx"));
const Semester = lazyWithRetry(() => import("@/pages/student/Semester.jsx"));
const MessMenu = lazyWithRetry(() => import("@/pages/student/MessMenu.jsx"));
const PCDP = lazyWithRetry(() => import("@/pages/student/PCDP.jsx"));
const FindMyWay = lazyWithRetry(() => import("@/pages/student/FindMyWay.jsx"));
const Apsite = lazyWithRetry(() => import("@/pages/student/Apsite.jsx"));
const NotFound = lazyWithRetry(() => import("@/pages/NotFound.jsx"));
const LeaveDetails = lazyWithRetry(() => import("@/pages/student/LeaveDetails.jsx"));
const ExamHall = lazyWithRetry(() => import("@/pages/student/ExamHall.jsx"));
const ExamHallDownload = lazyWithRetry(() => import("@/pages/student/ExamHallDownload.jsx"));
const StudentReportDetails = lazyWithRetry(() => import("@/pages/student/StudentReportDetails.jsx"));
const PSAssessmentHistory = lazyWithRetry(() => import("@/pages/student/PSAssessmentHistory.jsx"));
const PSPointDetails = lazyWithRetry(() => import("@/pages/student/PSPointDetails.jsx"));
const PSBiometricDetails = lazyWithRetry(() => import("@/pages/student/PSBiometricDetails.jsx"));
const SupportDev = lazyWithRetry(() => import("@/pages/student/SupportDev.jsx"));
const PaymentSuccessful = lazyWithRetry(() => import("@/pages/student/PaymentSuccessful.jsx"));
const WifiDetails = lazyWithRetry(() => import("@/pages/student/WifiDetails.jsx"));
const AK22PH202 = lazyWithRetry(() => import("@/pages/answers/AK__22PH202.jsx"));
const AnswerKey22HS006 = lazyWithRetry(() => import("@/pages/answers/AnswerKey22HS006.jsx"));
// const DocsPage = lazyWithRetry(() => import("@/pages/public/AboutDocs.jsx"));
const AuthScope = lazyWithRetry(() => import("../routes/AuthScope.jsx"));
const ProtectedRoute = lazyWithRetry(() => import("../routes/ProtectedRoute.jsx"));
const AdminRoute = lazyWithRetry(() => import("../routes/AdminRoute.jsx"));
const ProtectedLayout = lazyWithRetry(() => import("../routes/ProtectedLayout.jsx"));

const AdminDashboard = lazyWithRetry(() =>
  import("@/pages/admin/AdminDashboard.jsx").then((module) => ({ default: module.default }))
);
const AdminUsersPage = lazyWithRetry(() =>
  import("@/pages/admin/AdminDashboard.jsx").then((module) => ({ default: module.AdminUsersPage }))
);
const AdminUserDirectoryPage = lazyWithRetry(() =>
  import("@/pages/admin/AdminDashboard.jsx").then((module) => ({ default: module.AdminUserDirectoryPage }))
);
const AdminSponsorsPage = lazyWithRetry(() =>
  import("@/pages/admin/AdminDashboard.jsx").then((module) => ({ default: module.AdminSponsorsPage }))
);
const AdminQBPage = lazyWithRetry(() =>
  import("@/pages/admin/AdminDashboard.jsx").then((module) => ({ default: module.AdminQBPage }))
);
const AdminPSRewardsPage = lazyWithRetry(() =>
  import("@/pages/admin/AdminDashboard.jsx").then((module) => ({ default: module.AdminPSRewardsPage }))
);
const AdminCardsPage = lazyWithRetry(() =>
  import("@/pages/admin/AdminDashboard.jsx").then((module) => ({ default: module.AdminCardsPage }))
);
const AdminMessPage = lazyWithRetry(() =>
  import("@/pages/admin/AdminDashboard.jsx").then((module) => ({ default: module.AdminMessPage }))
);
const AdminFeedbackPage = lazyWithRetry(() =>
  import("@/pages/admin/AdminDashboard.jsx").then((module) => ({ default: module.AdminFeedbackPage }))
);

function App() {
  const location = useLocation();

  const currentMeta = ROUTE_SEO[location.pathname] || ROUTE_SEO["*"];

  // useEffect(() => {
  //   const handleKeyDown = (e) => {
  //     const key = (e.key || "").toLowerCase();

  //     // Block F12
  //     if (e.key === "F12") {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       return false;
  //     }

  //     // Block Ctrl/Cmd + Shift + [I/J/C/K]
  //     if ((e.ctrlKey || e.metaKey) && e.shiftKey && (key === "i" || key === "j" || key === "c" || key === "k")) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       return false;
  //     }

  //     // Block Ctrl/Cmd + U (view source) and Ctrl/Cmd + S (save)
  //     if ((e.ctrlKey || e.metaKey) && (key === "u" || key === "s")) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       return false;
  //     }
  //   };

  //   const handleContext = (e) => {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     return false;
  //   };

  //   // Best-effort devtools detection by measuring window sizes
  //   const checkDevTools = () => {
  //     try {
  //       const threshold = 160; // heuristic
  //       const widthDiff = window.outerWidth - window.innerWidth;
  //       const heightDiff = window.outerHeight - window.innerHeight;
  //       if (widthDiff > threshold || heightDiff > threshold) {
  //         // alert("Developer tools detected. Please close it to continue.");
  //       }
  //     } catch (err) {
  //       // ignore
  //     }
  //   };

  //   document.addEventListener("keydown", handleKeyDown, true);
  //   document.addEventListener("contextmenu", handleContext, true);
  //   window.addEventListener("resize", checkDevTools);
  //   const intervalId = setInterval(checkDevTools, 1500);

  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown, true);
  //     document.removeEventListener("contextmenu", handleContext, true);
  //     window.removeEventListener("resize", checkDevTools);
  //     clearInterval(intervalId);
  //   };
  // }, []);

  return (
    <>
      <SEO pathname={location.pathname} meta={currentMeta} />
      <ErrorBoundary>
        <Suspense fallback={<FullScreenLoader />}>
          <Routes>
            {/* Public */}
            <Route
              path="/login"
              element={
                <AuthScope>
                  <Login />
                </AuthScope>
              }
            />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/guides" element={<GuidesIndex />} />
            <Route path="/guides/:slug" element={<GuideDetail />} />
            <Route
              path="/"
              element={
                <AuthScope>
                  <LandingPage />
                </AuthScope>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/developer" element={<Developer />} />
            <Route path="/features" element={<Features />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            {/* <Route path="/docs/about" element={<DocsPage />} /> */}

            {/* Protected Layout */}
            <Route
              element={
                <AuthScope>
                  <ProtectedRoute>
                    <ProtectedLayout />
                  </ProtectedRoute>
                </AuthScope>
              }
            >
              <Route path="/home" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/findmyway" element={<FindMyWay />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsersPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/user-directory"
                element={
                  <AdminRoute>
                    <AdminUserDirectoryPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/sponsors"
                element={
                  <AdminRoute>
                    <AdminSponsorsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/qb"
                element={
                  <AdminRoute>
                    <AdminQBPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/ps-rewards"
                element={
                  <AdminRoute>
                    <AdminPSRewardsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/cards"
                element={
                  <AdminRoute>
                    <AdminCardsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/mess"
                element={
                  <AdminRoute>
                    <AdminMessPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/feedback"
                element={
                  <AdminRoute>
                    <AdminFeedbackPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/super"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route path="/profile" element={<ProfileV2 />} />
              <Route path="/profile/v2" element={<ProfileV2 />} />
              {/* <Route path="/about" element={<About />} /> */}
              <Route path="/rpsite" element={<Rpsite />} />
              <Route path="/wifi-details" element={<WifiDetails />} />
              <Route path="/pcdp" element={<PCDP />} />
              <Route path="/exam-hall" element={<ExamHallDownload />} />
              <Route path="/exam-hall-manual" element={<ExamHall />} />
              <Route path="/apsite" element={<Apsite />} />
              <Route path="/leavedetails" element={<LeaveDetails />} />
              <Route path="/semester" element={<Semester />} />
              <Route path="/mess" element={<MessMenu />} />
              <Route path="/student-report/:id" element={<StudentReportDetails />} />
              <Route path="/student-report" element={<StudentReportDetails />} />
              <Route path="/ps-assessment-history" element={<PSAssessmentHistory />} />
              <Route path="/ps-assessment" element={<PSAssessmentHistory />} />
              <Route path="/ps-points" element={<PSPointDetails />} />
              <Route path="/ps-point-details" element={<PSPointDetails />} />
              <Route path="/ps-biometrics" element={<PSBiometricDetails />} />
              <Route path="/ps-biometric-details" element={<PSBiometricDetails />} />
              <Route path="/support-dev" element={<SupportDev />} />
              <Route path="/payment-successful" element={<PaymentSuccessful />} />
              <Route path="/payment-successful/:id" element={<PaymentSuccessful />} />
              <Route path="/payment-successfull" element={<PaymentSuccessful />} />
              <Route path="/payment-successfull/:id" element={<PaymentSuccessful />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/ak_22ph202" element={<AK22PH202 />} />
              <Route path="/tamil_ak" element={<AnswerKey22HS006 />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Analytics />
      <DailySupportModal />
      <FloatingMenu />
    </>
  );
}

export default App;
