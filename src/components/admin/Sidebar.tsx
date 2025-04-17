// components/AdminSidebar.tsx
"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Brush,
  GalleryHorizontal,
  Users,
  Menu,
  Briefcase,
  PhoneIncoming,
  Calculator,
  Newspaper,
  ClipboardList,
  BarChart3,
  Settings2,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      { label: "Blogs", icon: Newspaper, href: "/admin/blogs" },
      { label: "SEO", icon: Globe, href: "/admin/seo" },
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      {/* Hamburger menu for small screens */}
      <div className="md:hidden p-4">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Sidebar for medium and up */}
      <div className="hidden md:flex flex-col w-64 h-screen bg-white border-r p-4 shadow-md fixed overflow-y-auto">
        <h1 className="text-xl font-bold mb-6">Kayapalat Admin</h1>
        {navGroups.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              {group.title}
            </p>
            {group.links.map(({ label, icon: Icon, href }) => (
              <Link
                href={href}
                key={label}
                className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100"
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Mobile sidebar with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg p-4 flex flex-col md:hidden overflow-y-auto"
          >
            <h1 className="text-xl font-bold mb-6">Kayapalat Admin</h1>
            {navGroups.map((group) => (
              <div key={group.title} className="mb-6">
                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  {group.title}
                </p>
                {group.links.map(({ label, icon: Icon, href }) => (
                  <Link
                    href={href}
                    key={label}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
