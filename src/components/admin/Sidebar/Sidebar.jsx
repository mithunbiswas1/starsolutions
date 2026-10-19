// src/components/common/Sidebar/Sidebar.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  FaTachometerAlt,
  FaServicestack,
  FaProjectDiagram,
  FaCog,
  FaHome,
  FaChevronDown,
  FaChevronRight,
  FaSignOutAlt,
  FaBlog,
  FaStar,
  FaTextHeight,
} from "react-icons/fa";
import { FaBoxesPacking, FaHandsBound } from "react-icons/fa6";
import { useLogoutMutation } from "@/redux/features/authApi";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: FaTachometerAlt,
  },
  {
    title: "Homepage",
    icon: FaHome,
    children: [
      {
        title: "Banner",
        href: "/admin/homepage/banner",
      },
      {
        title: "Companies",
        href: "/admin/homepage/company",
      },
      {
        title: "Industries",
        href: "/admin/homepage/industry",
      },
      {
        title: "Alliance",
        href: "/admin/homepage/alliance",
      },
    ],
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: FaProjectDiagram,
  },
  {
    title: "Blogs",
    href: "/admin/blogs",
    icon: FaBlog,
  },
  {
    title: "About",
    href: "/admin/about",
    icon: FaHandsBound,
  },
  {
    title: "Testimonials",
    href: "/admin/testimonials",
    icon: FaStar,
  },
  {
    title: "Packages",
    href: "/admin/packages",
    icon: FaBoxesPacking,
  },
  {
    title: "Client Messages",
    href: "/admin/messages",
    icon: FaTextHeight,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: FaCog,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout: authLogout } = useAuth();
  const [logout, { isLoading }] = useLogoutMutation();
  const [openMenu, setOpenMenu] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      // Call the logout API
      await logout().unwrap();

      // Clear local storage and auth context
      authLogout();

      toast.success("Logged out successfully!");
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);

      // Even if API fails, clear local storage and redirect
      authLogout();
      toast.warning("Logged out locally. Please login again.");
      router.push("/admin/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="flex h-screen w-full flex-col bg-white border-r border-gray-200">
      {/* Logo - Fixed */}
      <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-6">
        <Link href="/admin/dashboard">
          <Image
            src="/logo_black.png"
            alt="Logo"
            width={170}
            height={40}
            className="h-9 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Menu - Scrollable */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          // Parent with children
          if (item.children) {
            const isOpen = openMenu === item.title;
            const hasActiveChild = item.children.some(
              (child) => child.href === pathname,
            );

            return (
              <div key={item.title}>
                <button
                  onClick={() => setOpenMenu(isOpen ? null : item.title)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                    hasActiveChild
                      ? "bg-green-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="text-lg" />
                    <span>{item.title}</span>
                  </div>

                  {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                </button>

                {isOpen && (
                  <div className="mt-2 ml-6 space-y-1 border-l border-gray-200 pl-4">
                    {item.children.map((child) => {
                      const active = pathname === child.href;

                      return (
                        <Link
                          key={child.title}
                          href={child.href}
                          className={`block rounded-lg px-3 py-2 text-sm transition ${
                            active
                              ? "bg-green-50 text-green-600 font-semibold"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {child.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Normal menu
          const active = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              }`}
            >
              <Icon className="text-lg" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout - Fixed at bottom */}
      <div className="shrink-0 border-t border-gray-200 py-1.5 px-4">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut || isLoading}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
            isLoggingOut || isLoading
              ? "text-gray-400 cursor-not-allowed"
              : "text-red-600 hover:bg-red-50"
          }`}
        >
          {isLoggingOut || isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <FaSignOutAlt className="text-lg" />
              <span>Logout</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
