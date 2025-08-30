// app/admin/layout.tsx
'use client';

import React from "react";
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