"use client";

import { useState, useEffect, ReactNode } from "react";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen flex bg-[#F3F6FA]">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area */}
      <main className="flex-1 bg-[#F3F6FA] lg:pl-72 mt-20 overflow-x-auto">
        {/* Fixed header */}
        <Header setSidebarOpen={setSidebarOpen} />
        <div className="p-4 lg:p-10 mb-8">{children}</div>
      </main>
    </div>
  );
}
