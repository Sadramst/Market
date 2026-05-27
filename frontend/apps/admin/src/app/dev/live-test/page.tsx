"use client";

import LiveVisitorsCard from "../../dashboard/LiveVisitorsCard";

export default function DevLiveTest() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Dev Live Visitors Test</h1>
      <div className="max-w-3xl">
        <LiveVisitorsCard />
      </div>
    </div>
  );
}
