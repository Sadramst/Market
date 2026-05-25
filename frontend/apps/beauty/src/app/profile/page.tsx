import type { Metadata } from "next";
import { ProfileClient } from "./ProfileClient";

export const metadata: Metadata = {
  title: "My Profile | Appilico Beauty",
  description: "Manage your Appilico Beauty account, address, and preferences.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
