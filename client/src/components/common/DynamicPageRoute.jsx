import React from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, LayoutDashboard, Loader2 } from 'lucide-react';

export default function DynamicPageRoute({ pageKey, requiredRole, children }) {
  const { user, loading, permissionsLoading, hasPermission, permissions } = useAuth();
  const navigate = useNavigate();

  if (loading || permissionsLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text-primary)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-[var(--accent)]" />
          <span className="text-xs font-mono text-[var(--text-muted)]">Verifying session permissions...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role override check
  if (requiredRole && user.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    return <AccessRestrictedView onBack={() => navigate('/')} user={user} permissions={permissions} navigate={navigate} />;
  }

  // Dynamic permission check
  const isAllowed = !pageKey || (hasPermission && hasPermission(pageKey));
  if (!isAllowed) {
    return <AccessRestrictedView onBack={() => navigate(-1)} user={user} permissions={permissions} navigate={navigate} />;
  }

  return children ? children : <Outlet />;
}

function AccessRestrictedView({ onBack, user, permissions, navigate }) {
  return (
    <div className="flex-1 min-h-[70vh] flex items-center justify-center p-6 animate-fadeIn">
      <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-[var(--radius-lg)] p-8 text-center shadow-[var(--shadow-lg)] space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Access Restricted</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
            Your role (<span className="font-mono text-[var(--accent)] uppercase font-semibold">{user?.role || 'user'}</span>) does not currently have permission to access this view.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button onClick={onBack} className="btn btn-secondary text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
          <button
            onClick={() => {
              const firstPermitted = permissions?.pages?.[0]?.path;
              navigate(firstPermitted || '/');
            }}
            className="btn btn-primary text-xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>My Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
}
