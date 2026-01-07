"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

type Meta = {
  page: string | number;
  limit: string | number;
  total: number;
  totalPages: number;
};

type PaginationProps = {
  meta: Meta;
};

export default function Pagination({ meta }: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const LIMITS = [5, 10, 20, 30, 50];

  // Use searchParams first, fallback to meta
  const page = Number(searchParams.get("page") || meta.page || 1);
  const limit = Number(searchParams.get("limit") || meta.limit || 10);
  const total = meta.total;
  const totalPages = meta.totalPages;

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const updateQuery = (newParams: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) =>
      params.set(key, value.toString())
    );
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-2 md:p-4">
      {/* Desktop: Rows info + Limit */}
      <div className="hidden md:flex items-center gap-3 text-gray-700 text-sm">
        <span>
          {startItem}-{endItem} of {total} items
        </span>

        <select
          className="border border-gray-300 rounded p-1 text-sm"
          value={limit}
          onChange={(e) =>
            updateQuery({ limit: Number(e.target.value), page: 1 })
          }
        >
          {LIMITS.map((l) => (
            <option key={l} value={l}>
              {l} per page
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 justify-center md:justify-start">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateQuery({ page: page - 1 })}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateQuery({ page: page + 1 })}
          disabled={page >= totalPages || total === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
