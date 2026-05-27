import { NextResponse } from 'next/server';

export async function GET() {
  // Mock analytics data for local testing
  const activeUsers = Math.floor(Math.random() * 20) + 1;
  const todayVisits = Math.floor(Math.random() * 2000) + 50;
  const topPages = [
    { path: '/search', views: Math.floor(Math.random() * 300) + 50 },
    { path: '/category/nails', views: Math.floor(Math.random() * 200) + 20 },
    { path: '/subiaco', views: Math.floor(Math.random() * 150) + 10 },
  ];

  const payload = {
    activeUsers,
    todayVisits,
    topPages,
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(payload, { status: 200 });
}
