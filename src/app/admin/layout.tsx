// app/admin/layout.tsx
'use client';

import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/Topbar";
import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}