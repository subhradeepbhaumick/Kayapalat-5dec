'use client';

import React from 'react';
import { SidebarProvider } from "@/contexts/SidebarContext";
import AdminSidebar from "./AdminSidebar";
import Topbar from "./Topbar";
import { useSidebar } from "@/contexts/SidebarContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();
  
  return (
    <div className="flex min-h-screen ">
      <AdminSidebar />
      <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'}`}>
        <Topbar />
        <main className=" overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
} 