"use client";

import Button from "@/components/ui/Button";
import { Edit, Trash2, Eye, AlertCircle, Inbox } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteTeacherModal from "./DeleteModal";
import UpdateTeacherModal from "./UpdateModal";
import { Teacher } from "@/types/teacher";

type Props = {
  isFetching: boolean;
  isError: boolean;
  teachers: Teacher[];
};

export default function TeacherTable({
  isFetching,
  isError,
  teachers = [],
}: Props) {
  const router = useRouter();
  const colSpan = 4; // Name+Subject, Qualification, Profile Picture, Actions
  const [selectedItem, setSelectedItem] = useState<Teacher | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleUpdate = (teacher: Teacher) => {
    setSelectedItem(teacher);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (teacher: Teacher) => {
    setSelectedItem(teacher);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <UpdateTeacherModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        selectedItem={selectedItem}
      />

      <DeleteTeacherModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        selectedItem={selectedItem}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse text-sm md:text-base">
          <thead>
            <tr className="bg-[#3d50e0] text-base">
              <th className="p-3 md:p-5 text-left font-semibold text-white border-b">
                Name & Subject
              </th>
              <th className="p-3 md:p-5 text-left font-semibold text-white border-b">
                Qualification
              </th>
              <th className="p-3 md:p-5 text-left font-semibold text-white border-b">
                Profile Picture
              </th>
              <th className="p-3 md:p-5 text-right font-semibold text-white border-b">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {isFetching &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: colSpan }).map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </td>
                  ))}
                </tr>
              ))}

            {!isFetching && (isError || teachers.length === 0) && (
              <tr>
                <td colSpan={colSpan}>
                  <div className="flex flex-col items-center justify-center gap-2 w-full py-10">
                    {isError ? (
                      <AlertCircle size={32} className="text-red-600" />
                    ) : (
                      <Inbox size={32} className="text-gray-500" />
                    )}
                    <span
                      className={isError ? "text-red-600" : "text-gray-500"}
                    >
                      {isError
                        ? "Something went wrong while fetching teachers."
                        : "No teachers found."}
                    </span>
                  </div>
                </td>
              </tr>
            )}

            {!isFetching &&
              !isError &&
              teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-100">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold">{teacher.name}</span>
                      <span className="text-gray-600">{teacher.subject}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {teacher.qualification || "N/A"}
                  </td>

                  <td className="px-4 py-3">
                    {teacher.profilePicture ? (
                      <img
                        src={teacher.profilePicture}
                        alt={teacher.name}
                        className="h-10 w-10 object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2 items-center justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Edit size={16} />}
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        aria-label="Edit Teacher"
                        onClick={() => handleUpdate(teacher)}
                      />

                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Trash2 size={16} />}
                        className="border-red-600 text-red-600 hover:bg-red-50"
                        aria-label="Delete Teacher"
                        onClick={() => handleDelete(teacher)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
