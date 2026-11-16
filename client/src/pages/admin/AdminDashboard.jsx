import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkAdmin } from "@/api/admin.js";
import { getAdminTabFromPath } from "@/components/admin/adminConstants.js";
import AdminLayout from "@/components/admin/AdminLayout.jsx";
import AdminOverviewGrid from "@/components/admin/AdminOverviewGrid.jsx";

// Modular Admin Section Components from @/components/admin/sections/
import AdminUsersSection from "@/components/admin/sections/AdminUsersSection.jsx";
import AdminUserDirectorySection from "@/components/admin/sections/AdminUserDirectorySection.jsx";
import AdminCardsSection from "@/components/admin/sections/AdminCardsSection.jsx";
import AdminMessSection from "@/components/admin/sections/AdminMessSection.jsx";
import AdminSponsorsSection from "@/components/admin/sections/AdminSponsorsSection.jsx";
import AdminLeavesSection from "@/components/admin/sections/AdminLeavesSection.jsx";
import AdminNotificationsSection from "@/components/admin/sections/AdminNotificationsSection.jsx";
import AdminFeedbackSection from "@/components/admin/sections/AdminFeedbackSection.jsx";
import AdminMailSenderSection from "@/components/admin/sections/AdminMailSenderSection.jsx";
import AdminAuditLogsSection from "@/components/admin/sections/AdminAuditLogsSection.jsx";
import AdminAnalyticsSection from "@/components/admin/sections/AdminAnalyticsSection.jsx";

/**
 * AdminDashboard - Central dispatcher for all administrative tools in BitCentral.
 * Provides unified neo-brutalist navigation, strict role checks, and modular sections.
 */
function AdminDashboard({ initialTab } = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = initialTab || getAdminTabFromPath(location.pathname);

  const [isSuper, setIsSuper] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await checkAdmin();
        if (!mounted) return;
        if (res && res.is_admin === false) {
          // Strict server-side validation rejected: not an admin in DB
          navigate("/home", { replace: true });
          return;
        }
        setIsSuper(Boolean(res?.is_super));
      } catch (err) {
        if (mounted) setIsSuper(false);
      } finally {
        if (mounted) setCheckingAuth(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent dark:border-blue-400 dark:border-t-transparent" />
          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
            Verifying Admin Access...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout activeTab={activeTab} isSuper={isSuper}>
      {activeTab === "overview" ? (
        <AdminOverviewGrid isSuper={isSuper} />
      ) : activeTab === "analytics" ? (
        <AdminAnalyticsSection />
      ) : activeTab === "sponsors" ? (
        <AdminSponsorsSection />
      ) : activeTab === "cards" ? (
        <AdminCardsSection />
      ) : activeTab === "mess" ? (
        <AdminMessSection />
      ) : activeTab === "leaves" ? (
        <AdminLeavesSection />
      ) : activeTab === "notifications" ? (
        <AdminNotificationsSection />
      ) : activeTab === "feedback" ? (
        <AdminFeedbackSection />
      ) : activeTab === "mail" || activeTab === "mail-sender" ? (
        <AdminMailSenderSection />
      ) : activeTab === "user-directory" ? (
        <AdminUserDirectorySection />
      ) : activeTab === "audit-logs" ? (
        <AdminAuditLogsSection />
      ) : (
        <AdminUsersSection isSuper={isSuper} />
      )}
    </AdminLayout>
  );
}

/* -- Route Wrapper Exports for Direct Page Mounts --------------------------- */
export function AdminAnalyticsPage() {
  return <AdminDashboard initialTab="analytics" />;
}

export function AdminAuditLogsPage() {
  return <AdminDashboard initialTab="audit-logs" />;
}

export function AdminUsersPage() {
  return <AdminDashboard initialTab="users" />;
}

export function AdminUserDirectoryPage() {
  return <AdminDashboard initialTab="user-directory" />;
}

export function AdminSponsorsPage() {
  return <AdminDashboard initialTab="sponsors" />;
}

export function AdminCardsPage() {
  return <AdminDashboard initialTab="cards" />;
}

export function AdminMessPage() {
  return <AdminDashboard initialTab="mess" />;
}

export function AdminLeavesPage() {
  return <AdminDashboard initialTab="leaves" />;
}

export function AdminNotificationsPage() {
  return <AdminDashboard initialTab="notifications" />;
}

export function AdminFeedbackPage() {
  return <AdminDashboard initialTab="feedback" />;
}

export function AdminMailSenderPage() {
  return <AdminDashboard initialTab="mail" />;
}

export default AdminDashboard;
