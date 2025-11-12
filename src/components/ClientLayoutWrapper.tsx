"use client";

import { useEffect, useState } from 'react';
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/sales-admin") || pathname.startsWith("/superadmin");
  const isReferUserRoute = pathname.startsWith("/referuser");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {!isAdminRoute && !isReferUserRoute && <Navbar />}
      <main className="flex flex-col min-h-screen">{children}</main>
      {!isAdminRoute && !isReferUserRoute && <Footer />}
    </>
  );
}
