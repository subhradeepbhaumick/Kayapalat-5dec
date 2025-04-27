"use client";

import { usePathname } from "next/navigation";
import { User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/SidebarProvider";

function formatTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1 && segments[segments.length - 1] === "admin") return "Welcome to Admin Panel";
  if (segments.length === 0) return "Welcome to Admin Panel";
  const page = segments[segments.length - 1];
  if (page === "callback-request") return "Callback Requests";
  if (page === "faqs") return "FAQs";
  if (page === "seo") return "Search Engine Optimisation (SEO)";
  return `${page.charAt(0).toUpperCase() + page.slice(1)}`;
}

export default function AdminTopbar() {
  const pathname = usePathname();
  const title = formatTitle(pathname);
  const { open } = useSidebar();

  return (
    <div className="w-full h-16 flex items-center justify-between px-4 md:px-6 border-b shadow-sm bg-white sticky top-0 z-40">
      {/* Left: Hamburger on mobile */}
      <div className="flex items-center md:hidden">
        <Button variant="outline" size="icon" onClick={() => open()}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Center: Title (centered in mobile, aligned left in desktop) */}
      <div className="pl-65 hidden md:flex">
        {title && (
          <h1 className="text-2xl text-gray-700" style={{ fontFamily: "'Abril Fatface', cursive" }}>{title}</h1>
        )}
      </div>

      {/* Right: Admin info (visible on all screens) */}
      <div className="flex items-center gap-3">
        <User className="w-8 h-8 text-gray-600 border-2 rounded-full" />
        <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-5 py-2 text-sm">
          Kayapalat Admin
        </Button>
      </div>
    </div>
  );
}
