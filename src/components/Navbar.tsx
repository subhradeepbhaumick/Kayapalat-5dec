"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure this runs only on client side
  useEffect(() => {
    setIsClient(true);
    const cookies = document.cookie.split("; ");
    console.log("Cookies:", cookies); // Debugging line to check cookies
    const loggedInCookie = cookies.find((cookie) => cookie.startsWith("loggedIn="));
    const loggedIn = loggedInCookie?.split("=")[1] === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      document.cookie = "loggedIn=false; path=/"; // Update cookie state
      setIsLoggedIn(false);
      router.push("/login");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Prevent SSR mismatch by ensuring rendering happens only on client
  if (!isClient) {
    return null;
  }

  return (
    <nav className="fixed top-0 w-full bg-[#D7E7D0] shadow-md px-4 py-2 flex items-center justify-between z-50 h-14">
      {/* Left Section - Logo & Sidebar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-[#295A47]"
        >
          <Menu size={24} />
        </button>
        <Link href="/">
          <Image
            src="/kayapalat-logo.png"
            alt="Kayapalat Logo"
            width={120}
            height={30}
            className="inline cursor-pointer md:ml-6"
          />
        </Link>
      </div>

      {/* Center Navigation - Desktop Only */}
      <ul className="hidden lg:flex gap-5 text-gray-700 font-medium text-sm">
        {["Home", "Dashboard", "Gallery", "How it Works", "Our Designers", "Branding Partners", "Contact Us"].map(
          (name, index) => {
            const linkPath =
              name === "Home" ? "/" : `/${name.toLowerCase().replace(/ /g, "-")}`;
            const isActive = pathname.replace(/\/$/, "") === linkPath.replace(/\/$/, "");
            return (
              <li key={index} className="relative group">
                <Link
                  href={linkPath}
                  className={`transition ${isActive ? "text-[#295A47]" : "hover:text-[#295A47]"}`}
                >
                  {name}
                  <span
                    className={`absolute left-0 bottom-0 h-[1px] bg-[#295A47]/80 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              </li>
            );
          }
        )}
      </ul>

      {/* Right Section - Auth Buttons / Profile */}
      <div className="flex gap-2 relative">
        {isLoggedIn ? (
          <div className="relative">
            <button
              className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <User size={20} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md text-sm py-1">
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              href="/signup"
              className="border border-[#295A47] text-[#295A47] px-3 py-1 rounded-md hover:bg-[#295A47] hover:text-white transition cursor-pointer text-sm md:text-base"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="bg-[#295A47] text-white px-3 py-1 rounded-md transition cursor-pointer text-sm md:text-base"
            >
              Login
            </Link>
          </>
        )}
      </div>

      {/* Sidebar for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 h-screen overflow-hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="fixed left-0 top-0 w-56 bg-white/20 backdrop-blur-lg shadow-lg p-4 rounded-r-2xl flex flex-col gap-3 text-white h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-3 right-4 text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-lg font-semibold text-[#D7E7D0] mb-3 border-b border-white/50 pb-2">
              MENU
            </h2>
            <ul className="flex flex-col gap-2">
              {["Home", "Dashboard", "Gallery", "How it Works", "Our Designers", "Branding Partners", "Contact Us"].map(
                (name, index) => {
                  const linkPath =
                    name === "Home" ? "/" : `/${name.toLowerCase().replace(/ /g, "-")}`;
                  const isActive = pathname.replace(/\/$/, "") === linkPath.replace(/\/$/, "");
                  return (
                    <li
                      key={index}
                      className={`border-b border-white/50 pb-1 ${isActive ? "text-[#D7E7D0]" : ""}`}
                    >
                      <Link
                        href={linkPath}
                        className="block px-3 py-2 hover:scale-105 transition-transform"
                      >
                        {name}
                      </Link>
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}
