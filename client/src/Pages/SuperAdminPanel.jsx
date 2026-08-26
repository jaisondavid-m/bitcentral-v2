import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { checkSuperAdmin, listAdmins, addAdmin, removeAdmin, listAllowed, addAllowed, removeAllowed } from "../api/admin";
import { Loader } from "lucide-react";

export default function SuperAdminPanel() {
  const [isSuper, setIsSuper] = useState(false);
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [allowed, setAllowed] = useState([]);
  const [newAdminUid, setNewAdminUid] = useState("");
  const [newAllowedValue, setNewAllowedValue] = useState("");
  const [newAllowedType, setNewAllowedType] = useState("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await checkSuperAdmin();
        if (!mounted) return;
        setIsSuper(Boolean(res?.is_super));
      } catch (err) {
        setIsSuper(false);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, []);

  async function loadAll() {
    setBusy(true);
    setError("");
    try {
      const a = await listAdmins();
      setAdmins(a.admins || []);
      const b = await listAllowed();
      setAllowed(b.allowed || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load data. Check console for details.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (isSuper) loadAll();
  }, [isSuper]);

  async function handleAddAdmin() {
    if (!newAdminUid.trim()) return;
    setBusy(true);
    setError("");
    try {
      await addAdmin(newAdminUid.trim());
      setNewAdminUid("");
      await loadAll();
    } catch (err) {
      console.error(err);
      setError("Failed to add admin");
    } finally { setBusy(false); }
  }

  async function handleRemoveAdmin(uid) {
    if (!confirm(`Remove admin ${uid}?`)) return;
    setBusy(true); setError("");
    try { await removeAdmin(uid); await loadAll(); } catch (err) { setError("Failed to remove"); } finally { setBusy(false); }
  }

  async function handleAddAllowed() {
    if (!newAllowedValue.trim()) return;
    setBusy(true); setError("");
    try { await addAllowed(newAllowedValue.trim(), newAllowedType); setNewAllowedValue(""); await loadAll(); } catch (err) { setError("Failed to add allowed entry"); } finally { setBusy(false); }
  }

  async function handleRemoveAllowed(id) {
    if (!confirm(`Remove allowed entry ${id}?`)) return;
    setBusy(true); setError("");
    try { await removeAllowed(id); await loadAll(); } catch (err) { setError("Failed to remove allowed entry"); } finally { setBusy(false); }
  }

  if (loading) return (<div className="flex items-center justify-center p-8"><Loader className="h-6 w-6 animate-spin" /></div>);

  if (!isSuper) return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-blue-900 dark:bg-slate-950">
      <h2 className="text-lg font-bold">Super Admin</h2>
      <p className="mt-2 text-sm text-gray-500">You are not a super admin. This panel is only accessible to the configured super admin account.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-blue-900 dark:bg-slate-950">
        <h3 className="text-base font-semibold">Admins</h3>
        <p className="mt-1 text-sm text-gray-500">Manage admin users who can access the admin console.</p>

        <div className="mt-4 flex gap-2">
          <input value={newAdminUid} onChange={(e)=>setNewAdminUid(e.target.value)} placeholder="Firebase UID of new admin" className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <button onClick={handleAddAdmin} disabled={busy} className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white">{busy? 'Working...' : 'Add'}</button>
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-4">
          {admins.length === 0 ? <p className="text-sm text-gray-500">No admins found.</p> : (
            <ul className="space-y-2">
              {admins.map((a)=> (
                <li key={a.uid} className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2">
                  <div>
                    <div className="font-mono text-sm text-slate-700">{a.uid}</div>
                    <div className="text-xs text-gray-500">Added by: {a.created_by_name || a.created_by || '-'}</div>
                  </div>
                  <div>
                    <button onClick={()=>handleRemoveAdmin(a.uid)} disabled={busy} className="rounded-md bg-red-600 px-2 py-1 text-xs text-white">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-blue-900 dark:bg-slate-950">
        <h3 className="text-base font-semibold">Allowed emails </h3>
        <p className="mt-1 text-sm text-gray-500">Add exceptions for external emails when email enforcement is enabled.</p>

        <div className="mt-4 flex gap-2">
          <input value={newAllowedValue} onChange={(e)=>setNewAllowedValue(e.target.value)} placeholder="example@domain.com" className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <select value={newAllowedType} onChange={(e)=>setNewAllowedType(e.target.value)} className="rounded-lg border border-slate-300 px-2 py-2 text-sm">
            <option value="email">Email</option>
            <option value="domain">Domain</option>
          </select>
          <button onClick={handleAddAllowed} disabled={busy} className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white">{busy? 'Working...' : 'Add'}</button>
        </div>

        <div className="mt-4">
          {allowed.length === 0 ? <p className="text-sm text-gray-500">No allowed entries.</p> : (
            <ul className="space-y-2">
              {allowed.map((it)=> (
                <li key={it.id} className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2">
                  <div>
                    <div className="text-sm font-medium">{it.value}</div>
                    <div className="text-xs text-gray-500">{it.type} — added by {it.created_by_name || it.created_by || '-'}</div>
                  </div>
                  <div>
                    <button onClick={()=>handleRemoveAllowed(it.id)} disabled={busy} className="rounded-md bg-red-600 px-2 py-1 text-xs text-white">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
