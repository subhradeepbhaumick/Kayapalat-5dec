// app/admin/layout.tsx
import React from "react";
import type { Metadata } from "next";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { SidebarProvider } from "@/components/SidebarProvider";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Kayapalat Admin Panel",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="p-4 overflow-y-auto flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}