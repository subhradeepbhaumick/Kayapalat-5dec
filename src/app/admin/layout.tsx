// app/admin/layout.tsx
'use client';

import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/Topbar";
import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </>
  );
}