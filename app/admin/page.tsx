import type { Metadata } from "next";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = {
  title: "Admin — Build for Public",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
