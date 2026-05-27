"use client";

import LiveVisitorsCard from "../LiveVisitorsCard";

export default function DashboardDevLiveTest() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Dev Live Visitors Test</h1>
      <div className="max-w-3xl">
        <LiveVisitorsCard />
      </div>
    </div>
  );
}
