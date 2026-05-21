"use client";

import { useEffect, useState } from "react";
import { adminApi } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";

interface Category {
  id: string;
  name: string;
  slug: string;
  subCategories?: Category[];
}

export default function CategoriesPage() {
  const { token } = useAuth();
  const [beautyCategories, setBeautyCategories] = useState<Category[]>([]);
  const [itCategories, setItCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const authToken = token;
    async function load() {
      setError(null);
      try {
        const [beauty, it] = await Promise.all([
          adminApi<Category[]>(authToken, "/categories/beauty"),
          adminApi<Category[]>(authToken, "/categories/it"),
        ]);
        setBeautyCategories(beauty ?? []);
        setItCategories(it ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load categories");
      }
      setLoading(false);
    }
    load();
  }, [token]);

  if (loading) return <div className="text-gray-400 py-12 text-center">Loading categories...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>
      {error && <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Beauty Categories ({beautyCategories.length})</h2>
          <div className="space-y-2">
            {beautyCategories.map((cat) => (
              <div key={cat.id}>
                <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                  <span className="text-xs text-gray-400">{cat.subCategories?.length ?? 0} sub</span>
                </div>
                {cat.subCategories && cat.subCategories.length > 0 && (
                  <div className="ml-6 mt-1 space-y-1">
                    {cat.subCategories.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between p-2 bg-rose-50/50 rounded-lg text-xs text-gray-500">
                        <span>{sub.name}</span>
                        <span className="text-gray-300">{sub.slug}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">IT Categories ({itCategories.length})</h2>
          <div className="space-y-2">
            {itCategories.map((cat) => (
              <div key={cat.id}>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                  <span className="text-xs text-gray-400">{cat.subCategories?.length ?? 0} sub</span>
                </div>
                {cat.subCategories && cat.subCategories.length > 0 && (
                  <div className="ml-6 mt-1 space-y-1">
                    {cat.subCategories.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between p-2 bg-blue-50/50 rounded-lg text-xs text-gray-500">
                        <span>{sub.name}</span>
                        <span className="text-gray-300">{sub.slug}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
