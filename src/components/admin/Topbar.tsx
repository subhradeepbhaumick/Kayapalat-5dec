"use client";

import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="w-full h-16 flex items-center justify-between px-4 md:px-8 border-b shadow-sm bg-white sticky top-0 z-40">
      {/* Left: Title */}
      <div className="hidden md:block">
        {title && (
          <h1 className="text-xl md:text-2xl text-gray-700" style={{ fontFamily: "'Abril Fatface', cursive" }}>
            {title}
          </h1>
        )}
      </div>

      {/* Right: Admin info */}
      <div className="flex items-center gap-2 md:gap-4 ml-auto">
        <User className="w-6 h-6 md:w-7 md:h-7 text-gray-600 border-2 rounded-full p-1" />
        <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-3 md:px-4 py-1.5 text-xs md:text-sm border-2 border-teal-700">
          Kayapalat Admin
        </Button>
      </div>
    </div>
  );
}