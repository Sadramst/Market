"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const USER_KEY = "services_user";
const TOKEN_KEY = "services_access_token";

interface ServiceUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  providerId?: string;
}

export default function ServicesDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<ServiceUser | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const userStr = localStorage.getItem(USER_KEY);
      if (!token || !userStr) {
        router.replace("/login");
        return;
      }
      setUser(JSON.parse(userStr) as ServiceUser);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("services_refresh_token");
    localStorage.removeItem(USER_KEY);
    router.push("/");
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome banner */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName}
          </h1>
          <p className="text-gray-500 mt-1 text-[15px]">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-[13px] text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Profile Views", value: "—", icon: "👁" },
          { label: "Enquiries", value: "—", icon: "📩" },
          { label: "Favourites", value: "—", icon: "⭐" },
          { label: "Plan", value: "Free", icon: "🚀" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-[12px] text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Provider profile card */}
      {user.providerId ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Your provider profile</h2>
          <div className="flex items-center justify-between">
            <p className="text-[14px] text-gray-500">Manage your IT service listing, update services, and respond to enquiries.</p>
            <Link href={`/provider/${user.providerId}`} className="px-5 py-2.5 bg-blue-600 text-white text-[13px] font-medium rounded-xl hover:bg-blue-700 transition-colors">
              View profile →
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-2">List your IT service</h2>
          <p className="text-[14px] text-gray-600 mb-4">Get discovered by Perth businesses looking for tech professionals.</p>
          <Link href="/join" className="inline-flex px-5 py-2.5 bg-blue-600 text-white text-[13px] font-medium rounded-xl hover:bg-blue-700 transition-colors">
            Create provider profile →
          </Link>
        </div>
      )}

      {/* Browse link */}
      <div className="text-center py-8">
        <Link href="/search" className="text-[14px] text-blue-600 hover:text-blue-700 font-medium">
          Browse IT service providers →
        </Link>
      </div>
    </div>
  );
}
