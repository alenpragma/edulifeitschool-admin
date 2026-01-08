"use client";

import Button from "@/components/ui/Button";
import { Eye, Inbox, AlertCircle } from "lucide-react";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { Contact } from "@/types/contact"; // import your type
import ViewContactModal from "./ViewContactModal";
import { useState } from "react";

type Props = {
  isFetching: boolean;
  isError: boolean;
  contacts: Contact[];
};

export default function ContactTable({ isFetching, isError, contacts }: Props) {
  const router = useRouter();
  const colSpan = 5; // Contact, Email, Subject, Created At, Actions
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Contact | null>(null);

  return (
    <>
      <ViewContactModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        selectedItem={selectedItem}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse text-sm md:text-base">
          <thead>
            <tr className="bg-[#3d50e0] text-base">
              <th className="p-3 md:p-5 text-left font-semibold text-white border-b">
                Contact
              </th>
              <th className="p-3 md:p-5 text-left font-semibold text-white border-b">
                Email
              </th>
              <th className="p-3 md:p-5 text-left font-semibold text-white border-b">
                Subject
              </th>
              <th className="p-3 md:p-5 text-left font-semibold text-white border-b">
                Date Time
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

            {!isFetching && (isError || contacts.length === 0) && (
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
                        ? "Something went wrong while fetching contacts."
                        : "No contacts found."}
                    </span>
                  </div>
                </td>
              </tr>
            )}

            {!isFetching &&
              !isError &&
              contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-100">
                  {/* Name + Phone */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold">{contact.name}</span>
                      <span className="text-gray-600">{contact.phone}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3">{contact.email || "N/A"}</td>
                  <td className="px-4 py-3">{contact.subject}</td>
                  <td className="px-4 py-3">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions with optional green dot */}
                  <td className="px-4 py-3 text-right flex justify-end items-center gap-2">
                    {!contact.note && (
                      <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Eye size={16} />}
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        setSelectedItem(contact);
                        setIsViewModalOpen(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
