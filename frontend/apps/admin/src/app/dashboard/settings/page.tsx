"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";

interface Setting {
  id: string;
  key: string;
  value: string;
  group: string;
  description?: string;
}

export default function SettingsPage() {
  const { token, user } = useAuth();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canEdit = user?.roles.includes("SuperAdmin") ?? false;

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi<Setting[]>(token, "/settings");
      setSettings(data);
      setDrafts(Object.fromEntries(data.map((setting) => [setting.key, setting.value])));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load settings");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const groupedSettings = useMemo(() => {
    return settings.reduce<Record<string, Setting[]>>((groups, setting) => {
      const group = setting.group || "General";
      groups[group] = groups[group] ?? [];
      groups[group].push(setting);
      return groups;
    }, {});
  }, [settings]);

  async function saveSetting(key: string) {
    if (!token || !canEdit) return;
    setSaving(key);
    setError(null);
    setMessage(null);
    try {
      const updated = await adminApi<Setting>(token, `/settings/${encodeURIComponent(key)}`, {
        method: "PUT",
        body: JSON.stringify({ value: drafts[key] ?? "" }),
      });
      setSettings((current) => current.map((setting) => setting.key === key ? updated : setting));
      setMessage(`${key} updated`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update setting");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Platform Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Operational switches for moderation, providers, SEO, and notifications.</p>
        </div>
        {!canEdit && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">Read-only for moderators</span>}
      </div>

      {message && <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
      {error && <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white py-12 text-center text-sm text-gray-400">Loading settings...</div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSettings).map(([group, items]) => (
            <div key={group} className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">{group}</h2>
              <div className="space-y-4">
                {items.map((item) => {
                  const dirty = drafts[item.key] !== item.value;
                  return (
                    <div key={item.key} className="flex flex-col gap-3 border-b border-gray-50 py-3 last:border-0 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.description || item.key}</p>
                        <p className="text-xs text-gray-400 font-mono">{item.key}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={drafts[item.key] ?? ""}
                          onChange={(event) => setDrafts((current) => ({ ...current, [item.key]: event.target.value }))}
                          readOnly={!canEdit}
                          className="w-64 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 disabled:bg-gray-50"
                        />
                        <button
                          onClick={() => saveSetting(item.key)}
                          disabled={!canEdit || !dirty || saving === item.key}
                          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                        >
                          {saving === item.key ? "Saving" : "Save"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}