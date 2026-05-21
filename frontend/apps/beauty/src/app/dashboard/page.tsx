import type { Metadata } from "next";
import { ProviderDashboard } from "./ProviderDashboard";

export const metadata: Metadata = {
  title: "Provider Dashboard | Appilico Beauty",
  description: "Manage your Appilico Beauty provider account.",
};

export default function DashboardPage() {
  return <ProviderDashboard />;
}
