// components/admin/Sidebar.tsx
"use client";

import { useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Brush,
  GalleryHorizontal,
  Users,
  Briefcase,
  PhoneIncoming,
  Calculator,
  Newspaper,
  ClipboardList,
  Globe,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSidebar } from "@/components/SidebarProvider";

const navGroups = [
  {
    title: "Overview",
    links: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    ],
  },
  {
    title: "Content Management",
    links: [
      { label: "Designs", icon: Brush, href: "/admin/designs" },
      { label: "Galleries", icon: GalleryHorizontal, href: "/admin/galleries" },
      { label: "FAQs", icon: HelpCircle, href: "/admin/faqs" } ,
      { label: "Blogs", icon: Newspaper, href: "/admin/blogs" },
      { label: "SEO", icon: Globe, href: "/admin/seo" }
      
    ],
  },
  {
    title: "Operations",
    links: [
      { label: "Careers", icon: Briefcase, href: "/admin/careers" },
      { label: "Callback Requests", icon: PhoneIncoming, href: "/admin/callback-request" },
      { label: "Estimations", icon: Calculator, href: "/admin/estimations" },
      { label: "Tasks", icon: ClipboardList, href: "/admin/tasks" },
    ],
  },
  {
    title: "User Management",
    links: [
      { label: "Users", icon: Users, href: "/admin/users" },
    ],
  },
];

export default function AdminSidebar() {
  const { isOpen, close } = useSidebar();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !(sidebarRef.current as any).contains(e.target)) {
        close();
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  return (
    <div className="relative z-50">
      {/* Desktop */}
      <div className="hidden md:flex flex-col w-64 h-screen bg-white border-r p-4 shadow-md fixed overflow-y-auto">
        <Link href="/admin" className="mb-10 pt-3 justify-center flex items-center">
          <Image src="/kayapalat-logo.png" alt="Kayapalat Logo" width={150} height={50} />
        </Link>
        {navGroups.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              {group.title}
            </p>
            {group.links.map(({ label, icon: Icon, href }) => (
              <Link
                href={href}
                key={label}
                className="flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-[#D7E7D0] hover:text-[#295A47] active:bg-[#D7E7D0]"
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        ))}
        <div className="mt-auto">
          <Button variant="outline" className="flex items-center cursor-pointer gap-3 py-2 px-3 rounded-lg w-full transition-all duration-300 transform hover:bg-red-500 hover:text-white active:bg-red-600">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              ref={sidebarRef}
              className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg p-4 flex flex-col md:hidden overflow-y-auto"
            >
              <Link href="/admin" className="mb-10 pt-3 justify-center flex items-center">
                <Image src="/kayapalat-logo.png" alt="Kayapalat Logo" width={150} height={50} />
              </Link>
              {navGroups.map((group) => (
                <div key={group.title} className="mb-6">
                  <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                    {group.title}
                  </p>
                  {group.links.map(({ label, icon: Icon, href }) => (
                    <Link
                      href={href}
                      key={label}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-[#D7E7D0] hover:text-[#295A47] active:bg-[#D7E7D0]"
                      onClick={close}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>
              ))}
              <div className="mt-auto">
                <Button variant="outline" className="flex items-center cursor-pointer gap-3 py-2 px-3 rounded-lg w-full transition-all duration-300 transform active:text-white active:bg-red-500">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </Button>
              </div>

            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-30 md:hidden"
              onClick={close}
            />
          </>
        )}
      </AnimatePresence>
    </div >
  );
}