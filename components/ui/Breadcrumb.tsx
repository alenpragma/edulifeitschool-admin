"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";

export default function Breadcrumb() {
  const pathname = usePathname();

  const rawSegments = pathname.split("/").filter(Boolean);

  const segments = rawSegments.filter((s) => {
    const lower = s.toLowerCase();

    // 1) Remove Next.js dynamic route placeholders like [id]
    if (lower.startsWith("[") && lower.endsWith("]")) return false;

    // 2) Remove hex/UUID-like dynamic variables
    if (/^[0-9a-f-]+$/i.test(s) && s.length > 6) return false;

    return true;
  });

  const buildPath = (index: number) =>
    "/" + segments.slice(0, index + 1).join("/");

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
        <Home size={16} />
      </Link>

      {segments.map((seg, idx) => {
        const href = buildPath(idx);
        const isLast = idx === segments.length - 1;

        const title = seg
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return (
          <div key={idx} className="flex items-center space-x-2">
            <span>/</span>
            {isLast ? (
              <span className="text-gray-900 font-medium">{title}</span>
            ) : (
              <Link href={href} className="hover:text-blue-600 capitalize">
                {title}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
