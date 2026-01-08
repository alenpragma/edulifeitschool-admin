"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import AddTeacherModal from "./_components/AddModal";
import { Teacher } from "@/types/teacher";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Table from "./_components/Table";

export default function Contacts() {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const { isFetching, isError, data } = useQuery<{ data: Teacher[] }>({
    queryKey: ["teachers"],
    queryFn: () => api.get("/teachers").then((res) => res.data),
  });

  const teachers = data?.data || [];

  return (
    <>
      {/* Add Modal */}
      <AddTeacherModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <div className="max-w-7xl mx-auto">
        {/* Title + Add Button */}
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Teacher List
          </h1>

          <Button
            leftIcon={<Plus size={20} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Teacher
          </Button>
        </div>

        {/* Table */}
        <div className="border border-[#E2E8F0] shadow-[0px_8px_13px_-3px_rgba(0,0,0,0.08)] bg-white">
          <Table
            isFetching={isFetching}
            isError={isError}
            teachers={teachers}
          />
        </div>
      </div>
    </>
  );
}
