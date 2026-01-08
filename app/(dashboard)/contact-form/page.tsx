"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Table from "./_components/Table";
import Pagination from "@/components/ui/Pagination";
import { Contact } from "@/types/contact";

export type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ContactApiResponse = {
  success: boolean;
  message: string;
  data: Contact[];
  meta: Meta;
};

export default function Contacts() {
  const { isFetching, isError, data } = useQuery<ContactApiResponse>({
    queryKey: ["contact-forms"],
    queryFn: () => api.get("/admin/contact-forms").then((res) => res.data),
  });

  const contacts = data?.data;
  const meta = data?.meta;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Title */}
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-5">
        Contact List
      </h1>

      {/* Table */}
      <div className="border border-[#E2E8F0] shadow-[0px_8px_13px_-3px_rgba(0,0,0,0.08)] bg-white">
        <Table
          isFetching={isFetching}
          isError={isError}
          contacts={contacts || []}
        />
      </div>

      {/* Pagination */}
      {meta && contacts?.length ? <Pagination meta={meta} /> : null}
    </div>
  );
}
