"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  X,
  LayoutDashboard,
  Settings,
  Image as IconImage,
  Users,
  CirclePlay,
} from "lucide-react";
import Image from "next/image";

type Props = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  children?: { name: string; href: string }[];
};

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/", icon: <LayoutDashboard size={20} /> },
  { name: "Events", href: "/events", icon: <CirclePlay size={20} /> },
  { name: "Teachers", href: "/teachers", icon: <Users size={20} /> },
  { name: "Photo Gallery", href: "/gallery", icon: <IconImage size={20} /> },
  {
    name: "Site Settings",
    href: "/site-settings",
    icon: <Settings size={20} />,
  },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: Props) {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  // Open submenu if a child is active
  useEffect(() => {
    navigation.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => child.href === pathname
        );
        if (hasActiveChild) {
          setOpenSubmenus((prev) => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [pathname]);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1c2333] font-medium text-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex bg-white items-center justify-between px-6 h-18 text-white font-bold text-xl flex-shrink-0">
        <Image src="/logo.svg" alt="Logo" width={180} height={120} />

        {/* Mobile close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-gray-200 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.children && item.children.some((c) => c.href === pathname));

          if (item.children) {
            const isOpen = openSubmenus[item.name];

            return (
              <div key={item.name} className="space-y-1">
                {/* Parent item */}
                <button
                  onClick={() => toggleSubmenu(item.name)}
                  className={`flex items-center justify-between w-full p-2.5 rounded transition-all duration-200 ${
                    isActive
                      ? "bg-[#333a47] text-white font-medium"
                      : "hover:bg-[#333a47] hover:text-white text-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`transform transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Children */}
                <div
                  className={`ml-6 overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-40" : "max-h-0"
                  }`}
                >
                  {item.children.map((child) => {
                    const isChildActive = child.href === pathname; // check if child is active
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`block px-3 py-2 rounded transition-colors duration-200 ${
                          isChildActive
                            ? "text-white font-medium"
                            : "text-gray-400 hover:text-white font-medium"
                        }`}
                      >
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 p-2.5 rounded transition-all duration-200 ${
                isActive
                  ? "bg-[#333a47] text-white font-medium"
                  : "hover:bg-[#333a47] hover:text-white text-gray-300"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
