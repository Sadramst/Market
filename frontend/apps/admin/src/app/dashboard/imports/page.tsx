"use client";

import { useMemo, useState } from "react";
import { adminApi } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";

interface ImportIssue {
  rowNumber: number;
  field: string;
  message: string;
  severity: "error" | "warning";
}

interface ImportRow {
  rowNumber: number;
  businessName: string;
  slug: string;
  city: string;
  status: string;
  qualityScore: number;
  willUpdate: boolean;
  hasErrors: boolean;
  issues: ImportIssue[];
}

interface ImportResult {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  created: number;
  updated: number;
  skipped: number;
  rows: ImportRow[];
  issues: ImportIssue[];
}

const sampleCsv = [
  "business_name,category_slugs,service_area_slugs,services,source_name,source_url,website,instagram,phone,city,state,post_code,rating,review_count",
  "Subiaco Glow,nails,subiaco,gel manicure;pedicure,Google Business Profile,https://example.com/subiaco-glow,https://subiacoglow.example,@subiacoglow,(08) 9000 1111,Subiaco,WA,6008,4.7,28",
].join("\n");

const statusClasses: Record<string, string> = {
  create: "bg-emerald-50 text-emerald-700",
  update: "bg-blue-50 text-blue-700",
  rejected: "bg-red-50 text-red-700",
  skipped: "bg-gray-100 text-gray-600",
};

export default function ProviderImportsPage() {
  const { token } = useAuth();
  const [csv, setCsv] = useState(sampleCsv);
  const [sourceName, setSourceName] = useState("manual-vetted-csv");
  const [approveImported, setApproveImported] = useState(false);
  const [updateExisting, setUpdateExisting] = useState(true);
  const [replaceServices, setReplaceServices] = useState(true);
  const [replaceServiceAreas, setReplaceServiceAreas] = useState(true);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState<"preview" | "import" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canImport = useMemo(() => Boolean(result && result.validRows > 0 && !loading), [result, loading]);

  async function run(endpoint: "preview" | "run") {
    if (!token) return;
    setLoading(endpoint === "preview" ? "preview" : "import");
    setError(null);
    try {
      const data = await adminApi<ImportResult>(token, `/provider-imports/${endpoint}`, {
        method: "POST",
        body: JSON.stringify({ csv, sourceName, approveImported, updateExisting, replaceServices, replaceServiceAreas }),
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import request failed");
    } finally {
      setLoading(null);
    }
  }

  async function loadFile(file?: File) {
    if (!file) return;
    setCsv(await file.text());
    setResult(null);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Provider Data Imports</h1>
          <p className="text-sm text-gray-400 mt-1">Preview, validate, and import sourced provider records.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => run("preview")} disabled={!!loading || csv.trim().length === 0} className="px-4 py-2 rounded-lg border border-indigo-200 bg-white text-sm font-medium text-indigo-700 hover:bg-indigo-50 disabled:opacity-40">
            {loading === "preview" ? "Previewing..." : "Preview"}
          </button>
          <button onClick={() => run("run")} disabled={!canImport} className="px-4 py-2 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40">
            {loading === "import" ? "Importing..." : "Import Valid Rows"}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">CSV Source</h2>
              <p className="text-xs text-gray-400 mt-1">Required: business_name, category_slugs, source_url, and one contact channel.</p>
            </div>
            <label className="inline-flex cursor-pointer items-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:border-indigo-200 hover:text-indigo-700">
              Upload CSV
              <input type="file" accept=".csv,text/csv" className="sr-only" onChange={(event) => loadFile(event.target.files?.[0])} />
            </label>
          </div>
          <textarea
            value={csv}
            onChange={(event) => { setCsv(event.target.value); setResult(null); }}
            className="min-h-[420px] w-full resize-y border-0 p-5 font-mono text-sm text-gray-700 outline-none focus:ring-0"
            spellCheck={false}
          />
        </section>

        <aside className="space-y-4">
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Import Controls</h2>
            <label className="block text-xs font-medium uppercase tracking-wide text-gray-400">Source name</label>
            <input value={sourceName} onChange={(event) => setSourceName(event.target.value)} className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
            <div className="mt-5 space-y-3 text-sm text-gray-600">
              <label className="flex items-center justify-between gap-3">
                <span>Update matching slugs</span>
                <input type="checkbox" checked={updateExisting} onChange={(event) => setUpdateExisting(event.target.checked)} className="h-4 w-4 accent-indigo-600" />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Approve imported records</span>
                <input type="checkbox" checked={approveImported} onChange={(event) => setApproveImported(event.target.checked)} className="h-4 w-4 accent-indigo-600" />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Replace services</span>
                <input type="checkbox" checked={replaceServices} onChange={(event) => setReplaceServices(event.target.checked)} className="h-4 w-4 accent-indigo-600" />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Replace service areas</span>
                <input type="checkbox" checked={replaceServiceAreas} onChange={(event) => setReplaceServiceAreas(event.target.checked)} className="h-4 w-4 accent-indigo-600" />
              </label>
            </div>
          </section>

          {result && (
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Preview Summary</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Metric label="Rows" value={result.totalRows} />
                <Metric label="Valid" value={result.validRows} />
                <Metric label="Invalid" value={result.invalidRows} tone="red" />
                <Metric label="Skipped" value={result.skipped} />
                <Metric label="Created" value={result.created} tone="green" />
                <Metric label="Updated" value={result.updated} tone="blue" />
              </div>
            </section>
          )}
        </aside>
      </div>

      {result && (
        <section className="mt-6 rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-gray-900">Row Review</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Row</th>
                  <th className="px-5 py-3 font-medium">Business</th>
                  <th className="px-5 py-3 font-medium">Slug</th>
                  <th className="px-5 py-3 font-medium">Quality</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Issues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {result.rows.map((row) => (
                  <tr key={`${row.rowNumber}-${row.slug}`} className="align-top hover:bg-gray-50/50">
                    <td className="px-5 py-4 text-gray-500">{row.rowNumber}</td>
                    <td className="px-5 py-4 font-medium text-gray-900">{row.businessName || "-"}</td>
                    <td className="px-5 py-4 text-gray-500">{row.slug || "-"}</td>
                    <td className="px-5 py-4">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                        <div className={`h-full ${row.qualityScore >= 80 ? "bg-emerald-500" : row.qualityScore >= 55 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${row.qualityScore}%` }} />
                      </div>
                      <span className="mt-1 block text-xs text-gray-400">{row.qualityScore}/100</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[row.status] || "bg-gray-100 text-gray-600"}`}>{row.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      {row.issues.length === 0 ? <span className="text-gray-400">Clear</span> : (
                        <div className="space-y-1">
                          {row.issues.map((issue, index) => (
                            <p key={`${issue.field}-${index}`} className={issue.severity === "error" ? "text-red-600" : "text-amber-600"}>
                              <span className="font-medium">{issue.field}:</span> {issue.message}
                            </p>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function Metric({ label, value, tone = "gray" }: { label: string; value: number; tone?: "gray" | "red" | "green" | "blue" }) {
  const toneClass = tone === "red" ? "text-red-600" : tone === "green" ? "text-emerald-600" : tone === "blue" ? "text-blue-600" : "text-gray-900";
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-lg font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}
